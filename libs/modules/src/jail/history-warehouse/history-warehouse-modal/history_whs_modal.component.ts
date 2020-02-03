import { Component, OnInit, Injectable, Output } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray,  FormControl, } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { ModalController } from '@ionic/angular';
import { CarrierService, IntermediaryService } from '@suite/services';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'history-whs-modal',
  templateUrl: './history_whs_modal.component.html',
  styleUrls: ['./history_whs_modal.component.scss']
})
export class HistoryWarehouseModalComponent implements OnInit {

  public dateMin = new Date(Date.now());
  public dateMax = new Date(Date.now());
  public whsCode;
  formVar: FormGroup;
  private whs: any;

  warehouseSelected;
  constructor(
    private modalController:ModalController,
    private carrierService:CarrierService,
    private intermediaryService:IntermediaryService,
    private fb: FormBuilder,
    
    private router: Router,
    
  ) {}

  ngOnInit() {
    this.formVar = this.fb.group({
      warehouse: '',
      beginDate: '',
      endDate: ''
    });

    this.intermediaryService.presentLoading();
    this.carrierService.getAllWhs().subscribe(carriers => {
      this.whs = carriers;
      this.intermediaryService.dismissLoading();
    })


  }

  setDateStart(){
  }

  submit(value){
  

    this.dateMin = new Date(this.formVar.value['beginDate']);
    this.dateMax = new Date(this.formVar.value['endDate']);
    this.whsCode = this.formVar.value['warehouse']; 

    if(this.validateSubmit(this.dateMin, this.dateMax, this.whsCode)){
     
 
      this.router.navigate(['jails/history/'+
      this.dateMin+"/"+
      this.dateMax+"/"+
      this.whsCode]);
      this.closeModal();
    }



  }







  closeModal(){
    this.modalController.dismiss()
  }

 validateSubmit(dateM:any,dateMx:any, whsCode:string ):boolean{

    if (whsCode=='' || whsCode==null){
      this.intermediaryService.presentToastError("Favor de seleccionar el almacén");
      return false;
    }

    if(dateM.lenght <=0 ){
      this.intermediaryService.presentToastError("Favor de seleccionar una fecha inicial");
      return false;
    }

    if(dateM == null || dateM == '' || dateM.lenght == 0){
      this.intermediaryService.presentToastError("Favor de seleccionar una fecha inicial");
      return false
    }

    if(dateMx == null || dateMx == '' || dateMx.lenght == 0){
      this.intermediaryService.presentToastError("Favor de seleccionar una fecha final");
      return false
    }
    if(dateM>dateMx){
      this.intermediaryService.presentToastError("Favor de seleccionar una fecha inicial menor a la fecha final");
      return false;
    }
    if(dateMx<dateM){
      this.intermediaryService.presentToastError("Favor de seleccionar una fecha inicial mayor a la fecha final");
      return false;
    }
    return true;
  }

  close():void{
    this.modalController.dismiss();
  }
}
