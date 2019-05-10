import { Component, OnInit } from '@angular/core';
import {
  GroupsService,
  GroupModel,
  WarehousesService,
  WarehouseModel, ACLModel, RolModel
} from '@suite/services';
import { Observable } from 'rxjs';
import {HttpResponse, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { MatSelectionListChange, MatListOption } from '@angular/material/list';
import { mergeMap } from 'rxjs/operators';
import {WarehousesModule} from "../../warehouses/warehouses.module";


@Component({
  selector: 'suite-permission-to-rol',
  templateUrl: './group-to-warehouse.component.html',
  styleUrls: ['./group-to-warehouse.component.scss']
})

export class GroupToWarehouseComponent implements OnInit {
  groups: GroupModel.Group[] = [];
  warehouses: WarehouseModel.Warehouse[] = [];
  constructor(
    private groupsService: GroupsService,
    private warehousesService: WarehousesService
  ) {}

  ngOnInit() {
    Promise.all([
      this.groupsService.getIndex(),
      this.warehousesService.getIndex(),
    ]).then(
      (data: any) => {
        data[0].subscribe(
          (res: HttpResponse<GroupModel.ResponseIndex>) => {
            this.groups = res.body.data;
            console.log(this.groups);
          });
        data[1].subscribe(
          (res: HttpResponse<WarehouseModel.ResponseIndex>) => {
            this.warehouses = res.body.data;
            console.log(this.warehouses);
          });
      },
      err => {
        console.log(err);
      }
    );
  }
  assignGroupToWarehouse(
    warehouse: any,
    group: any
  ){
    this.warehousesService.postAssignGroupToCategory(warehouse.id, group.id);
  }
}
