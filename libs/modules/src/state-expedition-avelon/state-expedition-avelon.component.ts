import { Component, OnInit } from '@angular/core';
import { COLLECTIONS } from 'config/base';
import {ModalController} from "@ionic/angular";
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import { CarrierService, WarehouseModel, IntermediaryService } from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { WarehouseService } from 'libs/services/src/lib/endpoint/warehouse/warehouse.service';
import { StateExpeditionAvelonService } from 'libs/services/src/lib/endpoint/state-expedition-avelon/state-expedition-avelon.service';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UpdateComponent } from './update/update.component';
import { StoreComponent } from './store/store.component';
import { SendComponent } from './send/send.component';

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

  toDelete:FormGroup = this.formBuilder.group({
    jails:this.formBuilder.array([])
  });

  constructor(
    private formBuilder:FormBuilder,
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


  prevent(event){
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Open modal to edit pr
   * @param event - to cancel it
   * @param jail - jail to be updated
   */
  async toUpdate(event,jail){
    event.stopPropagation();
    event.preventDefault();
    let modal = (await this.modalCtrl.create({
      component:UpdateComponent,
      componentProps:{
        jail:jail
      }
    }))
    modal.onDidDismiss().then(()=>{
      //this.getCarriers();
    })
    modal.present();
  }


  delete(){
    /*let observable = new Observable(observer=>observer.next());
    this.toDelete.value.jails.forEach(jail => {
      if(jail.selected)
        observable = observable.pipe(switchMap(resonse=>{
          //return this.carrierService.delete(jail.id)
        }))
    });
    this.intermediaryService.presentLoading();
    observable.subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Jaula eliminada con exito");
      //this.getCarriers();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Error eliminando jaula");
    })*/
  }

  

  /**
   * check if have items to delete
   */
  hasToDelete():boolean{
    return !!this.toDelete.value.jails.find(jail => jail.selected);
  }

  /**
   * Open modal to edit jail
   * @param event - to cancel it
   * @param jail - jail to be updated
   */
  async send(event, jail) {
    event.stopPropagation();
    event.preventDefault();
    let modal = (await this.modalCtrl.create({
      component:SendComponent,
      componentProps:{
        jail:jail
      },
      cssClass: 'modalStyles'
    }))
    modal.onDidDismiss().then(()=>{
      //this.getCarriers();
    })
    modal.present();
  }

  /**
   * Change one destination
   * @param prev the previous warehouse
   * @param current the current value of this destination
   */
  updateDestination(prev:number,current:number):void{
    //this.intermediaryService.presentLoading();
    /*this.carrierService.updateDestination(prev,{destinationWarehouseId:current}).subscribe(()=>{
      this.intermediaryService.presentToastSuccess("Destino actualizado con éxito");
      this.intermediaryService.dismissLoading();
      //this.getCarriers();
    },()=>{
      this.intermediaryService.presentToastError("Error al actualizar destino");
      this.intermediaryService.dismissLoading();
    });*/
  }

  setDestination(carrierId: number, current:number):void{
    //this.intermediaryService.presentLoading();
    /*this.carrierService.setDestination(carrierId, current).subscribe(()=>{
      this.intermediaryService.presentToastSuccess("Destino actualizado con éxito");
      this.intermediaryService.dismissLoading();
      //this.getCarriers();
    },()=>{
      this.intermediaryService.presentToastError("Error al actualizar destino");
      this.intermediaryService.dismissLoading();
    });*/
  }

  
 

  closeModal()
  {
    this.modalCtrl.dismiss();
  }

  async moveToFirst()
  {
    const modal = await this.modalCtrl.create({
      component: 'StoreComponent'
    });

    return await modal.present();
  }
}




