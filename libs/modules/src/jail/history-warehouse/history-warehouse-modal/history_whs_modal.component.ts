import { Component, OnInit, Injectable, Output } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray,  FormControl, } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { ModalController } from '@ionic/angular';
import { CarrierService, IntermediaryService } from '@suite/services';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'history-whs-modal',
  templateUrl: './history_whs_modal.component.html',
  styleUrls: ['./history_whs_modal.component.scss']
})
export class HistoryWarehouseModalComponent implements OnInit {

  public dateMin;
  public dateMax;
  public whsCode;
  formVar: FormGroup;



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
  }

  setDateStart(date:any){
  }

  submit(value){

    this.dateMin = new Date(this.formVar.value['beginDate']);
    this.dateMax = new Date(this.formVar.value['endDate']);
    this.whsCode = this.formVar.value['warehouse'];

    console.log(this.dateMin + " -");
    console.log(this.dateMax + " -");
    console.log(this.whsCode + " -");

    if(this.validateSubmit(this.dateMin, this.dateMax)){
      this.router.navigate(['jails/history']);
      this.closeModal();
    }



  }

  closeModal(){
    this.modalController.dismiss()
  }

  validateSubmit(dateM:any,dateMx:any ):boolean{

    if(dateM>dateMx)
      return false;

    if(dateMx<dateM)
      return false;

    return true;
  }

  close():void{
    this.modalController.dismiss();
  }
}
