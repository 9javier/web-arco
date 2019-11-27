import { Component, OnInit ,ViewChild} from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { NavParams, ModalController } from '@ionic/angular';
import { CarrierService, IntermediaryService } from '@suite/services';
import { DataComponent } from '../data/data.component';
import { StateExpeditionAvelonService } from 'libs/services/src/lib/endpoint/state-expedition-avelon/state-expedition-avelon.service';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  title = 'Actualizar estado de expedicion';
  public formGroup: FormGroup;

  redirectTo = '/state-expedition-avelon/list';
  id;

  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private intermediaryService:IntermediaryService,
    private expedition: StateExpeditionAvelonService
    ) {
    this.id = this.navParams.get("id");
  }


  ngOnInit() {

  }
  
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
