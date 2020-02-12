import { Component, Input, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {FormBuilder} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import { IntermediaryService } from './../../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { PredistributionsService } from '../../../../services/src/lib/endpoint/predistributions/predistributions.service';
import { PredistributionModel } from '../../../../services/src/models/endpoints/Predistribution';
import {
  ReceptionsAvelonService,
  ReceptionAvelonModel,
  ProductsService,
  UserTimeService,
  UserTimeModel
} from '@suite/services';
@Component({
  selector: 'suite-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {
 // @Input() users:any[];
  @Input() ListReceptions;

  id_user :number | string;
  users=[];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private intermediaryService:IntermediaryService,
    private predistributionsService:PredistributionsService,
    private userTimeService: UserTimeService
  ) { }

  ngOnInit() {
    console.log(JSON.stringify(this.ListReceptions));
    this.getUsers();
    console.log(JSON.stringify(this.users));


  }

  getUsers(){
    let users=[1,13,14]
    let This = this;
    
   This.userTimeService.getUsersShoesPicking(users).subscribe(function (data) {
    This.users=data['data'];
    
    console.log(this.users);
   }, (error) => {
     This.intermediaryService.presentToastError("No cuentas con usuarios asignados para liberar");
     This.intermediaryService.dismissLoading();
 
   }, () => {
   });
  }

  valorId(user:{id:number,name:string,list:number}){
    this.id_user = user.id;
    console.log(this.id_user)
  }

  close():void{
    this.modalController.dismiss();
  }


  enviar(){
    console.log(this.id_user);
    this.send(this.id_user);
  }

  async send(userId){
    this.intermediaryService.presentLoading();
   let This = this;

   
  
   let _data:Array<PredistributionModel.BlockReservedRequest>=this.ListReceptions;
  _data=_data.map(item=>{
    return {
      reserved:false,
      distribution:false,
      modelId:item.modelId,
      warehouseId:item.warehouseId,
      sizeId:item.sizeId,
      userId:userId
    };

  });

  console.log("fiesrt",_data);
     await  this.predistributionsService.updateBlockReserved2(_data).subscribe(function(data){
      This.intermediaryService.presentToastSuccess("Actualizado predistribuciones correctamente");
      This.intermediaryService.dismissLoading();
       // reload page
        This.close();
     }, (error) => {
       This.intermediaryService.presentToastError("Error Actualizado predistribuciones");
       This.intermediaryService.dismissLoading();
     }, () => {
       This.intermediaryService.dismissLoading();
     });
  }



}
