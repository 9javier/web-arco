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
  title = 'Crear Talla';
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
  groups=[];
  currentSizes=[];
  bodySizes:any;
  selectSizes=[];
  dataSource;
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


  ) {
    this.update = this.navParams.get("update");
  }

  ngOnInit() {
    this.getBrands();
    if(!this.update){
      
    }else{
      this.title = "Editar Talla"
      this.bodySizes = this.navParams.get("data");
      this.initFormToEdit();
    }
  }
 
  async initFormToEdit(){
    const brandId = this.bodySizes.brand.id;
    this.form.get('brand').patchValue(brandId);
    await this.getSubBrands(brandId);
    this.form.get('subbrand').patchValue(this.bodySizes.model.id);
    await this.initSelectedCurrentSizes(this.bodySizes.id);
    await this.getGroups(brandId);

  }

  async initSelectedCurrentSizes(matchingBrandId){
    this.brandsServices.getCurrentSizes(matchingBrandId).subscribe(result =>{
      console.log(result);
       this.currentSizes = result;
       this.selectSizes = this.currentSizes;
      /*this.groups.map((element,index) => {
        this.currentSizes.forEach(e =>{
          if(element.id == e.id ){
            console.log("es Igual",element)
          }
        });
      })
     */
    },(error)=>{
      this.intermediaryService.presentToastError("Error al tallas de esta Marca");
      console.log(error);
    }); 
  }

  initCheckbox(){
  console.log("tallas *******",this.currentSizes);
  this.groups =  this.groups.map(element => {
     let res = this.currentSizes.find(e => e.sizes.id == element.id);   
      if(res){
        console.log("*****encontre iguales****");
        console.log("*******",element);
       // this.selectSizes.push({...element,check:true})
        return{
          ...element,check:true
        }
       }else{
//        this.selectSizes.push({...element,check:false})
        return{
          ...element,check:false
        }
       }

    });
console.log(this.groups,"****Grupos*****")
  }

  compareSizeId(row){
   /* let res:boolean = false;
    this.currentSizes.forEach(element => {
      if(row.id == element.sizes.id){
        console.log("iguales",row.id);
        res= true;
        this.selection.selected.push(row);
      }
    });
  return res;*/
  
  }


  async getBrands(){
    this.intermediaryService.presentLoading("Cargando Marcas...");
    this.brandsServices.getBrandsAll().subscribe(result =>{
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
    if(!this.update){
      $event.stopPropagation();
      let dataSizesId=[];
      this.selection.selected.map(element => {
           dataSizesId.push(element.id);
      });
      let body={
       "brand":this.form.get('brand').value,
       "model":this.form.get('subbrand').value,
       "sizeId":dataSizesId,
     }
      this.createOnBoardMatchingBrand(body);
    }else{
      
    }
    
  }



  selectBrand($event){
    this.brandId = $event.value;
    this.getSubBrands(this.brandId);
  }
  selectSubBrand($event){
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
      this.initCheckbox();
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
    if(!this.update){
      $event ? this.selection.toggle(row) : null;
      console.log(this.selection.selected);
      let resAux=[];
     const result = this.selectSizes.map(element => {
      if(element.id != row.id){
        resAux.push(element)
      }
     });
     this.selectSizes =[];
     this.selectSizes = resAux;
     console.log(this.selectSizes);
    }else{
     /* console.log("ROW**",row);
      this.groups = this.groups.map((e,index) =>{
        if(e.sizes.id == row.id){
          this.groups[index].check = true;
        }
        
      });*/
    }
 

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
