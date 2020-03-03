import { Component, Input, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {FormBuilder} from "@angular/forms";
import {ModalController, AlertController} from "@ionic/angular";
import { IntermediaryService } from './../../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { PredistributionsService } from '../../../../services/src/lib/endpoint/predistributions/predistributions.service';
import { PredistributionModel } from '../../../../services/src/models/endpoints/Predistribution';
import {
  ReceptionsAvelonService,
  ReceptionAvelonModel,
  ProductsService,
  UserTimeService,
  UserTimeModel
} from '@suite/services';
import Predistribution = PredistributionModel.Predistribution;
import { SelectionModel } from '@angular/cdk/collections';

import { ReceptionFinalService } from '../../../../services/src/lib/endpoint/reception-final/reception-final.service';

import { MatSelectChange } from '@angular/material';
import { async } from '@angular/core/testing';
@Component({
  selector: 'suite-modal-user',
  templateUrl: './modal-reception-final.component.html',
  styleUrls: ['./modal-reception-final.component.scss']
})
export class ModalReceptionFinalComponent implements OnInit {
  @Input() ListReceptions;
  @Input() modalType;
  @Input() whUpdate;

  selectionReception = new SelectionModel<Predistribution>(true, []);
  selectionWh = new SelectionModel(true, []);
  id_user :number | string;
  users=[];
  warehouses
  warehouseId
  RecepionId:Number[];
  checked;
  changeCheckbox = false;
  recepFinal

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private intermediaryService:IntermediaryService,
    private predistributionsService:PredistributionsService,
    private userTimeService: UserTimeService,
    private receptionFinalService: ReceptionFinalService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    if(this.modalType == 1){
    this.getWarehouses();
    }else if(this.modalType == 2){

    }else if(this.modalType == 3){
      this.getWarehouse();
    }
  }

  close():void{
    this.modalController.dismiss();
  }

  enviar(){
    let reception: boolean;
    if(this.selectionReception.selected.length<=0){
      reception = false;
    }else{
      reception = true;
    }

    if( this.warehouseId >0){
      let object = {
        receptionFinal: reception,
        warehouse: this.warehouseId
      }
   
    this.save(object);
    }
   
  }

  async getWarehouses(){
  
    this.receptionFinalService.getWarehouse().subscribe((resp:any) => {
      if (resp) {
        this.warehouses = resp.data;
      }
    },
    async err => {
    },
    async () => {
    })

  }


  
  async save(reception){

    let This = this;
     await  this.receptionFinalService.postReceptionFinal(reception).subscribe(function(data){
      This.intermediaryService.presentToastSuccess("Guardando Tienda");
      This.intermediaryService.dismissLoading();
      This.close();
      }, (error) => {
       This.intermediaryService.presentToastError("Error tienda ya tiene recepción");
       This.intermediaryService.dismissLoading();
     }, () => {
       This.intermediaryService.dismissLoading();
     });
  
     this.close();
  }

  delete(){
    
     this.ListReceptions.forEach(element => {
        this.deleteReception(element.id);
    });
    
  }



  async deleteReception(idReceptionFinal){
    let This = this;
   await this.receptionFinalService.destroyReceptionFinal(idReceptionFinal).subscribe(function(data){
      This.intermediaryService.presentToastSuccess("Eliminando Recepcion Final");
      This.intermediaryService.dismissLoading();
      This.ListReceptions.length =0;
      This.close();
      }, (error) => {
       This.intermediaryService.presentToastError("Error al eliminar la recepcion final");
       This.intermediaryService.dismissLoading();
     }, () => {
       This.intermediaryService.dismissLoading();
     });
     this.close();

  }


  selectDestiny(event: MatSelectChange) {
   this.warehouseId = event.value;
  }

  update(){
    let recepFinalUpdate ={
      receptionFinal: this.checked,
      warehouse: this.whUpdate[0].idWh
    }
    if(this.whUpdate[0].id){
      this.updateRecepFinal(recepFinalUpdate,this.recepFinal.id);
    }
   
  }


  async getWarehouse(){
    let This = this;
   await this.receptionFinalService.getByIdWarehouse(this.whUpdate[0].id).subscribe(function(data){
      This.recepFinal = data;
      This.checked = data.receptionFinal;
      }, (error) => {
       This.intermediaryService.presentToastError("Error al consultar Warehouse");
       This.intermediaryService.dismissLoading();
     }, () => {
       This.intermediaryService.dismissLoading();
     });
     this.close();

  }

  change(){
    this.changeCheckbox = true;
  }

async updateRecepFinal(recepFinal, id){
  let This = this;
  await this.receptionFinalService.updateRecepFinal(recepFinal,id).subscribe(function(data){
      This.intermediaryService.presentToastSuccess("Actualizando recepcion Final");
     This.intermediaryService.dismissLoading();
     This.close();
     }, (error) => {
      This.intermediaryService.presentToastError("Error al actulizar la recepcion final");
      This.intermediaryService.dismissLoading();
    }, () => {
      This.intermediaryService.dismissLoading();
    });
    this.close();
 }


 

}
