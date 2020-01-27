import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IntermediaryService,
  RolesService,
  RolModel,
  UserModel, UsersService,
  WarehouseModel,
  WarehousesService
} from '@suite/services';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'suite-add-role-assignment',
  templateUrl: './add-role-assignment.component.html',
  styleUrls: ['./add-role-assignment.component.scss'],
})
export class AddRoleAssignmentComponent implements OnInit {
  warehousesOriginal: WarehouseModel.Warehouse[];
  warehouses: WarehouseModel.Warehouse[];
  users: UserModel.User[];
  selectUser;
  selectWarehouse;
  form: {
    userId,
    warehouseId,
    roles: any[],
    invalid: boolean
  };
  constructor(
    private modalController:ModalController,
    private intermediaryService: IntermediaryService,
    private rolesService: RolesService,
    private warehousesService: WarehousesService,
    private usersService: UsersService,
  ) {
    this.form = {
      userId: 0,
      warehouseId: 0,
      roles: [],
      invalid: true
    };
  }

  async ngOnInit() {
    this.intermediaryService.presentLoading('Un momento ...');
    await this.getWarehouses().then(async () => {
      await this.getUsers();
    });

    this.getRoles().then(async () => {
      await this.intermediaryService.dismissLoading();
    }).catch(async () => {
      await this.intermediaryService.dismissLoading();
    });
  }

  async getUsers() {
    await this.usersService.getIndex().then(async (obsItem: Observable<HttpResponse<UserModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<UserModel.ResponseIndex>) => {
        const dataUsers = <any>res.body.data;
        this.users = dataUsers.filter((x) => x.permits.length < this.warehousesOriginal.length);
        this.selectUser = this.users[0].id;
        this.form.userId = this.selectUser;
        this.changeSelectUser();
        await this.intermediaryService.dismissLoading();
      }, async (err) => {
        console.log(err);
        await this.intermediaryService.dismissLoading();
      });
    });
  }

  changeSelectUser() {
    const user = <any>this.users.find((x) => x.id === this.selectUser);
    if (user && user.permits) {
      if (user.permits.length > 0) {
        this.warehouses = this.warehousesOriginal.filter((warehouse) => {
          const index = user.permits.findIndex((x) => x.warehouse.id === warehouse.id);
          return index === -1;
        });
      } else {
        this.warehouses = this.warehousesOriginal;
      }

      this.selectWarehouse = this.warehouses[0].id;
      this.form.warehouseId = this.selectWarehouse;
    }
  }

  async getWarehouses() {
    this.warehousesService.getIndex().then(async (obsItem: Observable<HttpResponse<WarehouseModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<WarehouseModel.ResponseIndex>) => {
        this.warehousesOriginal = res.body.data;
      }, async (err) => {
        console.log(err);
        await this.intermediaryService.dismissLoading();
      });
    });
  }

  async getRoles() {
    this.rolesService.getIndex().then(async (obsItem: Observable<HttpResponse<RolModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<RolModel.ResponseIndex>) => {
        const roles = res.body.data;
        this.form.roles = roles.map(rol => ({
          value: rol.id,
          name: rol.name,
          isChecked: false
        }));
      }, async (err) => {
        console.log(err);
        await this.intermediaryService.dismissLoading();
      });
    });
  }

  async close() {
    await this.modalController.dismiss();
  }

  async onSubmit() {
    if (this.form.invalid) {
      await this.modalController.dismiss();
    } else {
      await this.modalController.dismiss(this.form);
    }
  }

  changeCheckbox(id: number, isChecked: boolean) {
    this.form.roles.forEach((rol) => {
      if (rol.value === id) {
        rol.isChecked = !isChecked;
      }
    });

    this.form.invalid = !(this.isSelectCheckbox() && this.form.warehouseId !== 0);
  }

  changeUser(value: number) {
    this.form.userId = value;
    this.form.invalid = !(this.isSelectCheckbox() && this.form.userId !== 0 && this.form.warehouseId !== 0);
    this.changeSelectUser();
  }

  changeWarehouse(value: number) {
    this.form.warehouseId = value;
    this.form.invalid = !(this.isSelectCheckbox() && this.form.userId !== 0 && this.form.warehouseId !== 0);
  }

  isSelectCheckbox() {
    let result = false;

    this.form.roles.forEach((rol) => {
      if (rol.isChecked) {
        result = true;
      }
    });

    return result;
  }
}
