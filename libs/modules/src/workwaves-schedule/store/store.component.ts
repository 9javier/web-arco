import { Component, OnInit } from '@angular/core';
import {LoadingController, ModalController, ToastController} from "@ionic/angular";
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import {TypeModel} from "../../../../services/src/models/endpoints/Type";
import {TypesService} from "../../../../services/src/lib/endpoint/types/types.service";
import {WarehouseService} from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import {WarehouseModel} from "@suite/services";
import {DateTimeParserService} from "../../../../services/src/lib/date-time-parser/date-time-parser.service";
import {NgxMaterialTimepickerTheme} from "ngx-material-timepicker";

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  workwaveType: string = 'schedule';
  listWarehouses: WarehouseModel.Warehouse[];
  listTypesExecution: TypeModel.Type[];
  listTypesPacking: TypeModel.Type[];
  listTypesShippingOrder: TypeModel.Type[];
  listTypesGeneration: TypeModel.Type[];

  workwave: WorkwaveModel.Workwave = {};

  loading = null;

  darkTheme: NgxMaterialTimepickerTheme = {};

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private workwavesService: WorkwavesService,
    private warehouseService: WarehouseService,
    private typesService: TypesService,
    private dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {
    this.initializeAllFields();
    this.listWarehouses = this.warehouseService.listWarehouses;
    this.listTypesExecution = this.typesService.listExecution;
    this.listTypesPacking = this.typesService.listPacking;
    this.listTypesGeneration= this.typesService.listGeneration;
    this.listTypesShippingOrder = this.typesService.listShippingOrder;
    this.darkTheme = {
      container: {
        bodyBackgroundColor: '#EEEEEE',
        buttonColor: '#212121',
        primaryFontFamily: '#212121'
      },
      dial: {
        dialBackgroundColor: '#212121',
      },
      clockFace: {
        clockFaceBackgroundColor: '#fff',
        clockHandColor: '#212121',
        clockFaceTimeInactiveColor: '#212121'
      }
    }
  }

  goToList() {
    this.modalController.dismiss();
  }

  saveWorkwave() {

  }

  workwaveOk() {
    if (this.workwaveType == 'schedule') {
      if (this.workwave.warehouseId && this.workwave.time && this.workwave.typeShippingOrder && this.workwave.typeGeneration && this.workwave.typePacking && (this.workwave.date || this.workwave.everyday)) {
        return false;
      }
    } else if (this.workwaveType == 'template') {
      if (this.workwave.warehouseId && this.workwave.name && this.workwave.description && this.workwave.typeShippingOrder && this.workwave.typeGeneration && this.workwave.typePacking && this.workwave.typeExecution) {
        return false;
      }
    } else {
      if (this.workwave.warehouseId && this.workwave.typeShippingOrder && this.workwave.typeGeneration && this.workwave.typePacking) {
        return false;
      }
    }
    return true;
  }

  initializeAllFields() {
    this.workwave.name = null;
    this.workwave.description = null;
    this.workwave.date = null;
    this.workwave.time = null;
    this.workwave.everyday = false;
    this.workwave.warehouseId = null;
    this.workwave.typeGeneration = null;
    this.workwave.typeExecution = null;
    this.workwave.typePacking = null;
    this.workwave.typeShippingOrder = null;
  }

  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3750,
      color: color || "primary"
    });
    toast.present();
  }

}
