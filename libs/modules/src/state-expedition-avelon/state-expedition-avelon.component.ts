import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {animate, state, style, transition, trigger} from '@angular/animations';
import { StateExpeditionAvelonService } from 'libs/services/src/lib/endpoint/state-expedition-avelon/state-expedition-avelon.service';
import { UpdateComponent } from './update/update.component';
import { StoreComponent } from './store/store.component';
import { IntermediaryService } from '@suite/services';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { validators } from '../utils/validators';
import { COLLECTIONS } from 'config/base';

@Component({
  selector: 'app-state-expedition-avelon',
  templateUrl: './state-expedition-avelon.component.html',
  styleUrls: ['./state-expedition-avelon.component.scss'],
  animations:  [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class StateExpeditionAvelonComponent implements OnInit {
  stateExpeditionAvelons:any;
  public title = 'Estados';
  public routePath = '/state-expedition-avelon';
  displayedColumns = ['name', 'status', 'delete'];
  types = [];
  form:FormGroup = this.formBuilder.group({
    toDelete:this.formBuilder.array([])
  },{
    validators:validators.haveItems("toDelete")
  });

  
  constructor(
    private modalCtrl:ModalController,
    private stateExpeditionAvelonService: StateExpeditionAvelonService,
    private intermediaryService:IntermediaryService,
    private formBuilder:FormBuilder,
  
    ) {}
  

  ngOnInit() {
    this.getStateExpeditionsAvalon();
  }
  confirmDeletion():void{
    this.intermediaryService.presentConfirm("¿Está seguro de eliminar los estados seleccionados?",()=>{
      this.deleteStates();
    });
  }
  deleteStates(){
      //this.intermediaryService.presentLoading();
      (<FormArray>this.form.controls.toDelete).controls.forEach( (control,i)=>{
        if(control.value){
           this.stateExpeditionAvelonService.delete(this.stateExpeditionAvelons[i].id).subscribe(()=>{
            //this.intermediaryService.dismissLoading();
            this.getStateExpeditionsAvalon();
          },()=>{
            //this.intermediaryService.dismissLoading();
          });
        }
      })
  }
  getStateExpeditionsAvalon() {
      this.intermediaryService.presentLoading();
      this.stateExpeditionAvelonService.getIndex().subscribe(response=>{
        this.intermediaryService.dismissLoading();  
        this.stateExpeditionAvelons = response;
        this.form.removeControl("toDelete");
        this.form.addControl("toDelete",this.formBuilder.array(this.stateExpeditionAvelons.map(toDelete=>new FormControl(false))));
      })
    
  }

  async toStore(){
    let modal = (await this.modalCtrl.create({
      component:StoreComponent
    }));
    modal.onDidDismiss().then(()=>{
      this.getStateExpeditionsAvalon();
    })
    modal.present();
  }

  async toUpdate(event,object){
    event.stopPropagation();
    event.preventDefault();
    let modal = (await this.modalCtrl.create({
      component:UpdateComponent,
      componentProps:{
        object:object
      }
    }))
    modal.onDidDismiss().then(()=>{
      this.getStateExpeditionsAvalon();
    })
    modal.present();
  }

  prevent(event){
    event.preventDefault();
    event.stopPropagation();
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }
  selectAllToDelete(event):void{
    const value = event.detail.checked;
    (<FormArray>this.form.controls.toDelete).controls.forEach(control=>{
      control.setValue(value);
    });
  }

  
}




