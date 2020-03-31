import { Component, OnInit} from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { NavParams, ModalController } from '@ionic/angular';
import { CarrierService, IntermediaryService, WarehousesService, WarehouseModel } from '@suite/services';
import { MatSelectChange } from '@angular/material';
import {CarrierModel} from "../../../../services/src/models/endpoints/carrier.model";

@Component({
  selector: 'suite-send-packing',
  templateUrl: './send-packing.component.html',
  styleUrls: ['./send-packing.component.scss']
})
export class SendPackingComponent implements OnInit {
  formBuilderDataInputs = {
    reference: ['', [Validators.required, Validators.pattern('^J[0-9]{4}')]]
  };
  formBuilderTemplateInputs = [
    {
      name: 'reference',
      label: 'Ej. J0001',
      type: 'reference',
      icon: { type: 'ionic', name: 'filing'}
    }
  ];
  title = 'Enviar';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;

  redirectTo = '/jails/list';
  public jail: CarrierModel.SearchInContainer;
  warehouses:Array<WarehouseModel.Warehouse> = [];
  warehouse: WarehouseModel.Warehouse;
  selectedWarehouse;

  constructor(
    private navParams:NavParams,
    private carrierService:CarrierService,
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private warehousesService:WarehousesService
  ) {
    this.jail = this.navParams.get("jail");
    if(this.jail.destiny.length  == 1) {
      this.selectedWarehouse = this.jail.destiny[0].destinyWarehouse.id;
      this.warehouse = this.jail.destiny[0].destinyWarehouse;
    }
  }


  ngOnInit() {
    this.warehousesService.getListAllWarehouses().then((warehouses: WarehouseModel.ResponseListAllWarehouses) => {
      this.warehouses = warehouses.data;
    })
  }
  
  selectWarehouse(event: MatSelectChange) {
    this.selectedWarehouse = event.value;
    this.warehouses.forEach(warehouse => {if(warehouse.id == this.selectedWarehouse) this.warehouse = warehouse});
  }

  submit(){
    this.intermediaryService.presentLoading();
    this.carrierService
      .postCheckProductsDestiny({
        packingId: this.jail.id,
        warehouseDestinyId: this.warehouse.id
      })
      .then((res: CarrierModel.ResponseCheckProductsDestiny) => {
        if (res.code == 200) {
          if (res.data.someProductWithDifferentDestiny) {
            this.intermediaryService.dismissLoading();
            this.intermediaryService.presentConfirm('Alguno de los productos incluidos en el embalaje tiene un destino diferente al indicado. ¿Asignar el destino indicado al embalaje igualmente?', () => {
              this.intermediaryService.presentLoading();
              this.changePackingDestiny();
            });
          } else {
            this.changePackingDestiny();
          }
        } else {
          this.intermediaryService.dismissLoading();
          let errorMessage = "Ha ocurrido un error al intentar enviar el embalaje.";
          if (res.errors) {
            errorMessage = res.errors;
          }
          this.intermediaryService.presentToastError(errorMessage);
        }
      });
  }

  private changePackingDestiny() {
    let value = this.warehouse.id;
    this.carrierService.sendPacking(this.jail.reference, value).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Envío de embalaje con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error de envío de embalaje");
    });
  }

  close(){
    this.modalController.dismiss();
  }

}
