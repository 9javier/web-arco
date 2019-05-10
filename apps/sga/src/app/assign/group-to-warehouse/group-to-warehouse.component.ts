import { Component, OnInit } from '@angular/core';
import {
  GroupsService,
  GroupModel,
  WarehousesService,
  WarehouseModel, ACLModel, RolModel, PermissionsModel
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
  selected = false;
  panelOpenState = false;
  groups: GroupModel.Group[] = [];
  warehouses: WarehouseModel.Warehouse[] = [];
  constructor(
    private groupsService: GroupsService,
    private warehousesService: WarehousesService,
    private toastController: ToastController
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


  setGroup(
    warehouseId: number,
    groupId: number
  ){
    this.warehousesService
      .deleteGroupToWarehouse(warehouseId, groupId)
      .then((data: Observable<HttpResponse<WarehouseModel.ResponseUpdate>>) => {
        data.subscribe(
          (res: HttpResponse<WarehouseModel.ResponseUpdate>) => {
            this.presentToast(
              `El grupo ha sido actualizado`
            );
          },
          (errorResponse: HttpErrorResponse) => {
            this.presentToast(
              `${errorResponse.status} - ${errorResponse.message}`
            );
          }
        );
      });
    }

  unsetGroup(
    warehouseId: number,
    groupId: number
  ){
    this.warehousesService
      .deleteGroupToWarehouse(warehouseId, groupId)
      .then((data: Observable<HttpResponse<WarehouseModel.ResponseDelete>>) => {
        data.subscribe(
          (res: HttpResponse<WarehouseModel.ResponseDelete>) => {
            this.presentToast(
              `El grupo ha sido actualizado`
            );
          },
          (errorResponse: HttpErrorResponse) => {
            this.presentToast(
              `${errorResponse.status} - ${errorResponse.message}`
            );
          }
        );
      });
    }

  changeAssignment(
    warehouseId: number,
    groupId: number,
    status: boolean
  ){
    if (status){
      console.log(this);
      this.setGroup(warehouseId, groupId);
      alert('esto es cierto');
    } else {
      console.log(this);
      alert('esto es falso');
      this.unsetGroup(warehouseId, groupId);
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 4550
    });
    toast.present();
  }
}


