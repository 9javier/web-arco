import { Component, OnInit, ViewChild} from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { NavParams, ModalController } from '@ionic/angular';
import { DataComponent } from '../data/data.component';
import { WarehousesService, WarehouseModel } from '@suite/services';
import { MatSelectChange } from '@angular/material';
import { CarrierService, IntermediaryService } from '@suite/services';
import { resolve } from 'url';
import { stat } from 'fs';
import {CarriersService} from "../../../../services/src/lib/endpoint/carriers/carriers.service";
import { ThrowStmt } from '@angular/compiler';
import * as _ from 'lodash';

@Component({
  selector: 'suite-multiple-destinations',
  templateUrl: './multiple-destinations.component.html',
  styleUrls: ['./multiple-destinations.component.scss']
})
export class MultipleDestinationsComponent implements OnInit {
  title = 'Agregar Destino';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;

  redirectTo = '/jails/list';
  lista;
  warehouses:Array<WarehouseModel.Warehouse> = [];
  warehouse: WarehouseModel.Warehouse;
  listWithNoDestiny;
  listWithDestiny;
  listToPrecintar=[];
  ListToSeal=[];
  ListNoProducts=[];
  ListToAddDestiny=[];
  listPrecintarUpdate=[];
  
  private sortValues = { carrierId: null, warehouseId: null };

 
  constructor(
    private carriersService: CarriersService,
    private navParams:NavParams,
    private modalController:ModalController,
    private warehousesService:WarehousesService,
    private carrierService:CarrierService,
    private intermediaryService:IntermediaryService
  ) { 
    this.listWithDestiny = this.navParams.get("listWithDestiny");
    this.listWithNoDestiny = this.navParams.get("listWithNoDestiny");
    this.allListToDestiny();    
 }

  ngOnInit() {
    this.warehousesService.getIndex().then(observable => {
      observable.subscribe(warehouses => {
          this.warehouses = warehouses.body.data;
      });
      
    });
  }
  close(){
    this.modalController.dismiss();
  }
  selectDestiny(event: MatSelectChange,idCarrier) {
     let exist = _.find(this.listToPrecintar, {'carrierId': idCarrier});
      if(exist) {
        _.remove(this.listToPrecintar, function(n) {
          return n.carrierId == idCarrier;
        });
        let object = {
          destinationWarehouseId: event.value.id,
          carrierId: idCarrier
        }
        this.listToPrecintar.push(object);
      }else{
        this.listToPrecintar.push({
          destinationWarehouseId: event.value.id,
          carrierId: idCarrier});
      }
    this.warehouse = event.value;
  }
  submit() {
       this.addDestinyMultiple();
  }

 

  addDestinyMultiple(){
    //console.log("precintar"+JSON.stringify(this.listToPrecintar));    
    if(this.listWithNoDestiny.length > 0 && this.listToPrecintar.length > 0){
      this.addDestiny(this.listToPrecintar);
    }else if(this.listWithDestiny.length > 0){
      this.SealAll(); 
    }else{
      if(this.ListToSeal.length <= 0){
        this.intermediaryService.presentToastError("No se pueden  precintar estos embalajes");
        this.intermediaryService.dismissLoading();
      }else{
        this.intermediaryService.presentToastError("Error llena los campos de destino");
        this.intermediaryService.dismissLoading();
      }
     
    }
  }

  async addDestiny(listToDestiny){
    try {
      this.carrierService.setDestinationMultiple(listToDestiny).subscribe(() => {
        this.SealAll();

      }, () => {
        this.intermediaryService.presentToastSuccess("Error al agregar destino, intentelo de nuevo");
        this.intermediaryService.dismissLoading();
      });
    } catch (error) {
      this.intermediaryService.presentToastSuccess("Error al agregar destino, intentelo de nuevo");
      this.intermediaryService.dismissLoading();
      this.close();
    }

  }

  allListToDestiny(){
    
    for(let i=0; i < this.listWithNoDestiny.length; i++){
      let error1 = '';
      if (this.listWithNoDestiny[i].products == 0) {
        error1 = '- Sin productos';
      } else if(this.listWithNoDestiny[i].destiny > 1){
        error1 = '- Varios destinos';
      }
      else
        if (this.listWithNoDestiny[i].status == 4) {
          error1 = '- Precintada';
        }
      if (error1.length <= 0) {
        this.ListToAddDestiny.push(this.listWithNoDestiny[i]);
      } else {
        this.ListNoProducts.push({ reference: this.listWithNoDestiny[i].reference, mesage: error1 });
      }
    }
    for (let j = 0; j < this.listWithDestiny.length; j++) {

      let status = this.listWithDestiny[j].status;
      console.log(status);
      let error = '';

      if (this.listWithDestiny[j].destiny > 1) {
        error = '- Varios destinos';
      } else
        if (this.listWithDestiny[j].products == 0) {
          error = '- Sin productos';
        } else
          if (this.listWithDestiny[j].status == 4) {
            error = '- Precintada';
          }
      if (error.length <= 0) {
        this.ListToSeal.push(this.listWithDestiny[j]);
      } else {
        this.ListNoProducts.push({ reference: this.listWithDestiny[j].reference, mesage: error });
      }

    }
  }

  SealAll(){
    let listToSeal = [];
    for (let i = 0; i < this.ListToAddDestiny.length; i++) {
      listToSeal.push({ reference: this.ListToAddDestiny[i].reference });
    }
    for (let j = 0; j < this.ListToSeal.length; j++) {
      listToSeal.push({ reference: this.ListToSeal[j].reference });
    }
    this.postPrecintar(listToSeal);
  }

  async postPrecintar(listToSeal){   
    this.carrierService.postSeals(listToSeal).subscribe(() => {
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Embalajes precintados con exito");
      this.close();
    }, (err) => {
      this.intermediaryService.presentToastError("Error al sellar embalaje, intentelo de nuevo");
    }, () => {
    })
  }
}
