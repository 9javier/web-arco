import { Component, OnInit ,ViewChild} from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { IntermediaryService } from '@suite/services';
import { DataComponent } from '../data/data.component';
import {ReturnTypesService} from "../../../../../services/src/lib/endpoint/return-types/return-types.service";

@Component({
  selector: 'suite-return-type-details',
  templateUrl: './return-type-details.component.html',
  styleUrls: ['./return-type-details.component.scss']
})
export class ReturnTypeDetailsComponent implements OnInit {

  title = 'Editar Tipo de Devolución';
  redirectTo = '/return-types';
  returnType;

  constructor(
    private navParams:NavParams,
    private returnTypesService:ReturnTypesService,
    private intermediaryService:IntermediaryService,
    private modalController:ModalController
  ) {
    this.returnType = this.navParams.get("returnType");
  }

  @ViewChild(DataComponent) data:DataComponent;

  ngOnInit() {
  }

  submit(value){
    this.intermediaryService.presentLoading();
    this.returnTypesService.update(this.returnType.id, value).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Tipo de devolución actualizado con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error actualizando Tipo de devolución");
    })
  }

  close(){
    this.modalController.dismiss();
  }

}
