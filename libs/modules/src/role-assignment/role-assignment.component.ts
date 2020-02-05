import { Component, OnInit } from '@angular/core';
import { IntermediaryService, UserModel, UsersService } from '@suite/services';
import { ModalController, PopoverController } from '@ionic/angular';
import { AddRoleAssignmentComponent } from './add-role-assignment/add-role-assignment.component';
import { FiltersRoleAssignmentComponent } from './filters-role-assignment/filters-role-assignment.component';

@Component({
  selector: 'suite-role-assignment',
  templateUrl: './role-assignment.component.html',
  styleUrls: ['./role-assignment.component.scss'],
})

export class RoleAssignmentComponent implements OnInit {

  DEFAULT_WAREHOUSE: number = 3;
  originalPermissions: string;
  modalPermissions: UserModel.Permission[];
  tablePermissions: UserModel.Permission[];
  tableRoles: UserModel.Role[];
  tableColumns: string[];
  filters: UserModel.Filters = {
    users: [],
    warehouses: [this.DEFAULT_WAREHOUSE]
  };
  thereAreChanges: boolean;
  filterOptions: UserModel.FilterOption[];

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
    this.thereAreChanges = false;
    await this.intermediaryService.dismissLoading();
  }

  async resetFilters(){
    await this.intermediaryService.presentLoading('Cargando...');
    this.filters.users = [];
    this.filters.warehouses = [this.DEFAULT_WAREHOUSE];
    await this.getData();
    this.thereAreChanges = false;
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
    await this.getModalPermissions();
    const modal = await this.modalController.create({
        component: AddRoleAssignmentComponent,
        componentProps: {
          tPermissions: this.modalPermissions,
          tRoles: this.tableRoles
        }
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

  async getModalPermissions(){
    await this.usersService.getList({users: [], warehouses: []}).then(response => {
      const list: UserModel.List = response.data;
      this.modalPermissions = list.permissions;
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
