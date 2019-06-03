import {Component, Input, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {StoreComponent} from "../store/store.component";
import {AlertController, ModalController} from "@ionic/angular";
import {WarehouseService} from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";

@Component({
  selector: 'list-workwave-template',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwaveTemplateComponent implements OnInit {

  @Input() templateToEdit: any;
  @Input() typeWorkwave: number;
  listStoresTemplates: any[];
  template: any;

  public RUN_NOW_TASK_ID = 1;

  constructor(
    private location: Location,
    private modalController: ModalController,
    private alertController: AlertController,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit() {
    this.listStoresTemplates = this.warehouseService.warehousesWithRacks.map((warehouse) => {
      return {
        checked: false,
        warehouseId: warehouse.id,
        name: warehouse.reference+' '+warehouse.name,
        thresholdConsolidated: 0,
        thresholdShippingStore: 0,
        replace: '',
        allocate: '',
        typeGeneration: '',
        typePacking: '',
        typeShippingOrder: 0
      }
    });

    if (this.templateToEdit) {
      this.template = {
        name: this.templateToEdit.name || 'Ola de trabajo // '+this.templateToEdit.id,
        id: this.templateToEdit.id
      };
      this.initializeStoresListWithEditTemplate();
    } else {
      this.template = {
        name: 'Nueva ' + (this.typeWorkwave == 3 ? 'Plantilla' : 'Ola de trabajo'),
        id: null
      };
    }
  }

  initializeStoresListWithEditTemplate() {
    for (let warehouse of this.templateToEdit.warehouses) {
      for (let store of this.listStoresTemplates) {
        if (warehouse.warehouse.id == store.warehouseId) {
          store.thresholdConsolidated = warehouse.thresholdConsolidated;
          store.thresholdShippingStore = warehouse.thresholdShippingStore;
          store.typePacking = ''+warehouse.typePacking;
          store.typeGeneration = ''+warehouse.typeGeneration;
          store.typeShippingOrder = warehouse.typeShippingOrder;
          store.thresholdConsolidated = warehouse.thresholdConsolidated;
          store.checked = true;
          store.errorTypeShippingOrder = false;
          store.errorThresholdConsolidated = false;
          store.errorThresholdShippingStore = false;
          store.errorTypeGeneration = false;
          store.errorTypePacking = false;
          switch (store.typeShippingOrder) {
            case 1:
              store.replace = '1';
              break;
            case 2:
              store.allocate = '1';
              break;
            case 3:
              store.replace = '2';
              store.allocate = '2';
              break;
            case 4:
              store.replace = '1';
              store.allocate = '2';
              break;
            case 5:
              store.replace = '2';
              store.allocate = '1';
              break;
          }
        }
      }
    }
  }

  async saveTemplate(typeWorkwave) {
    let storesToSetInWorkwave = this.listStoresTemplates.filter(store => {
      return store.checked;
    });

    if (!storesToSetInWorkwave || storesToSetInWorkwave.length < 1) {
      const alert = await this.alertController.create({
        subHeader: 'Atención',
        message: 'Debe seleccionar alguna tienda para poder crear la Ola de Trabajo',
        buttons: ['Cerrar']
      });
      return await alert.present();
    }

    let someError: boolean = false;

    for (let store of storesToSetInWorkwave) {
      if (!store.thresholdConsolidated || store.thresholdConsolidated == 0) {
        store.errorThresholdConsolidated = true;
        someError = true;
      } else {
        store.errorThresholdConsolidated = false;
        delete store.errorThresholdConsolidated;
      }
      if (!store.thresholdShippingStore || store.thresholdShippingStore == 0) {
        store.errorThresholdShippingStore = true;
        someError = true;
      } else {
        store.errorThresholdShippingStore = false;
        delete store.errorThresholdShippingStore;
      }
      if (!store.typeShippingOrder || store.typeShippingOrder == 0) {
        store.errorTypeShippingOrder = true;
        someError = true;
      } else {
        store.errorTypeShippingOrder = false;
        delete store.errorTypeShippingOrder;
      }
      if (!store.typeGeneration || store.typeGeneration == '') {
        store.errorTypeGeneration = true;
        someError = true;
      } else {
        store.errorTypeGeneration = false;
        delete store.errorTypeGeneration;
      }
      if (!store.typePacking || store.typePacking == '') {
        store.errorTypePacking = true;
        someError = true;
      } else {
        store.errorTypePacking = false;
        delete store.errorTypePacking;
      }
    }

    if (someError) {
      const alert = await this.alertController.create({
        subHeader: 'Atención',
        message: 'Necesita completar todos los campos para cada tienda',
        buttons: ['Cerrar']
      });
      return await alert.present();
    }

    let paramsModal: any = {
      type: typeWorkwave,
      listStores: storesToSetInWorkwave
    };

    if (this.template && this.template.id) {
      paramsModal.workwave = this.templateToEdit;
      paramsModal.previousType = this.typeWorkwave;
    }

    const modalSave = await this.modalController.create({
      component: StoreComponent,
      componentProps: paramsModal
    });

    modalSave.onDidDismiss().then((data) => {
      if (data && data.data && data.data.save) {
        this.goPreviousPage();
      }
    });

    return await modalSave.present();
  }

  goPreviousPage () {
    this.location.back();
  }

  changeStoreTemplate(data) {
    if (data.field == 'replace' && data.store.replace == '1' && data.store.allocate == '1') {
      data.store.allocate = '2';
    }
    if (data.field == 'allocate' && data.store.allocate == '1' && data.store.replace == '1') {
      data.store.replace = '2';
    }

    if (data.field == 'replace' || data.field == 'allocate') {
      if (data.store.replace && !data.store.allocate) {
        data.store.typeShippingOrder = 1;
      } else if (data.store.allocate && !data.store.replace) {
        data.store.typeShippingOrder = 2;
      } else if (data.store.replace == '2' && data.store.allocate == '2') {
        data.store.typeShippingOrder = 3;
      } else if (data.store.replace == '1' && data.store.allocate == '2') {
        data.store.typeShippingOrder = 4;
      } else if (data.store.replace == '2' && data.store.allocate == '1') {
        data.store.typeShippingOrder = 5;
      }
    }

    if (data.field == 'replace' || data.field == 'allocate') {
      delete data.store.errorTypeShippingOrder;
    }
    if (data.field == 'consolidated' && data.store.thresholdConsolidated && data.store.thresholdConsolidated != 0) {
      delete data.store.errorThresholdConsolidated;
    }
    if (data.field == 'shipping' && data.store.thresholdShippingStore && data.store.thresholdShippingStore != 0) {
      delete data.store.errorThresholdShippingStore;
    }
    if (data.field == 'selection') {
      delete data.store.errorTypeGeneration;
    }
    if (data.field == 'packing') {
      delete data.store.errorTypePacking;
    }
    if (data.field == 'check' && !data.store.checked) {
      delete data.store.errorTypeShippingOrder;
      delete data.store.errorThresholdConsolidated;
      delete data.store.errorThresholdShippingStore;
      delete data.store.errorTypeGeneration;
      delete data.store.errorTypePacking;
    }
  }

  clearAllFields() {
    for (let store of this.listStoresTemplates) {
      store.checked = false;
      store.thresholdConsolidated = 0;
      store.thresholdShippingStore = 0;
      store.replace = '';
      store.allocate = '';
      store.typeGeneration = '';
      store.typePacking = '';
      store.typeShippingOrder = 0;
      delete store.errorTypeShippingOrder;
      delete store.errorThresholdConsolidated;
      delete store.errorThresholdShippingStore;
      delete store.errorTypeGeneration;
      delete store.errorTypePacking;
    }
  }

}
