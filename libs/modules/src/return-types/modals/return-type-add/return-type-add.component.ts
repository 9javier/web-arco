import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DataComponent } from '../data/data.component';
import { IntermediaryService } from '@suite/services';
import { ReturnTypesService } from '../../../../../services/src/lib/endpoint/return-types/return-types.service';

@Component({
  selector: 'suite-return-type-add',
  templateUrl: './return-type-add.component.html',
  styleUrls: ['./return-type-add.component.scss']
})
export class ReturnTypeAddComponent implements OnInit {

  @ViewChild(DataComponent) data:DataComponent;

  title = 'Crear Tipo de Devolución';
  redirectTo = '/return-types';

  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private returnTypesService:ReturnTypesService,
    private intermediaryService:IntermediaryService
  ) {}

  ngOnInit() {}

  submit(value){
    this.intermediaryService.presentLoading();
    this.returnTypesService.store(value).subscribe(data=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Tipo de devolución guardado con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error creando el tipo de devolución");
    })
  }

  close():void{
    this.modalController.dismiss();
  }
}
