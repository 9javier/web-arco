import { Component, OnInit ,ViewChild} from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { NavParams, ModalController } from '@ionic/angular';
import { CarrierService, IntermediaryService } from '@suite/services';
import { DataComponent } from '../data/data.component';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
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
  title = 'Actualizar Jaula';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;

  redirectTo = '/jails/list';
  jail;

  constructor(
    private navParams:NavParams,
    private carrierService:CarrierService,
    private intermediaryService:IntermediaryService,
    private modalController:ModalController
    ) {
    this.jail = this.navParams.get("jail");
    // console.log("jail",this.jail);
  }

  @ViewChild(DataComponent) data:DataComponent;

  ngOnInit() {}
  
  submit(value){
    this.intermediaryService.presentLoading();
    this.carrierService.update(this.jail.id,value).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Jaula actualizada con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error actualizando jaula");
    })
  }

  close(){
    this.modalController.dismiss();
  }

}
