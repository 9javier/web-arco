import {Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, AfterViewInit} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import {
  IntermediaryService,
  NewProductsService,
  WarehousesService,
  WarehouseService,
  AuthenticationService, FiltersModel
} from '@suite/services';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { validators } from '../utils/validators';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { environment } from "../../../services/src/environments/environment";
import { PaginatorComponent } from '../components/paginator/paginator.component';
import {PickingNewProductsService} from "../../../services/src/lib/endpoint/picking-new-products/picking-new-products.service";
import {
  PickingNewProductsModel
} from "../../../services/src/models/endpoints/PickingNewProducts";
import {PositionsToast} from "../../../services/src/models/positionsToast.type";
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";
import {AppFiltersModel} from "../../../services/src/models/endpoints/AppFilters";
import {AppFiltersService} from "../../../services/src/lib/endpoint/app-filters/app-filters.service";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'suite-requested-products',
  templateUrl: './requested-products.component.html',
  styleUrls: ['./requested-products.component.scss'],
})
export class RequestedProductsComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;

  public showFiltersMobileVersion: boolean = false;
  pauseListenFormChange = false;
  /**timeout for send request */
  requestTimeout;
  /**previous reference to detect changes */
  previousProductReferencePattern = '';
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
    references: [],
    dates: [],
    sizes: [],
    families: [],
    lifestyles: [],
    productReferencePattern: [],
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
  public products: PickingNewProductsModel.ProductReceivedSearch[] = [];

  /** List of items for filters */
  models: Array<TagsInputOption> = [];
  brands: Array<TagsInputOption> = [];
  references: Array<TagsInputOption> = [];
  dates: Array<TagsInputOption> = [];
  sizes: Array<TagsInputOption> = [];
  families: Array<TagsInputOption> = [];
  lifestyles: Array<TagsInputOption> = [];
  groups: Array<TagsInputOption> = [];

  flagPageChange: boolean = false;
  flagSizeChange: boolean = false;

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
    private toolbarProvider: ToolbarProvider,
    private appFiltersService: AppFiltersService,
    private dateTimeParserService: DateTimeParserService
  ) { }

  //region Lifecycle events
  ngOnInit() {
    this.loadToolbarActions();
    this.clearFilters();
    this.listenChanges();
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
    this.clearFilters();
  }

  private async loadReceivedItemsRequested(parameters, applyFilter: boolean = false, initFilters: boolean = false){
    if(initFilters){
      applyFilter = false;
    }
    if(applyFilter){
      parameters.pagination.page = 1;
    }
    if (await this.authenticationService.isStoreUser()) {
      const storeId = (await this.authenticationService.getStoreCurrentUser()).id;
      this.pickingNewProductsService
        .postListReceivedProductsRequested(storeId, parameters)
        .subscribe(res => {
          this.products = res.data['results'];
          this.intermediaryService.dismissLoading();
          this.initSelectForm(this.products);
          this.updateFilterSourceOrdertypes(res.data['filters'].ordertypes);
          let paginator: any = res.data['pagination'];

          this.paginatorComponent.length = paginator.totalResults;
          this.paginatorComponent.pageIndex = paginator.selectPage;
          this.paginatorComponent.lastPage = paginator.lastPage;
          if(applyFilter){
            //this.saveFilters();
            this.form.get("pagination").patchValue({
              limit: this.form.value.pagination.limit,
              page: 1
            }, { emitEvent: false });
            //this.recoverFilters();
          }
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
    if(!object.orderby.type){
      delete object.orderby.type;
    }else{
      object.orderby.type = parseInt(object.orderby.type);
    }
    if(!object.orderby.order)
      delete object.orderby.order;
    Object.keys(object).forEach(key=>{
      if(object[key] instanceof Array){
        if(object[key][0] instanceof Array){
          object[key] = object[key][0];
        } else {
          for(let i = 0;i<object[key].length;i++) {
            if(object[key][i] === null || object[key][i] === "") {
              object[key].splice(i,1);
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

  openFiltersMobile() {
    this.showFiltersMobileVersion = !this.showFiltersMobileVersion;
  }

  public clearFilters() {
    this.form = this.formBuilder.group({
      models: [],
      brands: [],
      references: [],
      dates: [],
      sizes: [],
      families: [],
      lifestyles: [],
      productReferencePattern: [],
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
    this.getFilters();
  }

  private getFilters(): void {
    this.appFiltersService
      .postProductsRequested({})
      .subscribe((res: AppFiltersModel.ProductsRequested) => {
        this.brands = res.brands;
        this.references = res.references;
        this.models = res.models;
        this.sizes = res.sizes;
        this.lifestyles = res.lifestyles;
        this.families = res.families;
        this.dates = res.dates.map(date => {
          return { id: date.id, name: this.dateTimeParserService.date(date.name) };
        });
        this.groups = res.ordertypes;

        this.applyFilters(true);
      });
  }

  public applyFilters(init: boolean) {
    if (this.pauseListenFormChange) return;
    ///**format the reference */
    /**cant send a request in every keypress of reference, then cancel the previous request */
    clearTimeout(this.requestTimeout)
    /**it the change of the form is in reference launch new timeout with request in it */
    if(this.form.value.productReferencePattern != this.previousProductReferencePattern){
      /**Just need check the vality if the change happens in the reference */
      if(this.form.valid)
        this.requestTimeout = setTimeout(()=>{
          let flagApply = true;
          let flagInit = init;
          this.loadReceivedItemsRequested(this.sanitize(this.getFormValueCopy()), flagApply, flagInit);
        },1000);
    }else{
      /**reset the paginator to the 0 page */
      let flagApply = true;
      let flagInit = init;
      this.loadReceivedItemsRequested(this.sanitize(this.getFormValueCopy()), flagApply, flagInit);
    }
    /**assign the current reference to the previous reference */
    this.previousProductReferencePattern = this.form.value.productReferencePattern;
  }

  public getPhotoUrl(priceObj: PickingNewProductsModel.ProductReceivedSearch): string | boolean {
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

  private updateFilterSourceOrdertypes(ordertypes: FiltersModel.Group[]) {
    this.pauseListenFormChange = true;
    let value = this.form.get("orderby").get("type").value;
    this.groups = ordertypes;
    this.form.get("orderby").get("type").patchValue(value, {emitEvent: false});
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  public getFamilyAndLifestyle(productObj: PickingNewProductsModel.ProductReceivedSearch): string {
    let familyLifestyle: string[] = [];
    if (productObj.product.model.family) {
      familyLifestyle.push(productObj.product.model.family);
    }
    if (productObj.product.model.lifestyle) {
      familyLifestyle.push(productObj.product.model.lifestyle);
    }
    return familyLifestyle.join(' - ');
  }

  /**
   * Listen changes in form to resend the request for search
   */
  listenChanges():void{
    let previousPageSize = this.form.value.pagination.limit;
    let previousPageIndex = this.form.value.pagination.page;
    /**detect changes in the paginator */
    this.paginatorComponent.page.subscribe(page=>{
      /**true if only change the number of results */
      let flagSize = previousPageSize != page.pageSize;
      let flagIndex = previousPageIndex != page.pageIndex;
      this.flagSizeChange = flagSize;
      this.flagPageChange = flagIndex;
      previousPageSize = page.pageSize;
      previousPageIndex = page.pageIndex;
      if(flagIndex){
        this.form.get("pagination").patchValue({
          limit: previousPageSize,
          page: page.pageIndex
        });
      }else if(flagSize){
        this.form.get("pagination").patchValue({
          limit: page.pageSize,
          page: 1
        });
      }else{
        this.form.get("pagination").patchValue({
          limit: previousPageSize,
          page: previousPageIndex
        });
      }
    });

    /**detect changes in the form */
    this.form.statusChanges.subscribe(change=>{
      if(this.flagSizeChange || this.flagPageChange){
        if (this.pauseListenFormChange) return;
        ///**format the reference */
        /**cant send a request in every keypress of reference, then cancel the previous request */
        clearTimeout(this.requestTimeout)
        /**it the change of the form is in reference launch new timeout with request in it */
        if(this.form.value.productReferencePattern != this.previousProductReferencePattern){
          /**Just need check the vality if the change happens in the reference */
          if(this.form.valid){
            this.requestTimeout = setTimeout(() => {
              this.loadReceivedItemsRequested(this.sanitize(this.getFormValueCopy()));
            }, 1000);
          }
        }else{
          /**reset the paginator to the 0 page */
          this.loadReceivedItemsRequested(this.sanitize(this.getFormValueCopy()));
        }
        /**assign the current reference to the previous reference */
        this.previousProductReferencePattern = this.form.value.productReferencePattern;
        this.flagPageChange = false;
        this.flagSizeChange = false;
      }else{
        return;
      }
    });
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
