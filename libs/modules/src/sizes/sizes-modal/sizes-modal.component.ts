import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { IntermediaryService } from '@suite/services';
import { OplTransportExpeditionService } from '../../../../services/src/lib/endpoint/opl-transport-expedition/opl-transport-expedition.service';
import { BrandsService } from '../../../../services/src/lib/endpoint/brands/brandsServices';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sizes-modal',
  templateUrl: './sizes-modal.component.html',
  styleUrls: ['./sizes-modal.component.scss']
})
export class SizeModalComponent implements OnInit {
  title = 'Tallas';
  
  displayedColumns=['us','uk','ue'];
  groupId:number;
  sizes;
  form: FormGroup = this.formBuilder.group({
    brand: [],
    subbrand: [],
  });
  constructor(
    private modalController:ModalController,
    private navParams:NavParams,
    private intermediaryService: IntermediaryService,
    private brandsServices: BrandsService,
    private formBuilder: FormBuilder,

  ) {
    this.groupId = this.navParams.get("groupId");
  }

  ngOnInit() {
   this.getSizes(this.groupId);
  }
 
  close():void{
    this.modalController.dismiss();
  }

  async getSizes(id){
    this.intermediaryService.presentLoading("Cargando Tallas...");
    this.brandsServices.getSizes(id).subscribe(result =>{
      console.log(result);
      this.intermediaryService.dismissLoading();
      this.sizes = result.tallas;
    
    },(error)=>{
      this.intermediaryService.presentToastError("Error al cargar las Tallas del grupo.");
      this.intermediaryService.dismissLoading();
      console.log(error);
    }); 
  }

}
