import {Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import {
  IntermediaryService,
  NewProductsService,
  WarehousesService,
  WarehouseService,
  AuthenticationService
} from '@suite/services';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { validators } from '../utils/validators';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { environment } from "../../../services/src/environments/environment";
import { PaginatorComponent } from '../components/paginator/paginator.component';
import {PickingNewProductsService} from "../../../services/src/lib/endpoint/picking-new-products/picking-new-products.service";
import {PickingNewProductsModel} from "../../../services/src/models/endpoints/PickingNewProducts";
import {PositionsToast} from "../../../services/src/models/positionsToast.type";
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";

@Component({
  selector: 'suite-requested-products',
  templateUrl: './requested-products.component.html',
  styleUrls: ['./requested-products.component.scss'],
})
export class RequestedProductsComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;

  public showFiltersMobileVersion = false;
  public itemIdsSelected: number[] = [];
  public selectedForm: FormGroup = this.formBuilder.group({
    selector: false
  }, {
    validators: validators.haveItems("toSelect")
  });
  public pagerValues: number[] = [50, 100, 500];
  public form: FormGroup = this.formBuilder.group({
    models: [],
    brands: [],
    sizes: [],
    seasons: [],
    colors: [],
    families: [],
    lifestyles: [],
    status: 0,
    tariffId: 0,
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: '',
      order: "asc"
    })
  });

  /** List of products */
  public products: PickingNewProductsModel.ReceivedProductsRequested[] = [];

  /** List of items for filters */
  public models: TagsInputOption[] = [];
  public brands: TagsInputOption[] = [];
  public sizes: TagsInputOption[] = [];
  public seasons: TagsInputOption[] = [];
  public colors: TagsInputOption[] = [];
  public families: TagsInputOption[] = [];
  public lifestyles: TagsInputOption[] = [];
  public groups: TagsInputOption[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private newProductsService: NewProductsService,
    private route: ActivatedRoute,
    private intermediaryService: IntermediaryService,
    private alertController: AlertController,
    private cd: ChangeDetectorRef,
    private warehouseService: WarehouseService,
    private warehousesService: WarehousesService,
    private authenticationService: AuthenticationService,
    private pickingNewProductsService: PickingNewProductsService,
    private toolbarProvider: ToolbarProvider
  ) { }

  //region Lifecycle events
  ngOnInit() {
    this.loadToolbarActions();
    this.startCleanScreen();
  }

  ngOnDestroy() {
    this.toolbarProvider.optionsActions.next([]);
  }
  //endregion

  private loadToolbarActions() {
    const actionsToolbar = [
      {
        icon: 'refresh',
        label: 'Recargar',
        action: () => this.restartScreen()
      }];

    if (this.itemIdsSelected.length > 0) {
      actionsToolbar.unshift({
        icon: 'checkmark',
        label: 'Marcar como atendidos',
        action: () => this.attendItems()
      });
    }

    this.toolbarProvider.optionsActions.next(actionsToolbar);
  }

  private async startCleanScreen() {
    this.selectedForm = this.formBuilder.group({
      selector: false
    }, {
      validators: validators.haveItems("toSelect")
    });
    this.loadReceivedItemsRequested();
  }

  private async loadReceivedItemsRequested() {
    if (await this.authenticationService.isStoreUser()) {
      const storeId = (await this.authenticationService.getStoreCurrentUser()).id;

      this.pickingNewProductsService
        .postListReceivedProductsRequested(storeId, null)
        .subscribe((res: PickingNewProductsModel.ReceivedProductsRequested[]) => {
          this.products = res;
          this.intermediaryService.dismissLoading();
          this.initSelectForm(this.products);
        }, (error) => {
          let errorMessage = 'Ha ocurrido un error al intentar consultar los productos recibidos que se han solicitado.';
          if (error.error.errors) {
            errorMessage = error.error.errors;
          }
          this.intermediaryService.dismissLoading();
          this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
        });
    }
  }

  private restartScreen() {
    this.startCleanScreen();
  }

  private attendItems() {
    this.intermediaryService.presentLoading('Marcando como antendido...', () => {
      this.pickingNewProductsService
        .putAttendReceivedProductsRequested({
          receivedProductsRequestedIds: this.itemIdsSelected
        })
        .subscribe((res) => {
          this.restartScreen();
        }, (error) => {
          let errorMessage = 'Ha ocurrido un error al intentar marcar los productos como ya atendidos.';
          if (error.error.errors) {
            errorMessage = error.error.errors;
          }
          this.intermediaryService.dismissLoading();
          this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
        });
    });
  }

  private sanitize(object) {
    /**mejorable */
    object = JSON.parse(JSON.stringify(object));
    if (!object.orderby.type) {
      delete object.orderby.type;
    } else {
      object.orderby.type = Number(object.orderby.type);
    }
    if (!object.orderby.order)
      delete object.orderby.order;
    if (object.productReferencePattern) {
      object.productReferencePattern = "%" + object.productReferencePattern + "%";
    }
    Object.keys(object).forEach(key => {
      if (object[key] instanceof Array) {
        if (object[key][0] instanceof Array) {
          object[key] = object[key][0];
        } else {
          for (let i = 0; i < object[key].length; i++) {
            if (object[key][i] === null || object[key][i] === "") {
              object[key].splice(i, 1);
            }
          }
        }
      }
      if (object[key] === null || object[key] === "") {
        delete object[key];
      }
    });
    return object;
  }

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  private initSelectForm(items): void {
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect", this.formBuilder.array(items.map(item => new FormControl(false))));
  }

  //region Methods for VIEW
  public selectAll(event): void {
    let value = event.detail.checked;

    for (let index = 0; index < this.products.length; index++) {
      if (!this.products[index].attended) {
        this.itemSelected(this.products[index].id, false);
        (<FormArray>this.selectedForm.controls.toSelect).controls[index].setValue(value);
      }
    }

    this.loadToolbarActions();
  }

  public openFiltersMobile() {
    this.showFiltersMobileVersion = !this.showFiltersMobileVersion;
  }

  public clearFilters() {

  }

  public applyFilters() {

  }

  public getPhotoUrl(priceObj: PickingNewProductsModel.ReceivedProductsRequested): string | boolean {
    let isPhotoTestUrl = false;

    if (priceObj.product.model && priceObj.product.model.photos.length > 0) {
      if (isPhotoTestUrl) {
        return 'https://ccc1.krackonline.com/131612-thickbox_default/krack-core-sallye.jpg';
      }

      return environment.urlBase + priceObj.product.model.photos[0].urn;
    }

    return false;
  }

  public itemSelected(item, reloadToolbarActions: boolean = true) {
    const index = this.itemIdsSelected.indexOf(item, 0);
    if (index > -1) {
      this.itemIdsSelected.splice(index, 1);
    } else {
      this.itemIdsSelected.push(item);
    }

    if (reloadToolbarActions) {
      this.loadToolbarActions();
    }
  }

  public getFamilyAndLifestyle(productObj: PickingNewProductsModel.ReceivedProductsRequested): string {
    let familyLifestyle: string[] = [];
    if (productObj.product.model.family) {
      familyLifestyle.push(productObj.product.model.family);
    }
    if (productObj.product.model.lifestyle) {
      familyLifestyle.push(productObj.product.model.lifestyle);
    }
    return familyLifestyle.join(' - ');
  }
  //endregion

  //#region GET & SET SECTION
  get warehouseId() {
    return this.form.get('warehouseId').value
  }

  set warehouseId(id) {
    this.form.patchValue({ status: id });
  }

  get status() {
    return this.form.get('status').value
  }

  set status(id) {
    this.form.patchValue({ status: id });
  }

  get tariffId() {
    return this.form.get('tariffId').value;
  }

  set tariffId(id) {
    this.form.patchValue({ tariffId: id });
  }
  //#endregion
}
