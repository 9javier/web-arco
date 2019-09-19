import { Component, OnInit } from '@angular/core';
import {
  GroupsService,
  GroupModel,
  WarehousesService,
  WarehouseModel,
  IntermediaryService
} from '@suite/services';
import { Observable } from 'rxjs';
import {HttpResponse, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'suite-group-to-warehouses',
  templateUrl: './group-to-warehouse.component.html',
  styleUrls: ['./group-to-warehouse.component.scss']
})

export class GroupToWarehouseComponent implements OnInit {
  groups: GroupModel.Group[] = [];
  warehouses: WarehouseModel.Warehouse[] = [];
  trackByIndex = index => index;

  constructor(
    private groupsService: GroupsService,
    private warehousesService: WarehousesService,
    private toastController: ToastController,
    private intermediaryService:IntermediaryService
  ) {}

  ngOnInit() {
    this.initGroups();
  }

  initGroups(){
    this.intermediaryService.presentLoading();
    Promise.all([
      this.groupsService.getIndex(),
      this.warehousesService.getIndex(),
    ]).then(
      (data: any) => {
        data[0].subscribe(
          (res: HttpResponse<GroupModel.ResponseIndex>) => {
            this.groups = res.body.data;
          },
          err => { },
          () => {
            this.intermediaryService.dismissLoading();
          });
        data[1].subscribe(
          (res: HttpResponse<WarehouseModel.ResponseIndex>) => {
            this.warehouses = res.body.data;
          },
          err => { },
          () => {
            this.intermediaryService.dismissLoading();
          });
      },
      err => {
      }
    );
  }

  assignGroupToWarehouse(
    warehouse: WarehouseModel.Warehouse,
    group: GroupModel.Group
  ){
    this.warehousesService
      .postAssignGroupToCategory(warehouse.id, group.id)
      .then((data: Observable<HttpResponse<WarehouseModel.ResponseUpdate>>) => {
        data.subscribe(
          (res: HttpResponse<WarehouseModel.ResponseUpdate>) => {
            this.presentToast(
              `El grupo ${group.name} ha sido asignado a la tienda ${warehouse.name} `
            );
            this.initGroups();
          },
          (errorResponse: HttpErrorResponse) => {
            this.presentToast(
              `${errorResponse.status} - ${errorResponse.message}`
            );
            this.initGroups();
          }
        );
      });
    }

  deleteGroupFromWarehouse(
    warehouse: WarehouseModel.Warehouse,
    group: GroupModel.Group
  ){
    this.warehousesService
      .deleteGroupToWarehouse(warehouse.id, group.id)
      .then((data: Observable<HttpResponse<WarehouseModel.ResponseDelete>>) => {
        data.subscribe(
          (res: HttpResponse<WarehouseModel.ResponseDelete>) => {
            this.presentToast(
              `El grupo ${group.name} ha sido desvinculado de la tienda ${warehouse.name} `
            );
            this.initGroups();
          },
          (errorResponse: HttpErrorResponse) => {
            this.presentToast(
              `${errorResponse.status} - ${errorResponse.message}`
            );
            this.initGroups();
          }
        );
      });
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


