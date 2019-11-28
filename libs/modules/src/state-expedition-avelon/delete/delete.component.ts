import { Component, OnInit, Input } from '@angular/core';
import { StateExpeditionAvelonService } from 'libs/services/src/lib/endpoint/state-expedition-avelon/state-expedition-avelon.service';
import { NavParams, ModalController } from '@ionic/angular';
import { IntermediaryService } from '@suite/services';

@Component({
  selector: 'delete-data',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  object;
  constructor(
    private stateExpeditionService:StateExpeditionAvelonService,
    private navParams:NavParams,
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,

    ) { }

  ngOnInit() {
    this.object = this.navParams.get("object");

  }

  submit(){
    this.intermediaryService.presentLoading();
    this.stateExpeditionService.delete(this.object.id).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Estado de expedicón eliminado con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error eliminando estado de expedicón");
    })
  }
  close():void{
    this.modalController.dismiss();
  }
}
