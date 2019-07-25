import { Component, OnInit,Input } from '@angular/core';
import { GroupWarehousePickingService,GroupWarehousePickingModel } from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import { ModalController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import { UpdateComponent } from './modals/update/update.component';

@Component({
  selector: 'suite-group-warehouse-picking',
  templateUrl: './group-warehouse-picking.component.html',
  styleUrls: ['./group-warehouse-picking.component.scss']
})
export class GroupWarehousePickingComponent implements OnInit {



  displayedColumns: string[] = ['name','initDate','endDate'];
  dataSource: MatTableDataSource<GroupWarehousePickingModel.GroupWarehousePicking>;

  groupWarehousePickings:Array<GroupWarehousePickingModel.GroupWarehousePicking> = [];
  constructor(
    private groupWarehousePickingService:GroupWarehousePickingService,
    private modalController:ModalController) { }

  ngOnInit() {
    this.getGroupWarehousePicking();
  }

  /**
   * Show details of group for update
   * @param group group to inspect
   */
  async goGroup(group:GroupWarehousePickingModel.GroupWarehousePicking){
    let modal = await this.modalController.create({
      component:UpdateComponent,
      componentProps:{
        group
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
    this.groupWarehousePickingService.getIndex().subscribe(groupWarehousePickings=>{
      this.groupWarehousePickings = groupWarehousePickings;
      this.dataSource = new MatTableDataSource<any>(this.groupWarehousePickings);
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

}
