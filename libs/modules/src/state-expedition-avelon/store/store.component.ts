import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { ModalController } from '@ionic/angular';
import { DataComponent } from '../data/data.component';
import { CarrierService, IntermediaryService } from '@suite/services';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  @ViewChild(DataComponent) data:DataComponent;

  formBuilderDataInputs = {
    reference: ['', [Validators.required, Validators.pattern('^J[0-9]{4}')]]
  };
  formBuilderTemplateInputs = [
    {
      name: 'reference',
      label: 'Ej. J0001',
      type: 'reference'
    }
  ];
  title = 'Crear Jaula';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;
  redirectTo = '/jails';

  constructor(
    private modalController:ModalController,
    private carrierService:CarrierService,
    private intermediaryService:IntermediaryService
  ) {}

  ngOnInit() {}

  submit(value){
    this.intermediaryService.presentLoading();
    this.carrierService.store(value).subscribe(data=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Jaula guardada con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error creando la jaula");
    })
  }

  close():void{
    this.modalController.dismiss();
  }
}
