import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';

import {
  IntermediaryService,
  LabelsService,
  NewProductModel,
  NewProductsService,
  WarehousesService,
  WarehouseService,
  ProductsService, AuthenticationService, WarehouseModel, PackageReceivedService
} from '@suite/services';

import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { validators } from '../utils/validators';
import { AlertController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { environment } from "../../../services/src/environments/environment";
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { isNgTemplate } from '@angular/compiler';
// import {DateTimeParserService} from "../../services/src/lib/date-time-parser/date-time-parser.service";
import {DateTimeParserService} from  "../../../services/src/lib/date-time-parser/date-time-parser.service";
import * as moment from 'moment';


@Component({
  selector: 'suite-package-received',
  templateUrl: './package-received.component.html',
  styleUrls: ['./package-received.component.scss'],
})
export class PackageReceivedComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;

  public mobileVersionTypeList: 'list' | 'table' = 'list';
  public showFiltersMobileVersion = false;
  public itemIdSelected: any = [];
  private isStoreUser = false;
  private storeUserObj: WarehouseModel.Warehouse = null;
  dataSource: any;
  displayedColumns: string[] = ['select', 'model', 'range', 'family', 'lifestyle', 'brand', 'price'];
  warehouses: Array<any> = [];
  filterTypes: Array<NewProductModel.StatusType> = [];
  pricesDeleted: Array<NewProductModel.NewProduct> = [];

  selectedForm: FormGroup = this.formBuilder.group({
    selector: false
  }, {
    validators: validators.haveItems("toSelect")
  });

  pagerValues: Array<number> = [50, 100, 500];
  page: number = 0;
  limit: number = this.pagerValues[0];
  form: FormGroup = this.formBuilder.group({
    uniqueCode: [],
    deliveryRequestId: [],
    origin:[],
    date:[],
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: '',
      order: "asc"
    })
  });

  pauseListenFormChange = false;
  requestTimeout;
  stampe: number = 1;

  printAllStock: boolean = false;

  /**List of prices */
  packages: Array<any> = [];

  /**Filters */
  models: Array<TagsInputOption> = [];
  brands: Array<TagsInputOption> = [];
  sizes: Array<TagsInputOption> = [];
  seasons: Array<TagsInputOption> = [];
  colors: Array<TagsInputOption> = [];
  families: Array<TagsInputOption> = [];
  lifestyles: Array<TagsInputOption> = [];
  groups: Array<TagsInputOption> = [];

  date: Array<TagsInputOption> = [];
  uniqueCode: Array<TagsInputOption> = [];
  deliveryRequest: Array<TagsInputOption> = [];
  origin: Array<TagsInputOption> = [];


  constructor(
    private printerService: PrinterService,
    private formBuilder: FormBuilder,
    private newProductsService: NewProductsService,
    private packageReceivedService: PackageReceivedService,
    private route: ActivatedRoute,
    private intermediaryService: IntermediaryService,
    private alertController: AlertController,
    private cd: ChangeDetectorRef,
    private warehouseService: WarehouseService,
    private warehousesService: WarehousesService,
    private authenticationService: AuthenticationService,
    private dateTimeParserService: DateTimeParserService
  ) { }

  async ngOnInit() {
    this.isStoreUser = await this.authenticationService.isStoreUser();
    if (this.isStoreUser) {
      this.storeUserObj = await this.authenticationService.getStoreCurrentUser();
    }

    this.getWarehouses();
    // this.searchInContainer(this.sanitize(this.getFormValueCopy()));
    this.clearFilters();
  }

  async refresh() {
    this.ngOnInit();
  }

  switchPrintAllStock() {
    this.printAllStock = !this.printAllStock;
  }

  ngAfterViewInit(): void {
    this.listenChanges();
  }

  getWarehouses(): void {
    this.warehousesService.getIndex().then(observable => {
      observable.subscribe(warehouses => {
        this.warehouses = warehouses.body.data;
      });
    })
  }

  listenChanges(): void {
    let previousPageSize = this.limit;

    this.paginatorComponent.page.subscribe(page => {
      let flag = previousPageSize === page.pageSize;
      previousPageSize = page.pageSize;
      this.limit = page.pageSize;
      this.page = flag ? page.pageIndex : 1;

      this.form.value.pagination.page = this.page;
      this.form.value.pagination.limit = this.limit;
      this.searchInContainer(this.sanitize(this.getFormValueCopy()));
    });
  }

  selectAll(event): void {
    let value = event.detail.checked;

    for (let index = 0; index < this.packages.length; index++) {
      if (this.packages[index].status !== 3) {
        this.itemSelected(this.packages[index].id);
      }
    }
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control => {
      control.setValue(value);
    });
  }

  getNameOfStatus(id: number): string {
    return this.filterTypes.find(status => {
      return status.id === id
    }).name;
  }

  prevent(e): void {
    e.preventDefault();
    e.stopPropagation();
  }

  itemSelected(item) {
    const index = this.itemIdSelected.indexOf(item, 0);
    if (index > -1) {
      this.itemIdSelected.splice(index, 1);
    } else {
      this.itemIdSelected.push(item);
    }
  }


  openFiltersMobile() {
    this.showFiltersMobileVersion = !this.showFiltersMobileVersion;
  }

  sanitize(object) {
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

  initSelectForm(items): void {
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect", this.formBuilder.array(items.map(prices => new FormControl(false))));
  }

  searchInContainer(parameters): void {
    this.intermediaryService.presentLoading();
    this.packageReceivedService.getIndex(parameters).subscribe(data => {
      console.log(data);
      this.showFiltersMobileVersion = false;
      this.packages = data.results;

      this.initSelectForm(this.packages);
      this.dataSource = new MatTableDataSource<any>(this.packages);
      let paginator = data.pagination;
      this.paginatorComponent.length = paginator.totalResults;
      this.paginatorComponent.pageIndex = paginator.selectPage;
      this.paginatorComponent.lastPage = paginator.lastPage;
      this.groups = data.filters.ordertypes;
      this.intermediaryService.dismissLoading();
    }, () => {
      this.intermediaryService.dismissLoading();
    });
  }

  applyFilters() {
    console.log(this.form.get('uniqueCode').value);
    if (this.pauseListenFormChange) return;
    clearTimeout(this.requestTimeout);
    this.paginatorComponent.pageIndex = 0;
    this.requestTimeout = setTimeout(() => {
      this.searchInContainer(this.sanitize(this.getFormValueCopy()));
    }, 100);
  }

  getFilters(): void {
    const parameters = this.sanitize(this.getFormValueCopy());

    this.packageReceivedService.getAllFilters(parameters).subscribe(filters => {
        this.uniqueCode = filters.uniqueCode;
        this.deliveryRequest = filters.deliveryRequest;
        this.origin = filters.origin;
        let dateFilters = filters.date.map(date => {
          return { id: date.id, name: this.dateTimeParserService.date(date.name) };
        });
        let dataDate = dateFilters.map(data => {
          return {
            id:data.id,
            name:data.name
          }
        });
        this.date = this.uniqueDatesArray(dataDate);
        console.log('fechas', this.date);
        this.applyFilters();
    });
  }

  clearFilters() {
    this.form = this.formBuilder.group({
      uniqueCode: [],
      deliveryRequestId: [],
      origin:[],
      date:[],
      pagination: this.formBuilder.group({
        page: this.page || 1,
        limit: this.limit || this.pagerValues[0]
      }),
      orderby: this.formBuilder.group({
        type: '',
        order: "asc"
      })
    });
    this.getFilters();
  }

  getFamilyAndLifestyle(priceObj: NewProductModel.NewProduct): string {
    let familyLifestyle: string[] = [];
    if (priceObj.model.family) {
      familyLifestyle.push(priceObj.model.family.name);
    }
    if (priceObj.model.lifestyle) {
      familyLifestyle.push(priceObj.model.lifestyle.name);
    }
    return familyLifestyle.join(' - ');
  }

  verifyPricesDeleted() {
    this.pricesDeleted = [];
    this.selectedForm.value.toSelect.map((selected, i) => {
      if (selected && this.packages[i].status === 3) {
        this.pricesDeleted.push(this.packages[i]);
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

  changeStatusImpress() {
    this.packages.forEach((price) => {
      if (this.itemIdSelected.includes(price.id)) {
        price.status = 4;
      }
    });
    this.selectedForm.get('selector').setValue(false);
    this.cd.detectChanges();
    this.dataSource = new MatTableDataSource<NewProductModel.NewProduct>(this.packages);
    this.itemIdSelected = [];
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
      if (items[i].status !== 3 && items[i].status !== 7) {
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
      if (items[i].status === 3 || items[i].status === 7) {
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
      this.initSelectForm(this.packages);

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

      this.initSelectForm(this.packages);
    }, error => {
      this.intermediaryService.dismissLoading();
    });
  }

  async printPrices(items, warehouseId: number) {
    if (this.verifyPricesDeleted()) {
      await this.presentAlertConfirm(warehouseId, items);
    } else {
      this.printPricesWithoutDeleted(warehouseId, items);
    }
  }

  private sendPrint(price: any, sizeSelect: any) {
    let pricesReference = [];
    if (this.printAllStock) {
      for (let j = 0; j < price.stockStore.length; j++) {
        pricesReference.push({
          warehouseId: price.warehouse.id,
          tariffId: price.tariff.id,
          modelId: price.model.id,
          numRange: price.numRange,
          sizeId: sizeSelect.id
        });
      }
    }else {
      pricesReference.push({
        warehouseId: price.warehouse.id,
        tariffId: price.tariff.id,
        modelId: price.model.id,
        numRange: price.numRange,
        sizeId: sizeSelect.id
      });
    }
    this.intermediaryService.presentLoading('Imprimiendo');
    this.printerService.printPrices({ references: pricesReference }, true).subscribe(result => {
      this.intermediaryService.dismissLoading();
      this.searchInContainer(this.sanitize(this.getFormValueCopy()));
    }, error => {
      this.intermediaryService.dismissLoading();
    });
  }

  async printPrice(price: any) {
    let listItems = price.size.map((size, iSize) => {
      return {
        name: 'radio' + iSize,
        type: 'radio',
        label: size.name,
        value: iSize
      }
    });


    if (price.size && price.size.length > 1) {
      await this.presentAlertSelect(listItems, price);
    } else if (price.size && price.size.length === 1) {
      this.sendPrint(price, price.size[0]);
    }

  }

  private async presentAlertSelect(listItems: any[], price: any) {
    const alert = await this.alertController.create({
      header: 'Selecciona talla a usar',
      inputs: listItems,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Seleccionar',
          handler: (data) => {
            if (typeof data === 'undefined') {
              return false;
            }
            this.sendPrint(price, price.size[data]);
          }
        }
      ]
    });

    await alert.present();
  }

  private convertArrayFromPrint(data: any, outputArray?: Boolean): Array<any> {
    let dataJoin = [];
    let out;
    if (this.stampe === 1) {
      if (outputArray) {
        dataJoin.push(data);
        out = dataJoin;
      } else {
        out = data;
      }

    } else
      if (this.stampe > 1) {
        for (let i = 0; i < this.stampe; i++) {
          dataJoin.push(data);
        }
        out = dataJoin;
      }
    return out;
  }

  //#region GET & SET SECTION
  // get warehouseId() {
  //   return this.form.get('warehouseId').value
  // }

  // set warehouseId(id) {
  //   this.form.patchValue({ status: id });
  // }

  // get status() {
  //   return this.form.get('status').value
  // }

  // set status(id) {
  //   this.form.patchValue({ status: id });
  // }

  // get tariffId() {
  //   return this.form.get('tariffId').value;
  // }

  // set tariffId(id) {
  //   this.form.patchValue({ tariffId: id });
  // }
  //#endregion

  uniqueDatesArray(listArray: Array<any>) {
    let uniquesArray = [];
    let counting = 0;
    let found = false;

    for (let i = 0; i < listArray.length; i++) {
      for (let y = 0; y < uniquesArray.length; y++) {
        if (listArray[i].name == uniquesArray[y].name) {
          found = true;
        }
      }
      counting++;
      if (counting == 1 && found == false) {
          uniquesArray.push(listArray[i]);
      }
      found = false;
      counting = 0;
    }
    return uniquesArray;
  }

  formattedDate(date) {
    return moment(date).format("DD/MM/YYYY")
  }

}
