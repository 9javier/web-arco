import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { IntermediaryService } from '@suite/services';
import { OplTransportExpeditionService } from '../../../../services/src/lib/endpoint/opl-transport-expedition/opl-transport-expedition.service';
import { BrandsService } from '../../../../services/src/lib/endpoint/brands/brandsServices';
import { FormBuilder, FormGroup } from '@angular/forms';
import {SizeModalComponent} from '../sizes-modal/sizes-modal.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'new-brand',
  templateUrl: './new-brand.component.html',
  styleUrls: ['./new-brand.component.scss']
})
export class NewBrandComponent implements OnInit {
  title = 'Crear Marca';
  destinations;
  transport;
  log_internal;
  name:string="";
  update:boolean;
  check:boolean = false;
  displayedColumns=['group','actions'];
  brands;
  subbrands;
  brandId:number;
  groups;
  form: FormGroup = this.formBuilder.group({
    brand: [],
    subbrand: [],
  });
  selection = new SelectionModel<any>(true, []);
  constructor(
    private modalController:ModalController,
    private navParams:NavParams,
    private intermediaryService: IntermediaryService,
    private brandsServices: BrandsService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,


  ) {}

  ngOnInit() {
   this.getBrands();
  }
 

  async getBrands(){
    this.intermediaryService.presentLoading("Cargando Marcas...");
    this.brandsServices.getBrandsAll().subscribe(result =>{
      console.log(result);
      this.intermediaryService.dismissLoading();
      this.brands = result;
    
    },(error)=>{
      this.intermediaryService.presentToastError("Error al cargar Marcas");
      this.intermediaryService.dismissLoading();
      console.log(error);
    }); 
  }


  onKey(event){
    this.name = event.target.value;
  }

  submit($event){
    $event.stopPropagation();
    console.log(this.selection.selected);
   let data ={
     brand:this.form.get('brand').value,
     model: this.form.get('subbrand').value,
   };
   let body={
    "zalandoSize":2,
    "onBoardingMatchingBrand":3
  }
   console.log("*******DATA*********");
   console.log(data)
   this.createOnBoardMatchingBrand(data);
  }

  selectBrand($event){
    this.brandId = $event.value;
    this.getSubBrands(this.brandId);
  }
  selectSubBrand($event){
    console.log($event);
    this.getGroups(this.brandId);
  }
  selectGroups($event){
    console.log($event);
  }

  close():void{
    this.modalController.dismiss();
  }

  getSubBrands(id){
    this.intermediaryService.presentLoading("Cargando Submarcas...");
    this.brandsServices.getSubBrands(id).subscribe(result =>{
      console.log(result);
      this.intermediaryService.dismissLoading();
      let data =[];
      data.push(result);
      this.subbrands = data;
    
    },(error)=>{
      this.intermediaryService.presentToastError("Error al cargar Submarcas");
      this.intermediaryService.dismissLoading();
      console.log(error);
    }); 
  }

  getGroups(id){
    this.brandsServices.getGroups(id).subscribe(result =>{
      this.groups = result;
    },(error)=>{
      this.intermediaryService.presentToastError("Error Falta parametrizar Marcas, Tallas.");
      console.log(error);
    }); 
  }

  info(row){
    const groupId = row.id;
    const data ={  
    brandId:this.brandId,
    groupSizeId:groupId
    };
    this.goToModalSizes(data);

}
  async goToModalSizes(data){
    let modal = (await this.modalCtrl.create({
      component: SizeModalComponent,
      componentProps:{
        data: data
      }
    }));

    modal.onDidDismiss().then(() => {
    });

    modal.present();
  }

  checkboxRow($event, row) {
    $event ? this.selection.toggle(row) : null;
    console.log(this.selection.selected);
  }

  createOnBoardMatchingBrand(body){
    this.intermediaryService.presentLoading("Guardado Registro...");
    this.brandsServices.postOnBoardingMatchingBrand(body).subscribe(result =>{
      console.log(result);
      this.intermediaryService.dismissLoading();
      this.close();
    
    },(error)=>{
      this.intermediaryService.presentToastError("Error al guardar Registro.");
      this.intermediaryService.dismissLoading();
      console.log(error);
    }); 
  }
}
