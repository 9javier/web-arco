import { Component, OnInit} from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { NavParams, ModalController } from '@ionic/angular';
import { CarrierService, IntermediaryService, WarehousesService, WarehouseModel } from '@suite/services';
import { MatSelectChange } from '@angular/material';
import {CarrierModel} from "../../../../services/src/models/endpoints/carrier.model";

@Component({
  selector: 'suite-send-packing-manual',
  templateUrl: './send-packing-manual.component.html',
  styleUrls: ['./send-packing-manual.component.scss']
})
export class SendPackingManualComponent implements OnInit {
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

  redirectTo = '/send-empty-packing';
  jail;
  warehouses:Array<WarehouseModel.Warehouse> = [];
  warehouse: WarehouseModel.Warehouse;
  selectedWarehouse;

  public typeTags: number = 1;


  constructor(
    private navParams:NavParams,
    private carrierService:CarrierService,
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private warehousesService:WarehousesService
    ) {
    //this.jail = this.navParams.get("jail");
    //console.log('jail >>> ', this.jail);
    /*if(this.jail.carrierWarehousesDestiny.length  == 1) {
      this.selectedWarehouse = this.jail.carrierWarehousesDestiny[0].warehouse.id;
      this.warehouse = this.jail.carrierWarehousesDestiny[0].warehouse;
    }*/
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
