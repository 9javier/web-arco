import { Component, OnInit } from '@angular/core';
import { GlobalVariableService, GlobalVariableModel, IntermediaryService } from '@suite/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import { UpdateComponent } from './modals/update/update.component';

@Component({
  selector: 'suite-global-variables',
  templateUrl: './global-variables.component.html',
  styleUrls: ['./global-variables.component.scss']
})
export class GlobalVariablesComponent implements OnInit {

  displayedColumns:string[] = ["type","value","selected"];
  form:FormGroup = this.formBuilder.group({
    selecteds:this.formBuilder.array([])
  });

  dataSource:MatTableDataSource<GlobalVariableModel.GlobalVariable>;

  types:{id:number;name:string}[] = [];
  constructor(
    private globalVariableService:GlobalVariableService,
    private formBuilder:FormBuilder,
    private intermediaryService:IntermediaryService,
    private modalController:ModalController
    ) { }

  ngOnInit() {
    this.getTypes();
    this.getGlobalVariables();
  }

  /**
   * Init form to select global variables to print
   */
  initForm(variables:GlobalVariableModel.GlobalVariable[]):void{
    this.form = this.formBuilder.group({
      selecteds:this.formBuilder.array(variables.map(variable=>{
        return this.formBuilder.group({
          id:variable.id,
          selected:false
        })
      }))
    })
  }

  async store(){
    let modal = (await this.modalController.create({
      component:StoreComponent
    }));
    modal.onDidDismiss().then(()=>{
      this.getGlobalVariables();
    })
    modal.present();
  }

  async update(variable:GlobalVariableModel.GlobalVariable){
    let modal = (await this.modalController.create({
      component:UpdateComponent,
      componentProps:{
        variable:variable
      }
    }));
    modal.onDidDismiss().then(()=>{
      this.getGlobalVariables();
    })
    modal.present();    
  }

  getGlobalVariables():void{
    this.intermediaryService.presentLoading();
    this.globalVariableService.getAll().subscribe(globalVariables=>{
      this.initForm(globalVariables);
      this.dataSource = new MatTableDataSource(globalVariables);
    }, (err) => {
      // console.log(err)
    }, () => {
      this.intermediaryService.dismissLoading();
    });
  }

  selecteds(selecteds:Array<{id:number;selected:boolean}>){
    return ((selecteds.filter(selected=>selected.selected)).map(selected=>selected.id));
  }

  prevent(event){
    event.preventDefault();
    event.stopPropagation();
  }

  getTypes():void{
    this.globalVariableService.getTypes().subscribe(types=>{
      this.types = types;
    })
  }

  getTypeById(id):string{
    return (this.types.find(type=>{
      return type.id == id;
    })||{name:""}).name;
  }

  delete(toDeletes:number[]):void{
    let observable = new Observable(observer=>{observer.next()});
    this.intermediaryService.presentLoading();
    toDeletes.forEach(id=>{
      observable = observable.pipe(switchMap(response=>{
        return this.globalVariableService.delete(id);
      }))
    });
    observable.subscribe(response=>{
      this.intermediaryService.dismissLoading();
      this.getGlobalVariables();
    },()=>{
      this.getGlobalVariables();
    });
  }

}
