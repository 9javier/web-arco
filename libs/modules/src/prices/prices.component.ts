import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';

import {
  IntermediaryService,
  LabelsService,
  PriceModel,
  PriceService,
  WarehousesService,
  WarehouseService,
  ProductsService, AuthenticationService, WarehouseModel

} from '@suite/services';


import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { validators } from '../utils/validators';
import { NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import {environment} from "../../../services/src/environments/environment";

@Component({
  selector: 'suite-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;


  filterTypes: Array<PriceModel.StatusType> = [];

  warehouses: Array<any> = [];
  pagerValues: Array<number> = [50, 100, 500];

  page: number = 0;

  limit: number = this.pagerValues[0];

  selectAllBinding;

  /**timeout for send request */
  requestTimeout;
  /**previous reference to detect changes */
  pauseListenFormChange = false;

  form: FormGroup = this.formBuilder.group({
    models: [],
    brands: [],
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

  /**Filters */
  models: Array<TagsInputOption> = [];
  brands: Array<TagsInputOption> = [];
  seasons: Array<TagsInputOption> = [];
  colors: Array<TagsInputOption> = [];
  families: Array<TagsInputOption> = [];
  lifestyles: Array<TagsInputOption> = [];
  groups: Array<TagsInputOption> = [];

  /**List of SearchInContainer */
  searchsInContainer: Array<PriceModel.Price> = [];

  getWarehouses(): void {
    this.warehousesService.getIndex().then(observable => {
      observable.subscribe(warehouses => {
        this.warehouses = warehouses.body.data;
      });
    })
  }

  /**Arrays to be shown */
  labels: Array<any> = [];

  /**List of prices */
  prices: Array<PriceModel.Price> = [];

  /**form to select elements to print or for anything */
  selectedForm: FormGroup = this.formBuilder.group({
    selector: false
  }, {
      validators: validators.haveItems("toSelect")
    });

  displayedColumns: string[] = ['select', 'impress', 'model', 'range', 'family', 'lifestyle', 'brand', 'stock', 'price', 'image'];
  dataSource: any;

  public disableExpansionPanel: boolean = true;

  public mobileVersionTypeList: 'list'|'table' = 'list';
  public showFiltersMobileVersion: boolean = false;

  private isStoreUser: boolean = false;
  private storeUserObj: WarehouseModel.Warehouse = null;

  constructor(
    private printerService: PrinterService,
    private priceService: PriceService,
    private intermediaryService: IntermediaryService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private warehousesService: WarehousesService,
    private warehouseService: WarehouseService,
    private productsService: ProductsService,
    private authenticationService: AuthenticationService
  ) {

  }



  /**
   * clear empty values of objecto to sanitize it
   * @param object Object to sanitize
   * @return the sanitized object
   */
  sanitize(object) {
    /**mejorable */
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


  /**
   * Listen changes in form to resend the request for search
   */
  listenChanges(): void {
    let previousPageSize = this.limit
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.limit = page.pageSize;
      this.page = flag ? page.pageIndex + 1 : 1;

      this.form.value.pagination.page = this.page;
      this.form.value.pagination.limit = this.limit;

      this.searchInContainer(this.sanitize(this.getFormValueCopy()));
    });
  }

  /**
   * Select or unselect all visible labels
   * @param event to check the status
   */
  selectAll(event): void {
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control => {
      control.setValue(value);
    });
  }

  /**
   * Get the name of status based on id
   * @param id - the id of the status
   */
  getNameOfStatus(id: number): string {
    return this.filterTypes.find(status => {
      return status.id == id
    }).name;
  }
  /**
   * Print the selected labels
   * @param items - Reference items to extract he ids
   */
  async printPrices(items, warehouseId: number) {
    if (!warehouseId) {
      if (this.isStoreUser) {
        warehouseId = this.storeUserObj.id;
      } else {
        warehouseId = this.warehouseService.idWarehouseMain;
      }
    }

    let prices = this.selectedForm.value.toSelect.map((price, i) => {
      if (items[i].status != 3) {
        // console.log(items[i]);
        let object = {
          warehouseId: warehouseId,
          tariffId: items[i].tariff.id,
          modelId: items[i].model.id,
          numRange: items[i].numRange
        }
        return price ? object : false
      }
    })
      .filter(price => price);

    this.intermediaryService.presentLoading("Imprimiendo los productos seleccionados");
    this.printerService.printPrices({ references: prices }).subscribe(result => {
      // console.log("result of impressions", result);
      this.intermediaryService.dismissLoading();
      this.searchInContainer(this.sanitize(this.getFormValueCopy()));
    }, error => {
      this.intermediaryService.dismissLoading();
      // console.log(error);
    });

  }

  async ngOnInit() {
    this.isStoreUser = await this.authenticationService.isStoreUser();
    if (this.isStoreUser) {
      this.storeUserObj = await this.authenticationService.getStoreCurrentUser();
    }

    this.getWarehouses();

    this.clearFilters();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.listenChanges();
  }


  /**
   * Cancel event and stop it propagation
   * @params e - the event to cancel
   */
  prevent(e): void {
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Init selectForm controls
   * @param items - reference items for create the formControls
   */
  initSelectForm(items): void {
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect", this.formBuilder.array(items.map(prices => new FormControl(false))));
  }

  // TODO REMOVE AS SOON AS POSIBLE
  /**
   * Get the tarif associatest to a tariff
   * @param tariffId - the id of the tariff
   * @param page
   * @param limit
   */
  // getPrices(tariffId:number,page:number,limit:number, status:number,warehouseId:number):void{
  //   this.intermediaryService.presentLoading();
  //   this.priceService.getIndex(tariffId, page, limit, status,warehouseId).subscribe(prices=>{
  //     this.intermediaryService.dismissLoading();
  //     this.prices = prices.results;
  //     this.initSelectForm(this.prices);
  //     this.dataSource = new MatTableDataSource<PriceModel.Price>(this.prices);
  //     let paginator = prices.pagination;
  //     this.paginator.length = paginator.totalResults;
  //     this.paginator.pageIndex = paginator.page - 1;
  //   },()=>{
  //     this.intermediaryService.dismissLoading();
  //   });
  // }

  /**
   * get all filters to fill the selects
   */
  getFilters(): void {
    this.productsService.getAllFilters(this.sanitize(this.getFormValueCopy())).subscribe(filters => {
      this.colors = filters.colors;
      this.brands = filters.brands;
      this.seasons = filters.seasons;
      this.models = filters.models;
      this.families = filters.families;
      this.lifestyles = filters.lifestyles;

      this.applyFilters();
    });
  }

  /**
   * search products in container by criteria
   * @param parameters - parameters to search
   */
  searchInContainer(parameters): void {
    this.intermediaryService.presentLoading();
    this.priceService.getIndex(parameters).subscribe(prices => {
      this.showFiltersMobileVersion = false;
      this.prices = prices.results;
      this.initSelectForm(this.prices);
      this.dataSource = new MatTableDataSource<PriceModel.Price>(this.prices);
      let paginator = prices.pagination;
      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.page - 1;
      this.groups = prices.filters.ordertypes;
      this.intermediaryService.dismissLoading();
    }, () => {
      this.intermediaryService.dismissLoading();
    });
  }

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  processProductSizesRange(price): string {
    let sizesRange = '';

    if (price.rangesNumbers) {
      if (price.rangesNumbers.sizeRangeNumberMin && price.rangesNumbers.sizeRangeNumberMax && price.rangesNumbers.sizeRangeNumberMin == price.rangesNumbers.sizeRangeNumberMax) {
        sizesRange = price.rangesNumbers.sizeRangeNumberMin;
      } else {
        sizesRange = price.rangesNumbers.sizeRangeNumberMin + '-' + price.rangesNumbers.sizeRangeNumberMax;
      }
    } else {
      sizesRange = '';
    }

    return sizesRange;
  }

  getFinalPrice(priceObj): string {
    if (priceObj.priceOriginal) {
      if (priceObj.priceDiscountOutlet && priceObj.priceDiscountOutlet != '0.00' && priceObj.priceDiscountOutlet != '0,00' && priceObj.priceOriginal != priceObj.priceDiscountOutlet) {
        return priceObj.priceDiscountOutlet;
      } else if (priceObj.priceDiscount && priceObj.priceDiscount != '0.00' && priceObj.priceDiscount != '0,00' && priceObj.priceOriginal != priceObj.priceDiscount) {
        return priceObj.priceDiscount;
      } else {
        return priceObj.priceOriginal;
      }
    }

    return '';
  }

  getFinalDiscountPercent(priceObj): string {
    if (priceObj.percentOutlet && priceObj.percentOutlet != 0) {
      return priceObj.percentOutlet;
    } else if (priceObj.percent && priceObj.percent != 0) {
      return priceObj.percent;
    }
    return null;
  }

  getPhotoUrl(priceObj: PriceModel.Price): string|boolean {
    let isPhotoTestUrl: boolean = false;

    if (priceObj.model && priceObj.model.has_photos && priceObj.model.photos.length > 0) {
      if (isPhotoTestUrl) {
        return 'https://ccc1.krackonline.com/131612-thickbox_default/krack-core-sallye.jpg';
      }

      return environment.urlBase + priceObj.model.photos[0].urn;
    }

    return false;
  }

  getPhotoUrlDesktop(price: PriceModel.Price): string {
    let photoUrl = this.getPhotoUrl(price);

    if (!photoUrl) {
      return '../assets/img/placeholder-product.jpg';
    }

    return photoUrl.toString();
  }

  openFiltersMobile() {
    this.showFiltersMobileVersion = !this.showFiltersMobileVersion;
  }

  getFamilyAndLifestyle(priceObj: PriceModel.Price): string {
    let familyLifestyle: string[] = [];
    if (priceObj.model.family) {
      familyLifestyle.push(priceObj.model.family.name);
    }
    if (priceObj.model.lifestyle) {
      familyLifestyle.push(priceObj.model.lifestyle.name);
    }
    return familyLifestyle.join(' - ');
  }

  applyFilters() {
    if (this.pauseListenFormChange) return;
    clearTimeout(this.requestTimeout);
    this.paginator.pageIndex = 0;
    this.requestTimeout = setTimeout(() => {
      this.searchInContainer(this.sanitize(this.getFormValueCopy()));
    }, 100);
  }

  clearFilters() {
    this.form = this.formBuilder.group({
      models: [],
      brands: [],
      seasons: [],
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
      })
    });

    this.priceService.getStatusEnum().subscribe(status => {
      this.filterTypes = status;
      this.status = this.filterTypes.find((status) => {
        return status.name.toLowerCase() == "todos";
      }).id;
      this.route.paramMap.subscribe(params => {
        this.tariffId = Number(params.get("tariffId"));
        this.getFilters();
      });
    });
  }

  // GET & SET SECTION
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
}
