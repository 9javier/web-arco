import { Component, OnInit } from '@angular/core';
import {
  IntermediaryService,
  RolesService,
  RolModel,
  UserModel,
  UsersService,
  WarehouseModel, WarehousesService
} from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ModalController, PopoverController } from '@ionic/angular';
import { AddRoleAssignmentComponent } from './add-role-assignment/add-role-assignment.component';
import { FiltersRoleAssignmentComponent } from './filters-role-assignment/filters-role-assignment.component';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';

@Component({
  selector: 'suite-role-assignment',
  templateUrl: './role-assignment.component.html',
  styleUrls: ['./role-assignment.component.scss'],
})

export class RoleAssignmentComponent implements OnInit {

  DEFAULT_WAREHOUSE: number = 3;
  originalPermissions: string;
  tablePermissions: UserModel.Permission[];
  tableRoles: UserModel.Role[];
  tableColumns: string[];
  filters: UserModel.Filters = {
    users: [],
    warehouses: [this.DEFAULT_WAREHOUSE]
  };
  thereAreChanges: boolean = false;
  filterOptions: UserModel.FilterOption[];

  /* CÓDIGO ANTIGUO
  title = 'Asignación de roles';
  dataSourceRoles: RolModel.Rol[];
  listToUpdate = [];
  ELEMENT_DATA: any[];
  ELEMENT_DATA_ORIGINAL: any[];
  warehouses: any[];
  users: any[];
  listUsers: Array<TagsInputOption> = [];
  listWarehouses: Array<TagsInputOption> = [];

  private rolesService: RolesService,
  private warehousesService: WarehousesService,

  //FUNCTIONS THAT ARE STARTED BY THE USER

  async ngOnInit() {
    await this.intermediaryService.presentLoading('Cargando...');
    await this.getRolesAndUsers();
    await this.getUsersOriginal(async () => {
      this.filters.warehousesSelected = [3];
      await this.applyFilter(async () => await this.intermediaryService.dismissLoading());
    });
  }

  resetFilters(){
    this.ngOnInit();
  }

  async openFilter(column: string) {
    let listItems = [];
    let title = '';
    if (column === 'user') {
      title = 'Usuario';
      listItems = this.listUsers;
    } else if (column === 'warehouse') {
      title = 'Almacén';
      listItems = this.listWarehouses;
    }

    const popover = await this.popoverController.create({
      cssClass: 'popover-filter',
      component: FiltersRoleAssignmentComponent,
      componentProps: {
        title: title,
        listItems: listItems
      }
    });

    popover.onDidDismiss().then(async (data) => {
      await this.intermediaryService.presentLoading('Cargando...');
      if (data && data.data && data.data.filters) {
        const filter = data.data.filters.filter((x) => x.checked === true);

        if (filter.length === data.data.filters.length) {
          if (column === 'user') {
            this.filters.usersSelected = [];
          } else if (column === 'warehouse') {
            this.filters.warehousesSelected = [];
          }
        } else {
          if (column === 'user') {
            this.filters.usersSelected = filter.map((x) => x.id);
          } else if (column === 'warehouse') {
            this.filters.warehousesSelected = filter.map((x) => x.id);
          }
        }

        await this.applyFilter(async () => await this.intermediaryService.dismissLoading());
      }else{
        await this.intermediaryService.dismissLoading();
      }
    });

    await popover.present();
  }

  async undoChanges() {
    await this.intermediaryService.presentLoading('Cargando...');
    await this.getRoles();
    await this.getUsers();
    await this.getWarehouses();
    await this.getUsersOriginal(async () =>{
      await this.applyFilter(async () => await this.intermediaryService.dismissLoading());
    });
  }

  async saveChanges() {
    await this.intermediaryService.presentLoading('Cargando...');
    const aux = JSON.parse(JSON.stringify(this.listToUpdate));
    this.listToUpdate = [];

    const body = [];
    aux.forEach((item) => {
      body.push(this.fillBodyEndPoint(item.userId));
    });

    this.sendDataEndPoint(body);
    await this.getUsersOriginal();
  }

  async newRole() {
    const modal = await this.modalController.create({
      component: AddRoleAssignmentComponent
    });

    modal.onDidDismiss().then(async (dataReturn) => {
      await this.intermediaryService.presentLoading('Cargando...');
      if (dataReturn.data !== undefined) {
        await this.saveAddedRole(dataReturn.data);
      }else{
        await this.intermediaryService.dismissLoading();
      }
    });

    await modal.present();
  }

  FUNCTIONS THAT ACCESS THE BACK

  async applyFilter(success?) {
    this.ELEMENT_DATA = [];
    await this.usersService.getIndexWithFilter(this.filters).then(async (obsItem: Observable<HttpResponse<UserModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<UserModel.ResponseIndex>) => {
        this.users = res.body.data;

        if (this.users && this.users.length > 0) {
          this.users.forEach((user: any) => {
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

          this.tableData = new MatTableDataSource(this.ELEMENT_DATA);
        }

        if(success) success();
      }, async (err) => {
        console.log(err);
      });
    });
  }

  async getUsers(success?) {
    this.ELEMENT_DATA = [];
    await this.usersService.getIndex().then(async (obsItem: Observable<HttpResponse<UserModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<UserModel.ResponseIndex>) => {
        this.users = res.body.data;

        if (this.users && this.users.length > 0) {
          this.users.forEach((user: any) => {
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

          this.tableData = new MatTableDataSource(this.ELEMENT_DATA);
          this.mapFilterListUsers();
        }

        if(success) success();
      }, async (err) => {
        console.log(err);
      });
    });
  }

  async getUsersOriginal(success?) {
    this.ELEMENT_DATA_ORIGINAL = [];
    await this.usersService.getIndex().then(async (obsItem: Observable<HttpResponse<UserModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<UserModel.ResponseIndex>) => {
        this.users = res.body.data;

        if (this.users && this.users.length > 0) {
          this.users.forEach((user: any) => {
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

                this.ELEMENT_DATA_ORIGINAL.push({ userId: user.id, userName: user.name, warehouseId: permit.warehouse.id, warehouseName: `${permit.warehouse.reference} - ${permit.warehouse.name}`, roles: roles});
              });
            }
          });
        }


        if(success) success();
      }, async (err) => {
        console.log(err);
      });
    });
  }

  async getRoles() {
    this.displayedColumns = ['user', 'warehouse'];
    await this.rolesService.getIndex().then(async (obsItem: Observable<HttpResponse<RolModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<RolModel.ResponseIndex>) => {
        this.dataSourceRoles = res.body.data;

        if (this.dataSourceRoles.length > 0) {
          this.dataSourceRoles.forEach((rol) => {
            this.displayedColumns.push(rol.id.toString());
          });
        }
      }, async (err) => {
        console.log(err);
      });
    });
  }

  async getWarehouses() {
    await this.warehousesService.getIndex().then(async (obsItem: Observable<HttpResponse<WarehouseModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<WarehouseModel.ResponseIndex>) => {
        this.warehouses = res.body.data;
        this.mapFilterListWarehouses();
      }, async (err) => {
        console.log(err);
      });
    });
  }

  sendDataEndPoint(body) {
    body.forEach((element) => {
      element.permits = element.permits.filter((x) => x.roles.length > 0);
    });

    this.usersService.updateWarehouseInUser(body)
      .then((data: Observable<HttpResponse<UserModel.ResponseShow>>) => {
        data.subscribe(async (res: HttpResponse<UserModel.ResponseShow>) => {
          await this.getRoles();
          await this.getUsers(async () =>{
            await this.applyFilter(async () => await this.intermediaryService.dismissLoading());
          });
          await this.getWarehouses();
        }, (err) => {
          console.log(err);
        });
      }, (err) => {
        console.log(err);
      });
  }

  OTHER FUNCTIONS

  async getRolesAndUsers(success?) {
    this.filters = {
      usersSelected: [],
      warehousesSelected: []
    };

    await this.getRoles().then(async () => {
      if(success) await this.getUsers(success);
      else await this.getUsers();
    });

    await this.getWarehouses();
  }

  async saveAddedRole(dataForm: any) {
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
    await this.getUsersOriginal();
  }

  changeCheckRol(event, element: any, i: number) {
    const dataUsers = <any>this.ELEMENT_DATA_ORIGINAL.filter((x) => x.userId === element.userId);
    const dataWarehouseUsers = dataUsers.find((x) => x.warehouseId === element.warehouseId);
    element.roles[i].checked = event.checked;

    if (JSON.stringify(element.roles) === JSON.stringify(dataWarehouseUsers.roles)) {
      this.deleteElementArray(element);
    } else {
      this.addElementArray(element);
    }
  }

  deleteElementArray(element: any) {
    if (this.listToUpdate.length > 0) {
      const index = this.listToUpdate.findIndex((x) => x.userId === element.userId);

      if (index !== -1) {
        const indexRow = this.listToUpdate[index].rows.findIndex((x) => x.warehouseId === element.warehouseId);

        if (indexRow !== -1) {
          this.listToUpdate[index].rows.splice(indexRow, 1);

          if (this.listToUpdate[index].rows.length === 0) {
            this.listToUpdate.splice(index, 1);
          }
        }
      }
    }
  }

  addElementArray(element: any) {
    const index = this.listToUpdate.findIndex((x) => x.userId === element.userId);

    if (index === -1) {
      this.listToUpdate.push({userId: element.userId, rows: [{warehouseId: element.warehouseId}]});
    } else {
      const indexRow = this.listToUpdate[index].rows.findIndex((x) => x.warehouseId === element.warehouseId);

      if (indexRow === -1) {
        this.listToUpdate[index].rows.push({warehouseId: element.warehouseId});
      }
    }
  }

  fillBodyEndPoint(userId: number) {
    const data = <any>this.ELEMENT_DATA;
    const dataOriginal = <any>this.ELEMENT_DATA_ORIGINAL;

    const permits = data.filter((x) => x.userId === userId);
    const permitsOriginal = dataOriginal.filter((x) => x.userId === userId);
    const dataWidthOutWarehouse = permitsOriginal.filter((x) => {
      return permits.findIndex((p) => p.warehouseId === x.warehouseId) === -1;
    });

    dataWidthOutWarehouse.forEach((permit) => {
      permits.push(permit);
    });

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

  mapFilterListUsers() {
    this.listUsers = this.users.map(user => {
      return {
        id: user.id,
        name: user.name,
        value: user.name,
        checked: true,
        hide: false
      };
    });
  }

  mapFilterListWarehouses() {
    this.listWarehouses = this.warehouses.map(warehouse => {
      return {
        id: warehouse.id,
        name: warehouse.reference + " - " + warehouse.name,
        value: warehouse.reference + " - " + warehouse.name,
        checked: true,
        hide: false
      };
    });
  }
  */

  constructor(
    private intermediaryService: IntermediaryService,
    private usersService: UsersService,
    private popoverController: PopoverController,
    private modalController: ModalController
  ) {}

  // USER ACTIONS

  async ngOnInit() {
    await this.intermediaryService.presentLoading('Cargando...');
    await this.getData();
    await this.intermediaryService.dismissLoading();
  }

  async resetFilters(){
    await this.intermediaryService.presentLoading('Cargando...');
    this.filters.users = [];
    this.filters.warehouses = [this.DEFAULT_WAREHOUSE];
    await this.getData();
    await this.intermediaryService.dismissLoading();
  }

  async openFilter(column: string) {
    await this.intermediaryService.presentLoading('Cargando...');
    await this.getFilterOptions(column);
    const popover = await this.popoverController.create({
      cssClass: 'popover-filter',
      component: FiltersRoleAssignmentComponent,
      componentProps: {
        title: column,
        listItems: this.filterOptions
      }
    });

    popover.onDidDismiss().then(async response => {
      if(response.data) {
        await this.intermediaryService.presentLoading('Cargando...');
        this.filterOptions = response.data.filters;
        if (column == 'Usuarios') {
          this.filters.users = [];
          for (let iOption of this.filterOptions) {
            if (iOption.checked) {
              this.filters.users.push(iOption.id);
            }
          }
        } else {
          this.filters.warehouses = [];
          for (let iOption of this.filterOptions) {
            if (iOption.checked) {
              this.filters.warehouses.push(iOption.id);
            }
          }
        }
        await this.getData();
        await this.intermediaryService.dismissLoading();
      }
    });
    await this.intermediaryService.dismissLoading();
    await popover.present();
  }

  changeRole(role: UserModel.Role, id: number) {
    let addingRole: boolean = true;
    for(let iPermission of this.tablePermissions){
      if(iPermission.id == id){
        for(let i = 0; i < iPermission.roles.length; i++){
          if(iPermission.roles[i].id == role.id){
            addingRole = false;
            iPermission.roles.splice(i, 1);
            break;
          }
        }
        if(addingRole){
          iPermission.roles.push(role);
        }
        break;
      }
    }
    this.thereAreChanges = JSON.stringify(this.tablePermissions) != this.originalPermissions;
  }

  async saveChanges() {
    await this.intermediaryService.presentLoading('Cargando...');
    await this.postData();
    this.originalPermissions = JSON.stringify(this.tablePermissions);
    this.thereAreChanges = false;
    await this.intermediaryService.dismissLoading();
  }

  async newRole() {
    const modal = await this.modalController.create({
      component: AddRoleAssignmentComponent
    });

    modal.onDidDismiss().then(async response=>{
      if (response.data) {
        await this.intermediaryService.presentLoading('Cargando...');
        const modalResponse: UserModel.ModalResponse = response.data;
        await this.postNewPermission(modalResponse);
        await this.getData();
        await this.intermediaryService.dismissLoading();
      }
    });

    await modal.present();
  }

  // BACK FUNCTIONS

  async getData() {
    this.tableColumns = ['user', 'warehouse'];
    await this.usersService.getList(this.filters).then(response => {
      const list: UserModel.List = response.data;
      this.originalPermissions = JSON.stringify(list.permissions);
      this.tablePermissions = list.permissions;
      this.tableRoles = list.list_roles;
      if (this.tableRoles.length > 0) {
        for (let role of this.tableRoles) {
          this.tableColumns.push(role.id.toString());
        }
      }
    });
  }

  async postData() {
    await this.usersService.postUpdate(this.tablePermissions);
  }

  async postNewPermission(data: UserModel.ModalResponse){
    await this.usersService.postNew(data);
  }

  async getFilterOptions(column: string) {
    const filterOptionsRequest: UserModel.FilterOptionsRequest = {
      type: {
        users: column == 'Usuarios',
        warehouses: column == 'Almacenes'
      }
    };

    await this.usersService.getFilters(filterOptionsRequest).then(response => {
      const filters: UserModel.FilterOptions = response.data;
      this.filterOptions = column == 'Usuarios' ? filters.users : filters.warehouses;
    });

    if(column == 'Usuarios'){
      for(let iOption of this.filterOptions){
        iOption.checked = this.filters.users.includes(iOption.id);
      }
    }else{
      for(let iOption of this.filterOptions){
        iOption.checked = this.filters.warehouses.includes(iOption.id);
      }
    }
  }

  // OTHER FUNCTIONS

  isFiltering(column: string): string {
    switch(column){
      case 'user':
        if(this.filters.users.length > 0){
          return 'playlist_add_check';
        }else{
          return 'reorder';
        }
      case 'warehouse':
        if(this.filters.warehouses.length > 0){
          return 'playlist_add_check';
        }else{
          return 'reorder';
        }
    }
  }

  isChecked(role: UserModel.Role, permissionRoles: UserModel.Role[]): boolean {
    for(let iRole of permissionRoles){
      if(iRole.id == role.id){
        return true;
      }
    }
    return false;
  }

}
