import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserModel } from '@suite/services';

@Component({
  selector: 'suite-add-role-assignment',
  templateUrl: './add-role-assignment.component.html',
  styleUrls: ['./add-role-assignment.component.scss'],
})
export class AddRoleAssignmentComponent implements OnInit {

  tPermissions: UserModel.Permission[];
  tRoles: UserModel.Role[];

  users: {
    id: number,
    name: string,
    warehouses: {
      id: number,
      name: string
    }[]
  }[] = [];

  warehouses: {
    id: number,
    name: string
  }[] = [];

  roles: {
    id: number,
    name: string,
    isChecked: boolean
  }[] = [];

  form: {
    userId: number,
    warehouseId: number,
    roles: {
      id: number,
      name: string,
      isChecked: boolean
    }[]
  } = {
    userId: 0,
    warehouseId: 0,
    roles: []
  };

  selectedUserId: number;
  selectedWarehouseId: number;

  constructor(
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    for(let permission of this.tPermissions){
      let included: boolean = false;
      for(let user of this.users){
        if(user.id == permission.user.id){
          included = true;
          break;
        }
      }
      if(!included){
        this.users.push({
          id: permission.user.id,
          name: permission.user.name,
          warehouses: []
        })
      }
      included = false;
      for(let warehouse of this.warehouses){
        if(warehouse.id == permission.warehouse.id){
          included = true;
          break;
        }
      }
      if(!included){
        this.warehouses.push({
          id: permission.warehouse.id,
          name: permission.warehouse.name
        })
      }
    }
    for (let user of this.users) {
      user.warehouses = JSON.parse(JSON.stringify(this.warehouses));
    }
    for(let user of this.users){
      for(let i = 0; i < user.warehouses.length; i++){
        for(let permission of this.tPermissions){
          if(permission.user.id == user.id && permission.warehouse.id == user.warehouses[i].id){
             delete user.warehouses[i];
            break;
          }
        }
      }
      user.warehouses = user.warehouses.filter(function( warehouse ) {
        return warehouse !== undefined;
      });
    }
    for(let i = 0; i < this.users.length; i++){
      if(this.users[i].warehouses.length == 0){
        delete this.users[i];
      }
    }
    this.users = this.users.filter(function( user ) {
      return user !== undefined;
    });
    if(this.users.length == 0){
      setTimeout(async () => await this.close(), 100);
    }else{
      for(let role of this.tRoles){
        this.roles.push({
          id: role.id,
          name: role.name,
          isChecked: false
        })
      }
      this.selectedUserId = this.users[0].id;
      this.selectedWarehouseId = this.users[0].warehouses[0].id;
      this.form = {
        userId: this.users[0].id,
        warehouseId: this.users[0].warehouses[0].id,
        roles: this.roles
      };
    }
  }

  uncheckRoles(){
    for(let role of this.form.roles) {
      role.isChecked = false;
    }
  }

  changeUser(userId: number) {
    this.selectedUserId = userId;
    this.form.userId = this.selectedUserId;
    this.selectedWarehouseId = this.getSelectedUserWarehouses()[0].id;
    this.form.warehouseId = this.selectedWarehouseId;
    this.uncheckRoles();
  }

  changeWarehouse(warehouseId: number) {
    this.selectedWarehouseId = warehouseId;
    this.form.warehouseId = warehouseId;
    this.uncheckRoles();
  }

  changeRole(roleId: number){
    for(let role of this.form.roles){
      if(role.id == roleId){
        role.isChecked = !role.isChecked;
      }
    }
  }

  getSelectedUserWarehouses(){
    for(let user of this.users){
      if(user.id == this.selectedUserId){
        return user.warehouses;
      }
    }
    return [];
  }

  noRolesChecked(): boolean {
    for(let role of this.form.roles){
      if(role.isChecked){
        return false;
      }
    }
    return true;
  }

  async close() {
    await this.modalController.dismiss();
  }

  async submit() {
    await this.modalController.dismiss(this.form);
  }

}
