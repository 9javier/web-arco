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
        typeShippingOrder: 1
      }
    });

    if (this.templateToEdit) {
      this.template = {
        name: this.templateToEdit.name || 'Tarea programada // '+this.templateToEdit.id,
        id: this.templateToEdit.id
      };
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
    } else {
      this.template = {
        name: 'Nueva ' + (this.typeWorkwave == 3 ? 'Plantilla' : 'Tarea Programada'),
        id: null
      };
    }
  }

  async saveTemplate() {
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

    let paramsModal: any = {
      type: this.typeWorkwave,
      listStores: storesToSetInWorkwave
    };

    if (this.template && this.template.id) {
      paramsModal.workwave = this.templateToEdit;
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
  }

}
