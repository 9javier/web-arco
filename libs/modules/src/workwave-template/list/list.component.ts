import {Component, Input, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {StoreComponent} from "../store/store.component";
import {ModalController} from "@ionic/angular";
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
    private warehouseService: WarehouseService
  ) {}

  ngOnInit() {
    console.debug('Test::WarehouseRacks -> ', this.warehouseService.warehousesWithRacks);
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
      this.template = this.templateToEdit;
    } else {
      this.template = {
        name: 'Nueva ' + (this.typeWorkwave == 3 ? 'Plantilla' : 'Tarea Programada'),
        id: null
      };
    }
  }

  async saveTemplate() {
    const modalSave = await this.modalController.create({
      component: StoreComponent,
      componentProps: {
        type: this.typeWorkwave,
        listStores: this.listStoresTemplates.filter(store => {
          return store.checked;
        })
      }
    });

    modalSave.onDidDismiss().then((data) => {
      console.debug('Test::Data -> ', data);
    });

    return await modalSave.present();
  }

  goPreviousPage () {
    this.location.back();
  }

  changeStoreTemplate(data) {
    console.debug('Test::ChangeStoreTemplate -> ', data);
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
