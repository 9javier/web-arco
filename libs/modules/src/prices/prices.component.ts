import { SliderComponent } from './components/slider/slider.component';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import {
  IntermediaryService,
  PriceModel,
  PriceService,
  WarehousesService,
  WarehouseService,
  ProductsService, AuthenticationService, WarehouseModel

} from '@suite/services';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { validators } from '../utils/validators';
import { AlertController, NavParams, PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { environment } from "../../../services/src/environments/environment";
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { Range } from './interfaces/range.interface';
import { PricesRangePopoverComponent } from "./prices-range-popover/prices-range-popover.component";
import { PricesRangePopoverProvider } from "../../../services/src/providers/prices-range-popover/prices-range-popover.provider";
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";
import {AuditMultipleScanditService} from "../../../services/src/lib/scandit/audit-multiple/audit-multiple.service";
import {TariffPricesScanditService} from "../../../services/src/lib/scandit/tariff-prices/tariff-prices.service";
import { HolderTooltipText } from '../../../services/src/lib/tooltipText/holderTooltipText.service';


@Component({
  selector: 'suite-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;

  filterTypes: Array<PriceModel.StatusType> = [];
  pricesDeleted: Array<PriceModel.Price> = [];
  minPrices: number = 0;
  maxPrices: number = 1000;
  warehouses: Array<any> = [];
  pagerValues: Array<number> = [50, 100, 500];
  tariffName: '';
  page: number = 0;
  public itemIdSelected: any = [];

  limit: number = this.pagerValues[0];

  selectAllBinding;

  /**timeout for send request */
  requestTimeout;
  /**previous reference to detect changes */
  pauseListenFormChange = false;

  form: FormGroup = this.formBuilder.group({
    models: [],
    brands: [],
    sizes: [],
    seasons: [],
    colors: [],
    families: [],
    lifestyles: [],
    status: 0,
    tariffId: 0,
    prices: this.formBuilder.group({
      min: 0,
      max: 100
    }),
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
  sizes: Array<TagsInputOption> = [];
  seasons: Array<TagsInputOption> = [];
  colors: Array<TagsInputOption> = [];
  families: Array<TagsInputOption> = [];
  lifestyles: Array<TagsInputOption> = [];
  groups: Array<TagsInputOption> = [];
  priceses: Range;

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

  printAllStock: boolean = false;

  public disableExpansionPanel: boolean = true;

  public mobileVersionTypeList: 'list' | 'table' = 'list';
  public showFiltersMobileVersion: boolean = false;

  private isStoreUser: boolean = false;
  private storeUserObj: WarehouseModel.Warehouse = null;

  private isLoadingProductPrices: boolean = false;

  constructor(
    private printerService: PrinterService,
    private priceService: PriceService,
    private intermediaryService: IntermediaryService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private warehousesService: WarehousesService,
    private warehouseService: WarehouseService,
    private productsService: ProductsService,
    private authenticationService: AuthenticationService,
    private cd: ChangeDetectorRef,
    private alertController: AlertController,
    private popoverCtrl: PopoverController,
    public pricesRangePopoverProvider: PricesRangePopoverProvider,
    private popoverController: PopoverController,
    private toolbarProvider: ToolbarProvider,
    private tariffPricesScanditService: TariffPricesScanditService,
    private holderTooltipText: HolderTooltipText,
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.name) {
        this.tariffName = JSON.parse(params.name);
      }
    });
  }


  btnOnClick(idElement:string){
    this.holderTooltipText.setTootlTip(idElement,false);
  }

  getTotalStock(price: PriceModel.Price): number {
    let stock: number = 0;
    if (price.stockStore) {
      for (let stockStore of price.stockStore) {
        stock += stockStore.cantidad;
      }
    }
    return stock;
  }

  switchPrintAllStock() {
    this.printAllStock = !this.printAllStock;
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
    this.paginatorComponent.page.subscribe(page => {
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.limit = page.pageSize;
      this.page = flag ? page.pageIndex : 1;

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

    for (let index = 0; index < this.prices.length; index++) {
      if (this.prices[index].status !== 3) {
        this.itemSelected(this.prices[index].id);
      }
    }
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

  // Item seleccionados
  itemSelected(item) {
    const index = this.itemIdSelected.indexOf(item, 0);
    if (index > -1) {
      this.itemIdSelected.splice(index, 1);
    } else {
      this.itemIdSelected.push(item);
    }
  }

  changeStatusImpress() {
    this.prices.forEach((price) => {
      if (this.itemIdSelected.includes(price.id)) {
        price.status = 4;
      }
    });
    this.selectedForm.get('selector').setValue(false);
    this.cd.detectChanges();
    this.dataSource = new MatTableDataSource<PriceModel.Price>(this.prices);
    this.itemIdSelected = [];
  }
  /**
   * Print the selected labels
   * @param items - Reference items to extract he ids
   */
  async printPrices(items, warehouseId: number) {
    //this.initSelectForm(this.prices);

    if (this.verifyPricesDeleted()) {
      await this.presentAlertConfirm(warehouseId, items);
    } else {
      this.printPricesWithoutDeleted(warehouseId, items);
    }
  }

  private printPricesWithDeleted(warehouseId: number, items) {

    if (!warehouseId) {
      if (this.isStoreUser) {
        warehouseId = this.storeUserObj.id;
      } else {
        warehouseId = this.warehouseService.idWarehouseMain;
      }
    }

    let prices = this.selectedForm.value.toSelect.map((price, i) => {
      if (items[i].status != 3 && items[i].status != 7) {
        let object = {
          warehouseId: warehouseId,
          tariffId: items[i].tariff.id,
          modelId: items[i].model.id,
          numRange: items[i].numRange
        };
        return price ? object : false;
      }
    })
      .filter(price => price);

    let pricesDeleted = this.selectedForm.value.toSelect.map((priceD, i) => {
      if (items[i].status == 3 || items[i].status == 7) {
        let priceDeleted: any = items[i];
        let object = {
          warehouseId: this.isStoreUser ? this.storeUserObj.id : null,
          modelId: priceDeleted.model.id,
          numRange: priceDeleted.numRange
        };
        return priceD ? object : false;
      }
    })
      .filter(priceD => priceD);

    prices = prices.concat(pricesDeleted);

    this.intermediaryService.presentLoading('Imprimiendo los productos seleccionados');
    this.printerService.printPrices({ references: prices }).subscribe(result => {
      this.intermediaryService.dismissLoading();

      if (result) {
        this.changeStatusImpress();
      }
      this.initSelectForm(this.prices);

      //this.searchInContainer(this.sanitize(this.getFormValueCopy()));
    }, error => {
      this.intermediaryService.dismissLoading();
    });
  }

  private printPricesWithoutDeleted(warehouseId: number, items) {
    if (!warehouseId) {
      if (this.isStoreUser) {
        warehouseId = this.storeUserObj.id;
      } else {
        warehouseId = this.warehouseService.idWarehouseMain;
      }
    }

    let prices = [];

    for (let i = 0; i < this.selectedForm.value.toSelect.length; i++) {
      if (this.selectedForm.value.toSelect[i] && items[i].status != 3) {
        if (this.printAllStock) {
          for (let j = 0; j < items[i].stockStore.length; j++) {
            prices.push({
              warehouseId: warehouseId,
              tariffId: items[i].tariff.id,
              modelId: items[i].model.id,
              numRange: items[i].numRange
            });
          }
        } else {
          prices.push({
            warehouseId: warehouseId,
            tariffId: items[i].tariff.id,
            modelId: items[i].model.id,
            numRange: items[i].numRange
          });
        }
      }
    }

    this.intermediaryService.presentLoading('Imprimiendo los productos seleccionados');
    this.printerService.printPrices({ references: prices }).subscribe(result => {
      this.intermediaryService.dismissLoading();

      if (result) {
        this.changeStatusImpress();
      }

      this.initSelectForm(this.prices);

      //this.searchInContainer(this.sanitize(this.getFormValueCopy()));
    }, error => {
      this.intermediaryService.dismissLoading();
    });
  }

  async ngOnInit() {
    this.addScannerButton();
    this.isStoreUser = await this.authenticationService.isStoreUser();
    if (this.isStoreUser) {
      this.storeUserObj = await this.authenticationService.getStoreCurrentUser();
    }

    this.toolbarProvider.currentPage.next(this.tariffName);

    if (!this.isLoadingProductPrices) {
      this.isLoadingProductPrices = true;
      this.intermediaryService.presentLoading().then(() => {
        this.clearFilters();
      });
    } else {
      this.clearFilters();
    }

    this.getWarehouses();
  }

  ngOnDestroy(){
    this.toolbarProvider.optionsActions.next([]);
  }

  addScannerButton(){
    const buttons = [{
      icon: 'qr-scanner',
      label: 'Escáner',
      action: async () => {
        let warehouseId = this.isStoreUser ? this.storeUserObj.id : this.warehouseService.idWarehouseMain;
        this.tariffPricesScanditService.init(warehouseId, this.tariffId);
      }
    }];
    this.toolbarProvider.optionsActions.next(buttons);
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
    this.priceses = {
      min: 0,
      max: 1000
    }
    this.productsService.getAllFilters(this.sanitize(this.getFormValueCopy())).subscribe(filters => {

      this.colors = filters.colors;
      this.brands = filters.brands;
      this.sizes = filters.sizes;
      this.seasons = filters.seasons;
      this.models = filters.models;
      this.families = filters.families;
      this.lifestyles = filters.lifestyles;
      this.priceses = filters.prices;
      this.minPrices = this.priceses.min;
      this.maxPrices = this.priceses.max;
      this.form.patchValue({
        prices: filters.prices
      })
      this.applyFilters();

      this.pricesRangePopoverProvider.minValue = this.priceses.min;
      this.pricesRangePopoverProvider.maxValue = this.priceses.max;
      this.pricesRangePopoverProvider.minValueSelected = this.pricesRangePopoverProvider.minValue;
      this.pricesRangePopoverProvider.maxValueSelected = this.pricesRangePopoverProvider.maxValue;
    });
  }

  /**
   * search products in container by criteria
   * @param parameters - parameters to search
   */
  searchInContainer(parameters): void {
    if (!this.isLoadingProductPrices) {
      this.isLoadingProductPrices = true;
      this.intermediaryService.presentLoading().then(() => {
        this.priceService.getIndex(parameters).subscribe(prices => {
          this.showFiltersMobileVersion = false;
          this.prices = prices.results;
          this.initSelectForm(this.prices);
          this.dataSource = new MatTableDataSource<PriceModel.Price>(this.prices);
          let paginator = prices.pagination;
          this.paginatorComponent.length = paginator.totalResults;
          this.paginatorComponent.pageIndex = paginator.selectPage;
          this.paginatorComponent.lastPage = paginator.lastPage;
          this.groups = prices.filters.ordertypes;
          this.intermediaryService.dismissLoading().then(() => this.isLoadingProductPrices = false);
        }, () => {
          this.intermediaryService.dismissLoading().then(() => this.isLoadingProductPrices = false);
        });
      })
    } else {
      this.priceService.getIndex(parameters).subscribe(prices => {
        this.showFiltersMobileVersion = false;
        this.prices = prices.results;
        this.initSelectForm(this.prices);
        this.dataSource = new MatTableDataSource<PriceModel.Price>(this.prices);
        let paginator = prices.pagination;
        this.paginatorComponent.length = paginator.totalResults;
        this.paginatorComponent.pageIndex = paginator.selectPage;
        this.paginatorComponent.lastPage = paginator.lastPage;
        this.groups = prices.filters.ordertypes;
        this.intermediaryService.dismissLoading().then(() => this.isLoadingProductPrices = false);
      }, () => {
        this.intermediaryService.dismissLoading().then(() => this.isLoadingProductPrices = false);
      });
    }
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

  getPhotoUrl(priceObj: PriceModel.Price): string | boolean {
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
    this.paginatorComponent.pageIndex = 0;
    this.requestTimeout = setTimeout(() => {
      this.form.patchValue({
        prices: {
          min: this.pricesRangePopoverProvider.minValueSelected,
          max: this.pricesRangePopoverProvider.maxValueSelected
        }
      });

      this.searchInContainer(this.sanitize(this.getFormValueCopy()));
    }, 100);
  }

  clearFilters() {
    this.form = this.formBuilder.group({
      models: [],
      brands: [],
      sizes: [],
      seasons: [],
      colors: [],
      families: [],
      lifestyles: [],
      status: 0,
      size: 0,
      tariffId: 0,
      prices: {
        min: 0,
        max: 1000
      },
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

  verifyPricesDeleted() {
    this.pricesDeleted = [];
    this.selectedForm.value.toSelect.map((selected, i) => {
      if (selected && this.prices[i].status === 3) {
        this.pricesDeleted.push(this.prices[i]);
      }
    }).filter(price => price);

    return !!this.pricesDeleted.length;
  }

  async presentAlertConfirm(warehouseId: number, items) {
    const num = this.pricesDeleted.length;
    const messageSingular = `Existe ${num} tarifa eliminada. ¿Desea imprimir el precio actual?`;
    const messagePlural = `Existen ${num} tarifas eliminadas. ¿Desea imprimir el precio actual?`;
    const alert = await this.alertController.create({
      header: '¡Confirmar!',
      message: num > 1 ? messagePlural : messageSingular,
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.printPricesWithDeleted(warehouseId, items);
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }
      ]
    });

    await alert.present();
  }

  async showPricesPopover(ev) {
    const popover = await this.popoverCtrl.create({
      cssClass: 'popover-filter',
      component: PricesRangePopoverComponent,
      event: ev
    });

    await popover.present();
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

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: SliderComponent,
      event: ev,
      translucent: true,
      mode: 'ios',
      cssClass: 'custom-popover',
      componentProps: {
        params: { min: this.priceses.min, max: this.priceses.max },
        values: { min: this.minPrices, max: this.maxPrices }

      }
    });
    popover.onDidDismiss().then(data => {
      this.minPrices = data.data.min;
      this.maxPrices = data.data.max;
      this.form.patchValue({
        prices: {
          min: data.data.min,
          max: data.data.max
        }
      })

    })
    return await popover.present();
  }
}
