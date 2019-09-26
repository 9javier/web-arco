import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PickingNewProductsService} from "../../../../services/src/lib/endpoint/picking-new-products/picking-new-products.service";
import {PickingNewProductsModel} from "../../../../services/src/models/endpoints/PickingNewProducts";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {validators} from "../../utils/validators";
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";
import {IntermediaryService} from '@suite/services';
import {MatPaginator} from "@angular/material";
import {TagsInputOption} from "../../components/tags-input/models/tags-input-option.model";
import {AppFiltersService} from "../../../../services/src/lib/endpoint/app-filters/app-filters.service";
import {AppFiltersModel} from "../../../../services/src/models/endpoints/AppFilters";
import {DateTimeParserService} from "../../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'list-received-product',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListReceivedProductTemplateComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pagerValues: Array<number> = [50, 100, 500];
  limit: number = this.pagerValues[0];
  page: number = 0;

  formFilters: FormGroup = this.formBuilder.group({
    models: [],
    sizes: [],
    dates: [],
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
    }),
    hideImpress: false
  });

  models: Array<TagsInputOption> = [];
  sizes: Array<TagsInputOption> = [];
  colors: Array<TagsInputOption> = [];
  dates: Array<TagsInputOption> = [];
  families: Array<TagsInputOption> = [];
  lifestyles: Array<TagsInputOption> = [];
  ordertypes: Array<TagsInputOption> = [];

  showFilters: boolean = false;

  requestTimeout: any = null;
  pauseListenFormChange = false;

  productsReceived: Array<PickingNewProductsModel.ProductReceivedSearched> = [];

  selectedForm: FormGroup = this.formBuilder.group({
    selector: false
  },{
    validators: validators.haveItems("toSelect")
  });

  constructor(
    private formBuilder: FormBuilder,
    private pickingNewProductsService: PickingNewProductsService,
    private printerService: PrinterService,
    private intermediaryService: IntermediaryService,
    private appFiltersService: AppFiltersService,
    private dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {
    this.clearFilters();
  }

  ngAfterViewInit() : void {
    this.listenChangesPaginator();
  }

  public printProductsPrices() {
    let productReferences = this.selectedForm.value.toSelect
      .map((selected, i) => {
        return selected ? this.productsReceived[i].productShoesUnit.reference : false;
      })
      .filter(productReference => productReference);

    if (productReferences.length > 0) {
      this.intermediaryService.presentLoading();
      this.printerService.printTagPrices(productReferences)
        .subscribe(() => {
          this.initSelectedForm();
        }, (error) => {
          console.error('An error succeed to try print products received. \nError:', error);
        }, () => {
          this.intermediaryService.dismissLoading();
        });
    }
  }

  public selectAll(event): void {
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control => {
      control.setValue(value);
    });
  }

  public openFilters() {
    this.showFilters = !this.showFilters;
  }

  public async applyFilters() {
    await this.intermediaryService.presentLoading('Cargando productos...');
    if (this.pauseListenFormChange) return;
    clearTimeout(this.requestTimeout);
    this.paginator.pageIndex = 0;
    this.requestTimeout = setTimeout(() => {
      this.searchProductsReceived(this.sanitize(this.getFormValueCopy()));
    }, 100);
  }

  private initSelectedForm() {
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect", this.formBuilder.array(this.productsReceived.map(prices => new FormControl(false))));
  }

  private listenChangesPaginator(): void {
    let previousPageSize = this.limit;

    this.paginator.page.subscribe(page => {
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.limit = page.pageSize;
      this.page = flag ? page.pageIndex + 1 : 1;

      this.formFilters.value.pagination.page = this.page;
      this.formFilters.value.pagination.limit = this.limit;

      this.searchProductsReceived(this.sanitize(this.getFormValueCopy()));
    });
  }

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.formFilters.value || {}));
  }

  private sanitize(object) {
    object = JSON.parse(JSON.stringify(object));
    if (!object.orderby.type) {
      delete object.orderby.type;
    } else {
      object.orderby.type = parseInt(object.orderby.type);
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

  private clearFilters() {
    this.formFilters = this.formBuilder.group({
      models: [],
      sizes: [],
      dates: [],
      colors: [],
      families: [],
      lifestyles: [],
      status: 0,
      tariffId: 0,
      pagination: this.formBuilder.group({
        page: this.page || 1,
        limit: this.limit || this.pagerValues[0]
      }),
      orderby: this.formBuilder.group({
        type: '',
        order: "asc"
      }),
      hideImpress: false
    });

    this.getFilters();
  }

  private getFilters(): void {
    this.appFiltersService
      .postProductsReceived({})
      .subscribe((res: AppFiltersModel.ProductsReceived) => {
      this.colors = res.colors;
      this.models = res.models;
      this.sizes = res.sizes;
      this.lifestyles = res.lifestyles;
      this.families = res.families;
      this.dates = res.dates.map(date => {
        return { id: date.id, name: this.dateTimeParserService.date(date.name) };
      });
      this.ordertypes = res.ordertypes;

      this.applyFilters();
    });
  }

  private searchProductsReceived(parameters) {
    this.pickingNewProductsService
      .postSearch(parameters)
      .subscribe(async (res: PickingNewProductsModel.Search) => {
        this.productsReceived = res.results;
        this.initSelectedForm();
        this.showFilters = false;
        let paginator = res.pagination;
        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.page - 1;
        await this.intermediaryService.dismissLoading();
      }, async (error) => {
        console.error('Error::Subscribe::GetByWarehouseIdPickingId -> ', error);
        await this.intermediaryService.dismissLoading();
      });
  }

}
