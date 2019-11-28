import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {animate, state, style, transition, trigger} from '@angular/animations';
import { StateExpeditionAvelonService } from 'libs/services/src/lib/endpoint/state-expedition-avelon/state-expedition-avelon.service';
import { UpdateComponent } from './update/update.component';
import { StoreComponent } from './store/store.component';
import { DeleteComponent } from './delete/delete.component';
import { IntermediaryService } from '@suite/services';

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
  public title = 'StateExpeditionAvelon';
  public routePath = '/state-expedition-avelon';
  displayedColumns = ['name', 'status', 'update'];
  types = [];

  constructor(
    private modalCtrl:ModalController,
    private stateExpeditionAvelonService: StateExpeditionAvelonService,
    private intermediaryService:IntermediaryService,
    ) {
  }

  ngOnInit() {
    this.getStateExpeditionsAvalon();
  }

  getStateExpeditionsAvalon() {
    this.intermediaryService.presentLoading();
    this.stateExpeditionAvelonService.getIndex().subscribe(response=>{
        this.stateExpeditionAvelons = response;
        this.intermediaryService.dismissLoading();  
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

  async toDelete(event, object){
    event.stopPropagation();
    event.preventDefault();
    let modal = (await this.modalCtrl.create({
      component:DeleteComponent,
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
}




