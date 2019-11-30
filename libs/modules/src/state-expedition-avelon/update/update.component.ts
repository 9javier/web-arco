import { Component, OnInit ,ViewChild} from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NavParams, ModalController } from '@ionic/angular';
import { IntermediaryService } from '@suite/services';
import { StateExpeditionAvelonService } from 'libs/services/src/lib/endpoint/state-expedition-avelon/state-expedition-avelon.service';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  object;
  title = 'Actualizar estado de expedicion';
  public formGroup: FormGroup;

  redirectTo = '/state-expedition-avelon/list';
  id;

  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private formBuilder: FormBuilder,
    private intermediaryService:IntermediaryService,
    private stateExpeditionAvelonService: StateExpeditionAvelonService
    ) {
      this.object = this.navParams.get("object");
      
  }


  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      status: true
    });
    this.formGroup.patchValue(this.object);
  }
  
  submit(){
    this.intermediaryService.presentLoading();
    let value = this.formGroup.value;
    this.stateExpeditionAvelonService.update(this.object.id, value).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Estado de expedicón actualizada con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error actualizando estado de expedicón");
    })
  }

  close(){
    this.modalController.dismiss();
  }

}
