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
  data:any;
  currentZone:String;
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
    this.data = this.navParams.get("data");
  }

  ngOnInit() {
   this.getSizes(this.data);
  }
 
  close():void{
    this.modalController.dismiss();
  }

  async getSizes(data){
    this.intermediaryService.presentLoading("Cargando Tallas...");
    this.brandsServices.getSizes(data).subscribe(result =>{
      console.log("*****RESULTADO******");
      console.log(result);
      this.intermediaryService.dismissLoading();
      this.currentZone = result.currentZone;
      console.log("currentZone",this.currentZone);
      this.sizes = result.sizes;
    
    },(error)=>{
      this.intermediaryService.presentToastError("Error al cargar las Tallas del grupo.");
      this.intermediaryService.dismissLoading();
      console.log(error);
    }); 
  }

}
