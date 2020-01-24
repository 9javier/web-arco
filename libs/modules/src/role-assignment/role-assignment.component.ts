import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  IntermediaryService,
  RolesService,
  RolModel,
  UserModel,
  UsersService,
  WarehouseModel,
  WarehousesService
} from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { AlertController, ModalController } from '@ionic/angular';
import { AddRoleAssignmentComponent } from './add-role-assignment/add-role-assignment.component';

export interface WarehouseElement {
  rowParentId: number,
  parentUser: number,
  warehouseId: number,
  warehouseName: string;
  roles: {id: number, checked: boolean};
  expanded: boolean;
}

export interface GroupBy {
  userId: number;
  userName: string;
  isGroupBy: boolean;
  hasPermits: boolean;
  hasAllWarehouse: boolean,
  expanded: boolean;
}

@Component({
  selector: 'suite-role-assignment',
  templateUrl: './role-assignment.component.html',
  styleUrls: ['./role-assignment.component.scss'],
})

export class RoleAssignmentComponent implements OnInit, AfterViewInit {
  title = 'Asignación de roles';
  dataSourceUsers;
  dataSourceWarehouses: WarehouseModel.Warehouse[];
  dataSourceRoles: RolModel.Rol[];
  displayedColumns: string[] = ['warehouse'];
  selectWarehouse;
  listToUpdate = [];

  ELEMENT_DATA: (WarehouseElement | GroupBy)[] = [];
  ELEMENT_DATA_ORIGINAL: (WarehouseElement | GroupBy)[] = [];

  constructor(
    private intermediaryService: IntermediaryService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private warehousesService: WarehousesService,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {
    this.getWarehouses();
  }

  async ngOnInit() {}

  async ngAfterViewInit() {
    await this.getRolesAndUsers();
  }

  async getRolesAndUsers(userId: number = null) {
    await this.intermediaryService.presentLoading('Un momento ...');
    await this.getRoles().then(async () => {
      await this.getUsers(userId).then(async () => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.dismissLoading();
        this.intermediaryService.dismissLoading();
      });
    });
  }

  async getUsers(userId: number = null) {
    this.ELEMENT_DATA = [];
    this.ELEMENT_DATA_ORIGINAL = [];
    this.dataSourceUsers = [];
    await this.usersService.getIndex().then(async (obsItem: Observable<HttpResponse<UserModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<UserModel.ResponseIndex>) => {
        const users = res.body.data;

        if (users && users.length > 0) {
          users.forEach((user: any) => {
            const hasPermits = user.permits.length > 0;
            const hasAllWarehouse = user.permits.length === this.dataSourceWarehouses.length;
            const expanded = user.id === userId;
            const rowId = this.ELEMENT_DATA.push({ userId: user.id, userName: user.name, isGroupBy: true, hasPermits: hasPermits, hasAllWarehouse: hasAllWarehouse, expanded: expanded});

            if (user.permits && user.permits.length > 0) {
              user.permits.forEach((permit: any) => {
                if (permit.warehouse && permit.roles && permit.roles.length > 0) {
                  const roles = <any>[];

                  this.dataSourceRoles.forEach((dataRol) => {
                    const find = permit.roles.find(x => x.rol.id === dataRol.id);
                    if (find) {
                      roles.push({id: dataRol.id, checked: true});
                    } else {
                      roles.push({id: dataRol.id, checked: false});
                    }
                  });

                  this.ELEMENT_DATA.push({rowParentId: rowId-1, parentUser: user.id, warehouseId: permit.warehouse.id, warehouseName: permit.warehouse.name, roles: roles, expanded: expanded});
                }
              })
            }
          });

          this.ELEMENT_DATA_ORIGINAL = JSON.parse(JSON.stringify(this.ELEMENT_DATA));

          this.dataSourceUsers = new MatTableDataSource(this.ELEMENT_DATA);
        }
      }, async (err) => {
        console.log(err);
        await this.intermediaryService.dismissLoading();
      });
    });
  }

  async getRoles() {
    this.displayedColumns = ['warehouse'];
    this.rolesService.getIndex().then(async (obsItem: Observable<HttpResponse<RolModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<RolModel.ResponseIndex>) => {
        this.dataSourceRoles = res.body.data;

        if (this.dataSourceRoles.length > 0) {
          this.dataSourceRoles.forEach((rol) => {
            this.displayedColumns.push(rol.id.toString());
          });
        }

        this.displayedColumns.push('clear');
        this.displayedColumns.push('delete');
      }, async (err) => {
        console.log(err);
        await this.intermediaryService.dismissLoading();
      });
    });
  }

  async getWarehouses() {
    this.warehousesService.getIndex().then(async (obsItem: Observable<HttpResponse<WarehouseModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<WarehouseModel.ResponseIndex>) => {
        this.dataSourceWarehouses = res.body.data;
        if (this.dataSourceWarehouses.length > 0) {
          this.selectWarehouse = this.dataSourceWarehouses[0].id;
        }
      }, async (err) => {
        console.log(err);
        await this.intermediaryService.dismissLoading();
      });
    });
  }

  isGroup(index, item): boolean{
    return item.isGroupBy;
  }

  groupHeaderClick(group: any) {
    if (group.hasPermits) {
      group.expanded = !group.expanded;
      this.ELEMENT_DATA.forEach((element: any) => {
        if (element.parentUser === group.userId){
          element.expanded = group.expanded;
        }
      });

      this.dataSourceUsers = new MatTableDataSource(this.ELEMENT_DATA);
    }
  }

  async deleteRow(id: number, element: any) {
    const alert = await this.alertController.create({
      header: '¡Alerta!',
      message: `¿Está seguro que desea eliminar ${element.warehouseName} del registro?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Aceptar',
          cssClass: 'secondary',
          handler: () => {
            this.saveDeleteRole(id, element);
          }
        },
      ]
    });
    await alert.present();
  }

  clearRow(id: number, element: any) {
    const dataOriginal = <any>this.ELEMENT_DATA_ORIGINAL[id];

    dataOriginal.roles.forEach((rolOri, index) => {
      element.roles[index].checked = rolOri.checked;
    });

    this.deleteElementArray(element.parentUser, id);
  }

  changeCheckRol(event, id: number, element: WarehouseElement, i: number) {
    const data = <any>this.ELEMENT_DATA_ORIGINAL[id];
    element.roles[i].checked = event.checked;

    if (JSON.stringify(element.roles) === JSON.stringify(data.roles)) {
      this.deleteElementArray(element.parentUser, id);
    } else {
      this.addElementArray(element.parentUser, id);
    }
  }

  saveChanges(e) {
    e.preventDefault();
    e.stopPropagation();
    this.intermediaryService.presentLoading('Un momento ...');

    const aux = JSON.parse(JSON.stringify(this.listToUpdate));
    this.listToUpdate = [];

    const data = <any>this.ELEMENT_DATA;
    const body = [];
    aux.forEach((item) => {
      body.push(this.fillBodyEndPoint(data, item.userId));
    });

    this.sendDataEndPoint(body);
  }

  async addRol(id: number, group: any) {
    this.intermediaryService.presentLoading('Un momento ...');
    const data = <any>this.ELEMENT_DATA;
    const warehousesUser = data.filter((x) => x.parentUser === group.userId);
    const warehouses = this.dataSourceWarehouses.filter((warehouse) => {
      const index = warehousesUser.findIndex((x) => x.warehouseId === warehouse.id);
      return index === -1;
    });

    const modal = await this.modalController.create({
      component: AddRoleAssignmentComponent,
      componentProps: {
        userName: group.userName,
        warehouses: warehouses
      }
    });

    modal.onDidDismiss().then((dataReturn) => {
      if (dataReturn.data !== undefined){
        this.saveAddedRole(dataReturn.data, group);
      }
    });

    return await modal.present().then(() => {
      this.intermediaryService.dismissLoading();
    });
  }

  saveAddedRole(dataForm: any, group: GroupBy) {
    this.intermediaryService.presentLoading('Un momento ...');
    const data = <any>this.ELEMENT_DATA;
    const body = [];
    body.push(this.fillBodyEndPoint(data, group.userId));

    const index = body.findIndex((x) => x.id === group.userId);

    const roles = [];
    dataForm.roles.forEach((role) => {
      if (role.isChecked) {
        roles.push({ rol: role.value });
      }
    });

    if (index !== -1) {
      body[index].permits.push({
        warehouse: dataForm.warehouseId,
        roles: roles
      });
    }

    this.sendDataEndPoint(body, group.userId);
  }

  private saveDeleteRole(id: number, element: any) {
    this.intermediaryService.presentLoading('Un momento ...');

    const data = <any>this.ELEMENT_DATA;
    this.ELEMENT_DATA.splice(id, 1);
    const body = [];
    body.push(this.fillBodyEndPoint(data, element.parentUser));

    this.sendDataEndPoint(body, element.parentUser);
  }

  private fillBodyEndPoint(data, userId: number) {
    const permits = data.filter((x) => x.parentUser === userId);
    const body = {
      id: userId,
      permits: []
    };

    permits.forEach((permit) => {
      const roles = [];
      permit.roles.forEach((role) => {
        if (role.checked) {
          roles.push({ rol: role.id });
        }
      });

      body.permits.push({
        warehouse: permit.warehouseId,
        roles: roles
      });
    });
    return body;
  }

  private sendDataEndPoint(body, userId: number = null) {
    this.usersService.updateWarehouseInUser(body)
      .then((data: Observable<HttpResponse<UserModel.ResponseShow>>) => {
        data.subscribe((res: HttpResponse<UserModel.ResponseShow>) => {
          this.intermediaryService.dismissLoading();
          this.getRolesAndUsers(userId);
          }, (err) => {
            console.log(err);
            this.intermediaryService.dismissLoading();
        });
      }, (err) => {
        console.log(err);
        this.intermediaryService.dismissLoading();
      });
  }

  private deleteElementArray(userId: number, idRow: number) {
    if (this.listToUpdate.length > 0) {
      const index = this.listToUpdate.findIndex((x) => x.userId === userId);

      if (index !== -1) {
        const indexRow = this.listToUpdate[index].rows.findIndex((x) => x.idRow === idRow);

        if (indexRow !== -1) {
          this.listToUpdate[index].rows.splice(indexRow, 1);

          if (this.listToUpdate[index].rows.length === 0) {
            this.listToUpdate.splice(index, 1);
          }
        }
      }
    }
  }

  private addElementArray(userId: number, idRow: number) {
    const index = this.listToUpdate.findIndex((x) => x.userId === userId);

    if (index === -1) {
      this.listToUpdate.push({userId, rows: [{idRow}]});
    } else {
      const indexRow = this.listToUpdate[index].rows.findIndex((x) => x.idRow === idRow);

      if (indexRow === -1) {
        this.listToUpdate[index].rows.push({idRow});
      }
    }
  }
}
