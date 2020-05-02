import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { IntermediaryService } from '@suite/services';
import { OplTransportExpeditionService } from '../../../../services/src/lib/endpoint/opl-transport-expedition/opl-transport-expedition.service';

@Component({
  selector: 'create-transport',
  templateUrl: './create-transport.component.html',
  styleUrls: ['./create-transport.component.scss']
})
export class CreateTransportComponent implements OnInit {
  title = 'Crear Transporte';
  destinations;
  transport;
  log_internal;
  name:string="";
  update:boolean;
  check:boolean = false;
  constructor(
    private modalController:ModalController,
    private navParams:NavParams,
    private intermediaryService: IntermediaryService,
    private oplTransportExpeditionService: OplTransportExpeditionService,

  ) {}

  ngOnInit() {
    this.transport = this.navParams.get("transport");
    this.update = this.navParams.get("update");
    console.log(this.transport.length);
    if(this.update){
      this.title = "Editar Transporte";
      this.name = this.transport.name;
      this.check = this.transport.logistic_internal;
    }
  }
 
  newTransport(body){
    this.intermediaryService.presentLoading("Creando Transporte...");
    this.oplTransportExpeditionService.storeNewTransport(body).subscribe(result =>{
      console.log(result);
      this.intermediaryService.presentToastSuccess("Transporte creado exitosamente");
      this.intermediaryService.dismissLoading();
      this.close();
    },(error)=>{
      this.intermediaryService.presentToastError("Error al crear Transporte");
      this.intermediaryService.dismissLoading();
      console.log(error);
    });
  }


  updateTransport(body){
    this.intermediaryService.presentLoading("Actualizando Transporte...");
    this.oplTransportExpeditionService.updateTransport(body).subscribe(result =>{
      console.log(result);
      this.intermediaryService.presentToastSuccess("Transporte actualizado exitosamente");
      this.intermediaryService.dismissLoading();
      this.close();
    },(error)=>{
      this.intermediaryService.presentToastError("Error al actualizar Transporte");
      this.intermediaryService.dismissLoading();
      console.log(error);
    });
  }

  onKey(event){
    this.name = event.target.value;
  }

  submit(){
    if(this.update == true){
      let body={id: this.transport.id,name:this.name.toUpperCase(), logistic_internal:this.check};
      this.updateTransport(body);
    }else{
      if(this.name.length>0){
        let body={name:this.name.toUpperCase(), logistic_internal:this.check};
        this.newTransport(body);
      }
    }   
  }

  close():void{
    this.modalController.dismiss();
  }
}
