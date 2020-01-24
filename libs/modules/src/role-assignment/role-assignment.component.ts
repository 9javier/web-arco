import { Component, OnInit } from '@angular/core';
import {
  IntermediaryService,
  RolesService,
  RolModel,
  UserModel,
  UsersService,
  WarehouseModel
} from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { AlertController, ModalController } from '@ionic/angular';
import { AddRoleAssignmentComponent } from './add-role-assignment/add-role-assignment.component';

@Component({
  selector: 'suite-role-assignment',
  templateUrl: './role-assignment.component.html',
  styleUrls: ['./role-assignment.component.scss'],
})

export class RoleAssignmentComponent implements OnInit {
  title = 'Asignación de roles';
  dataSourceUsers;
  displayedColumns: string[] = ['user', 'warehouse'];
  dataSourceRoles: RolModel.Rol[];
  listToUpdate = [];

  ELEMENT_DATA: any[];
  ELEMENT_DATA_ORIGINAL: any[];

  constructor(
    private intermediaryService: IntermediaryService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {}

  async ngOnInit() {
    await this.getRolesAndUsers();
  }

  async getRolesAndUsers() {
    await this.getRoles().then(async () => {
      await this.getUsers();
    });
  }

  async getUsers() {
    this.ELEMENT_DATA = [];
    this.ELEMENT_DATA_ORIGINAL = [];
    this.intermediaryService.presentLoading('Un momento ...');
    this.dataSourceUsers = [];
    await this.usersService.getIndex().then(async (obsItem: Observable<HttpResponse<UserModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<UserModel.ResponseIndex>) => {
        const users = res.body.data;

        if (users && users.length > 0) {
          users.forEach((user: any) => {
            if (user.permits && user.permits.length > 0) {
              user.permits.forEach((permit: any) => {
                const roles = <any>[];
                this.dataSourceRoles.forEach((dataRol) => {
                  const find = permit.roles.find(x => x.rol.id === dataRol.id);
                  if (find) {
                    roles.push({id: dataRol.id, checked: true});
                  } else {
                    roles.push({id: dataRol.id, checked: false});
                  }
                });

                this.ELEMENT_DATA.push({ userId: user.id, userName: user.name, warehouseId: permit.warehouse.id, warehouseName: `${permit.warehouse.reference} - ${permit.warehouse.name}`, roles: roles});
              });
            }
          });

          this.ELEMENT_DATA_ORIGINAL = JSON.parse(JSON.stringify(this.ELEMENT_DATA));
          this.dataSourceUsers = new MatTableDataSource(this.ELEMENT_DATA);
        }

        await this.intermediaryService.dismissLoading();
      }, async (err) => {
        console.log(err);
        await this.intermediaryService.dismissLoading();
      });
    });
  }

  async getRoles() {
    this.displayedColumns = ['user', 'warehouse'];
    this.rolesService.getIndex().then(async (obsItem: Observable<HttpResponse<RolModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<RolModel.ResponseIndex>) => {
        this.dataSourceRoles = res.body.data;

        if (this.dataSourceRoles.length > 0) {
          this.dataSourceRoles.forEach((rol) => {
            this.displayedColumns.push(rol.id.toString());
          });
        }
      }, async (err) => {
        console.log(err);
        await this.intermediaryService.dismissLoading();
      });
    });
  }

  async addNewRol() {
    this.intermediaryService.presentLoading('Un momento ...');

    const modal = await this.modalController.create({
      component: AddRoleAssignmentComponent,
    });

    modal.onDidDismiss().then((dataReturn) => {
      if (dataReturn.data !== undefined) {
        this.saveAddedRole(dataReturn.data);
      }
    });

    return await modal.present().then(() => {
      this.intermediaryService.dismissLoading();
    });
  }

  saveChanges(e) {
    e.preventDefault();
    e.stopPropagation();
    this.intermediaryService.presentLoading('Un momento ...');
    const aux = JSON.parse(JSON.stringify(this.listToUpdate));
    this.listToUpdate = [];

    const body = [];
    aux.forEach((item) => {
      body.push(this.fillBodyEndPoint(item.userId));
    });

    this.sendDataEndPoint(body);
  }

  saveAddedRole(dataForm: any) {
    const body = [];
    body.push(this.fillBodyEndPoint(dataForm.userId));

    const index = body.findIndex((x) => x.id === dataForm.userId);
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
    this.sendDataEndPoint(body);
  }

  async refreshAll() {
    await this.getRolesAndUsers();
  }

  changeCheckRol(event, id: any, element: any, i: number) {
    const data = <any>this.ELEMENT_DATA_ORIGINAL[id];
    element.roles[i].checked = event.checked;

    if (JSON.stringify(element.roles) === JSON.stringify(data.roles)) {
      this.deleteElementArray(element.userId, id);
    } else {
      this.addElementArray(element.userId, id);
    }
  }

  deleteElementArray(userId: number, idRow: number) {
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

  addElementArray(userId: number, idRow: number) {
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

  fillBodyEndPoint(userId: number) {
    const data = <any>this.ELEMENT_DATA;
    const permits = data.filter((x) => x.userId === userId);
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

  sendDataEndPoint(body) {
    body.forEach((element) => {
      element.permits = element.permits.filter((x) => x.roles.length > 0);
    });

    this.usersService.updateWarehouseInUser(body)
      .then((data: Observable<HttpResponse<UserModel.ResponseShow>>) => {
        data.subscribe(async (res: HttpResponse<UserModel.ResponseShow>) => {
          this.intermediaryService.dismissLoading();
          await this.getRolesAndUsers();
        }, (err) => {
            console.log(err);
            this.intermediaryService.dismissLoading();
        });
      }, (err) => {
        console.log(err);
        this.intermediaryService.dismissLoading();
      });
  }


//#region "OLD CODE"
//
//   saveChanges(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.intermediaryService.presentLoading('Un momento ...');
//
//     const aux = JSON.parse(JSON.stringify(this.listToUpdate));
//     this.listToUpdate = [];
//
//     const data = <any>this.ELEMENT_DATA;
//     const body = [];
//     aux.forEach((item) => {
//       body.push(this.fillBodyEndPoint(data, item.userId));
//     });
//
//     this.sendDataEndPoint(body);
//   }
//
//   saveAddedRole(dataForm: any, group: GroupBy) {
//     this.intermediaryService.presentLoading('Un momento ...');
//     const data = <any>this.ELEMENT_DATA;
//     const body = [];
//     body.push(this.fillBodyEndPoint(data, group.userId));
//
//     const index = body.findIndex((x) => x.id === group.userId);
//
//     const roles = [];
//     dataForm.roles.forEach((role) => {
//       if (role.isChecked) {
//         roles.push({ rol: role.value });
//       }
//     });
//
//     if (index !== -1) {
//       body[index].permits.push({
//         warehouse: dataForm.warehouseId,
//         roles: roles
//       });
//     }
//
//     this.sendDataEndPoint(body, group.userId);
//   }
//
//   private saveDeleteRole(id: number, element: any) {
//     this.intermediaryService.presentLoading('Un momento ...');
//
//     const data = <any>this.ELEMENT_DATA;
//     this.ELEMENT_DATA.splice(id, 1);
//     const body = [];
//     body.push(this.fillBodyEndPoint(data, element.parentUser));
//
//     this.sendDataEndPoint(body, element.parentUser);
//   }
//

//
//   private deleteElementArray(userId: number, idRow: number) {
//     if (this.listToUpdate.length > 0) {
//       const index = this.listToUpdate.findIndex((x) => x.userId === userId);
//
//       if (index !== -1) {
//         const indexRow = this.listToUpdate[index].rows.findIndex((x) => x.idRow === idRow);
//
//         if (indexRow !== -1) {
//           this.listToUpdate[index].rows.splice(indexRow, 1);
//
//           if (this.listToUpdate[index].rows.length === 0) {
//             this.listToUpdate.splice(index, 1);
//           }
//         }
//       }
//     }
//   }
//
//   private addElementArray(userId: number, idRow: number) {
//     const index = this.listToUpdate.findIndex((x) => x.userId === userId);
//
//     if (index === -1) {
//       this.listToUpdate.push({userId, rows: [{idRow}]});
//     } else {
//       const indexRow = this.listToUpdate[index].rows.findIndex((x) => x.idRow === idRow);
//
//       if (indexRow === -1) {
//         this.listToUpdate[index].rows.push({idRow});
//       }
//     }
//   }

  //#endregion "OLD CODE"
}
