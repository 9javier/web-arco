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

export interface WarehouseElement {
  parentUser: number,
  warehouseId: number,
  warehouseName: string;
  roles: boolean[];
  expanded: boolean;
}

export interface GroupBy {
  userId: number;
  userName: string;
  isGroupBy: boolean;
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
  listToUpdate: WarehouseElement[] = [];

  ELEMENT_DATA: (WarehouseElement | GroupBy)[] = [];
  ELEMENT_DATA_ORIGINAL: (WarehouseElement | GroupBy)[] = [];

  constructor(
    private intermediaryService: IntermediaryService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private warehousesService: WarehousesService,
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
            this.ELEMENT_DATA.push({ userId: user.id, userName: user.name, isGroupBy: true, expanded: false});

            if (user.permits && user.permits.length > 0) {
              user.permits.forEach((permit: any) => {
                if (permit.warehouse && permit.roles && permit.roles.length > 0) {
                  const roles = [];

                  this.dataSourceRoles.forEach((dataRol) => {
                    const find = permit.roles.find(x => x.rol.id === dataRol.id);
                    if (find) {
                      roles.push(true);
                    } else {
                      roles.push(false);
                    }
                  });

                  this.ELEMENT_DATA.push({parentUser: user.id, warehouseId: permit.warehouse.id, warehouseName: permit.warehouse.name, roles: roles, expanded: false});
                }
              })
            }
          });

          this.ELEMENT_DATA_ORIGINAL = this.ELEMENT_DATA;

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

  groupHeaderClick(row: any) {
    row.expanded = !row.expanded;
    this.ELEMENT_DATA.forEach((element: any) => {
      if (element.parentUser === row.userId){
        element.expanded = row.expanded;
      }
    });

    this.dataSourceUsers = new MatTableDataSource(this.ELEMENT_DATA);
  }

  deleteRow(element: any) {
    console.log('DELETE');
    console.log(element);
  }

  clearRow(element: any) {
    console.log('CLEAR');
    console.log(element);
  }

  changeCheckRol(event, element: WarehouseElement, i: number) {
    element.roles[i] = event.checked;

    this.listToUpdate.push(element);

    // if (this.listToUpdate) {
    //
    //   const index = this.listToUpdate.indexOf(element, 0);
    //   if (index > -1) {
    //
    //     console.log('indexdata');
    //     console.log(indexData);
    //     this.listToUpdate.splice(index, 1);
    //   } else {
    //     this.listToUpdate.push(element);
    //   }
    // } else {
    //   this.listToUpdate.push(element);
    // }
  }

  isEqualOrigin(element) {
    let result = true;

    for(let item of this.ELEMENT_DATA_ORIGINAL) {
      const data = <any>item;
      if (data.parentUser === element.parentUser && data.warehouseId === element.warehouseId
        && data.warehouseName === element.warehouseName) {
        console.log(element.roles);
        console.log(data.roles);
        result = this.compare(element.roles, data.roles);
        break;
      } else {
        result = false;
      }
    }

    return result;
  }

  compare(arr1, arr2) {
    if (!arr1  || !arr2) {
      return
    }

    let result;
    arr1.forEach((e1, i)=>arr2.forEach(e2=>{
        if (e1.length > 1 && e2.length){
          result = this.compare(e1,e2);
        } else {
          result = e1 === e2;
        }
      })
    );

    return result
  }

  saveChanges() {
    console.log('SAVE');
  }
}
