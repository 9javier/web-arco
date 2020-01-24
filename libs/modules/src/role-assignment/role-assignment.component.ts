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
import { AlertController } from '@ionic/angular';

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
  ) { }

  async ngOnInit() {}

  ngAfterViewInit(): void {
    this.getRoles().then(async () => {
      this.getUsers().then(async () => {
        await this.intermediaryService.dismissLoading();
      });
    });
  }

  async getUsers() {
    await this.usersService.getIndex().then(async (obsItem: Observable<HttpResponse<UserModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<UserModel.ResponseIndex>) => {
        const users = res.body.data;

        if (users && users.length > 0) {
          users.forEach((user: any) => {
            const hasPermits = user.permits.length > 0;
            const rowId = this.ELEMENT_DATA.push({ userId: user.id, userName: user.name, isGroupBy: true, hasPermits: hasPermits, expanded: false});

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

                  this.ELEMENT_DATA.push({rowParentId: rowId-1, parentUser: user.id, warehouseId: permit.warehouse.id, warehouseName: permit.warehouse.name, roles: roles, expanded: false});
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
    await this.intermediaryService.presentLoading('Un momento ...');
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
    console.log('DELETE');
    console.log(element);

    await this.presentAlertDelete(id, element);
  }

  clearRow(id: number, element: any) {
    const dataOriginal = <any>this.ELEMENT_DATA_ORIGINAL[id];

    dataOriginal.roles.forEach((rolOri, index) => {
      element.roles[index].checked = rolOri.checked;
    });

    this.deleteElementArray(id);
  }

  changeCheckRol(event, id: number, element: WarehouseElement, i: number) {
    const data = <any>this.ELEMENT_DATA_ORIGINAL[id];
    element.roles[i].checked = event.checked;

    if (JSON.stringify(element.roles) === JSON.stringify(data.roles)) {
      this.deleteElementArray(id);
    } else {
      this.addElementArray(id, element);
    }

    console.log(this.listToUpdate);
  }

  saveChanges() {
    console.log('SAVE');
  }

  addRol(group: any) {
    console.log('ADD ROLE');
    console.log(group);
  }

  async presentAlertDelete(id: number, element: any) {
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

  private saveDeleteRole(id: number, element: any) {
    this.intermediaryService.presentLoading();

    const data = <any>this.ELEMENT_DATA;
    this.ELEMENT_DATA.splice(id, 1);
    const indexParent = data.findIndex((x) => x.userId === element.parentUser);
    const permits = data.filter((x) => x.parentUser === element.parentUser);
    const body = [{
      id: element.parentUser,
      permits: []
    }];

    permits.forEach((permit) => {
      const roles = [];
      permit.roles.forEach((role) => {
        if (role.checked) {
          roles.push({ rol: role.id });
        }
      });

      const index = body.findIndex((x) => x.id === permit.parentUser);
      if (index !== -1) {
        body[index].permits.push({
          warehouse: permit.warehouseId,
          roles: roles
        });
      }
    });

    if (indexParent !== -1 && body[0].permits.length === 0) {
      this.ELEMENT_DATA[indexParent]['hasPermits'] = false;
    }

    this.sendDataEndPoint(body);
  }

  private sendDataEndPoint(body) {
    this.usersService.updateWarehouseInUser(body)
      .then((data: Observable<HttpResponse<UserModel.ResponseShow>>) => {
        data.subscribe((res: HttpResponse<UserModel.ResponseShow>) => {
          this.dataSourceUsers = new MatTableDataSource(this.ELEMENT_DATA);
          this.intermediaryService.dismissLoading();
          }, (err) => {
            console.log(err);
            this.intermediaryService.dismissLoading();
        });
      }, (err) => {
        console.log(err);
        this.intermediaryService.dismissLoading();
      });
  }

  private deleteElementArray(id: number) {
    if (this.listToUpdate.length > 0) {
      const index = this.listToUpdate.findIndex((x) => x.id === id);

      if (index !== -1) {
        this.listToUpdate.splice(index, 1);
      }
    }

    console.log(this.listToUpdate);
  }

  private addElementArray(id: number, element: any) {
    if (this.listToUpdate.length > 0) {
      const index = this.listToUpdate.findIndex((x) => x.id === id);

      if (index === -1) {
        this.listToUpdate.push({id, element});
      }
    } else {
      this.listToUpdate.push({id, element});
    }

    console.log(this.listToUpdate);
  }
}
