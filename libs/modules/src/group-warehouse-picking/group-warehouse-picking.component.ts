import { Component, OnInit, Input } from '@angular/core';
import { GroupWarehousePickingService, GroupWarehousePickingModel, IntermediaryService } from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import { ModalController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import { UpdateComponent } from './modals/update/update.component';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable, merge } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { WarehousesService, WarehouseModel } from '@suite/services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'suite-group-warehouse-picking',
  templateUrl: './group-warehouse-picking.component.html',
  styleUrls: ['./group-warehouse-picking.component.scss']
})
export class GroupWarehousePickingComponent implements OnInit {

  // aqui

  displayedColumns: string[] = ['delete', 'name', 'initDate', 'endDate'];
  dataSource: MatTableDataSource<GroupWarehousePickingModel.GroupWarehousePicking>;
  groupsWarehousePicking: GroupWarehousePickingModel.GroupWarehousePicking[];
  warehouses: WarehouseModel.Warehouse[] = [];
  toDeleteGroup: boolean = false;
  groupsToDelete: number[] = [];

  toDelete: FormGroup = this.formBuilder.group({
    groups: (new FormArray([]))
  })

  groupWarehousePickings: Array<GroupWarehousePickingModel.GroupWarehousePicking> = [];
  constructor(
    private groupWarehousePickingService: GroupWarehousePickingService,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
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
   * Prevent default
   * @param event 
   */
  prevent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  haveToDelete(groups): boolean {
    let group = groups.find(group => {
      return group.selected;
    })
    return !!group;
  }


  /**
   * Show details of group for update
   * @param group group to inspect
   */
  async goGroup(group: GroupWarehousePickingModel.GroupWarehousePicking) {
    let modal = await this.modalController.create({
      component: UpdateComponent,
      componentProps: {
        group: group
      }
    });
    modal.onDidDismiss().then(() => {
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
      this.groupsWarehousePicking = groupWarehousePickings;
    }, (e) => {
      // console.log(e)
    }, () => {
      this.intermediaryService.dismissLoading();
    });
  }

  /**
   * Open store modal
   */
  async store() {
    let modal = (await this.modalController.create({
      component: StoreComponent
    }));
    modal.onDidDismiss().then(() => {
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
          this.intermediaryService.presentToastSuccess("Warehouse añadido al GroupPicking");
          let groupUpdated = (<any>res.body).data;
          this.updateGroup(groupUpdated);
        },
        (errorResponse: HttpErrorResponse) => {
          this.intermediaryService.presentToastError("Error al añadir el warehouse");
          // console.log(errorResponse)
        }
      );
    });
  }

  remoToGroupWarehousePicking(warehouse, group) {
    this.warehousesService
    .removeOfGroupWarehousePicking(Number(warehouse.id), Number(group.id))
    .then((data: Observable<HttpResponse<WarehouseModel.ResponseDelete>>) => {
      data.subscribe(
        (res: HttpResponse<WarehouseModel.ResponseDelete>) => {
          this.intermediaryService.presentToastSuccess("Warehouse removido del GroupPicking");
          let groupUpdated = (<any>res.body).data;
          this.updateGroup(groupUpdated);
        },
        (errorResponse: HttpErrorResponse) => {
          this.intermediaryService.presentToastError("Error al remover el warehouse");
          // console.log(errorResponse)
        }
      );
    });
  }


  updateGroup(groupUpdated): void {
    this.groupsWarehousePicking.forEach(group => {
      if(group.id == groupUpdated.id) {
        group.warehouses = groupUpdated.warehouses;
      }
    })
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

   selectCheck(warehouseId: number, groupId: number): boolean {
    let checkValue: boolean = false;

    this.groupsWarehousePicking.forEach(group => {
        group.warehouses.forEach(warehosue => {
        if(warehouseId == warehosue.id && groupId == group.id){
          checkValue = true;
        }
      })
    })
    return checkValue;
  }
}
