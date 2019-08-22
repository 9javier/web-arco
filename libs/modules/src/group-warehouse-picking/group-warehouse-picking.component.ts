import { Component, OnInit,Input } from '@angular/core';
import { GroupWarehousePickingService,GroupWarehousePickingModel, IntermediaryService } from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import { ModalController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import { UpdateComponent } from './modals/update/update.component';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable,merge } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { WarehousesService, WarehouseModel } from '@suite/services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'suite-group-warehouse-picking',
  templateUrl: './group-warehouse-picking.component.html',
  styleUrls: ['./group-warehouse-picking.component.scss']
})
export class GroupWarehousePickingComponent implements OnInit {



  displayedColumns: string[] = ['delete','name','initDate','endDate'];
  dataSource: MatTableDataSource<GroupWarehousePickingModel.GroupWarehousePicking>;
  groupsWarehousePicking: GroupWarehousePickingModel.GroupWarehousePicking[];
  warehouses: WarehouseModel.Warehouse[] = [];
  toDeleteGroup: boolean = false;
  groupsToDelete: number[] = [];

  toDelete:FormGroup = this.formBuilder.group({
    groups:(new FormArray([]))
  })

  groupWarehousePickings:Array<GroupWarehousePickingModel.GroupWarehousePicking> = [];
  constructor(
    private groupWarehousePickingService:GroupWarehousePickingService,
    private modalController:ModalController,
    private formBuilder:FormBuilder,
    private intermediaryService:IntermediaryService,
    private warehousesService: WarehousesService,
    ) { }

  ngOnInit() {
    this.getGroupWarehousePicking();
    this.warehousesService.getIndex().then(observable=>{
      observable.subscribe(warehouses=>{
        this.warehouses = warehouses.body.data;
      });
    })
  }

  /**
   * Delete all warehouses
   */
  delete():void{
    let deletions:Observable<any> =new Observable(observer=>observer.next());
    (<[{id:number,selected:boolean}]>this.toDelete.value.groups).forEach(group=>{
      if(group.selected){
        deletions = deletions.pipe(switchMap(()=>{
            return (this.groupWarehousePickingService.delete(group.id))
          }))
        }
    });

    this.intermediaryService.presentLoading();
    deletions.subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.getGroupWarehousePicking();
      this.intermediaryService.presentToastSuccess("Grupos eliminados con exito");
    },()=>{
      this.intermediaryService.dismissLoading();
      this.getGroupWarehousePicking();
      this.intermediaryService.presentToastError("No se pudieron eliminar algunos de los grupos");
    });
  }

  /**
   * Prevent default
   * @param event 
   */
  prevent(event){
    event.preventDefault();
    event.stopPropagation();
  }

  haveToDelete(groups):boolean{
    let group = groups.find(group=>{
      return group.selected;
    })
    return !!group;
  }
  

  /**
   * Show details of group for update
   * @param group group to inspect
   */
  async goGroup(group:GroupWarehousePickingModel.GroupWarehousePicking){
    let modal = await this.modalController.create({
      component:UpdateComponent,
      componentProps:{
        group:group
      }
    });
    modal.onDidDismiss().then(()=>{
      this.getGroupWarehousePicking();
    });
    modal.present();
  }

  /**
   * Get a list of all group warehouse pickings
   */
  getGroupWarehousePicking():void{
    this.intermediaryService.presentLoading();
    this.groupWarehousePickingService.getIndex().subscribe(groupWarehousePickings=>{
      this.groupsWarehousePicking = groupWarehousePickings
      console.log(this.groupsWarehousePicking)
    }, (e) => {
      console.log(e)
    }, () => {
      this.intermediaryService.dismissLoading();
    });
  }

  /**
   * Open store modal
   */
  async store(){
    let modal = (await this.modalController.create({
      component:StoreComponent
    }));
    modal.onDidDismiss().then(()=>{
      this.getGroupWarehousePicking();
    });
    modal.present();
  }

  assignToGroupWarehousePicking(warehouse, group) {
    this.warehousesService
    .toGroupWarehousePicking(Number(warehouse.id), Number(group.id))
    .then((data: Observable<HttpResponse<GroupWarehousePickingModel.GroupWarehousePicking>>) => {
      data.subscribe(
        (res: HttpResponse<GroupWarehousePickingModel.GroupWarehousePicking>) => {
          console.log('warehouse añadido al grupo')
        },
        (errorResponse: HttpErrorResponse) => {
          console.log('error al añadir')
        }
      );
    });
  }

  /**
   * Activate delete button
   */
  activateDelete(id: number) {
    this.toDeleteGroup = true;
    let exits: boolean = this.groupsToDelete.some(groupId => groupId == id);
    if(!exits) {
      this.groupsToDelete.push(id);
    } else {
      this.groupsToDelete.splice( this.groupsToDelete.indexOf(id), 1 );
    }
    if(this.groupsToDelete.length == 0) {
      this.toDeleteGroup = false;
    }
  }

  /**
   * Delete group
   */
   deleteGroup() {
    let deletions:Observable<any> =new Observable(observer=>observer.next());
    this.groupsToDelete.forEach(groupId => {
      deletions = deletions.pipe(switchMap(() => { 
        return (this.groupWarehousePickingService.delete(groupId))
      }))
    })

    this.groupsToDelete = [];
    this.intermediaryService.presentLoading();

    deletions.subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.getGroupWarehousePicking();
      this.intermediaryService.presentToastSuccess("Grupos eliminados con exito");
    },()=>{
      this.intermediaryService.dismissLoading();
      this.getGroupWarehousePicking();
      this.intermediaryService.presentToastError("No se pudieron eliminar algunos de los grupos");
    });
   }
}
