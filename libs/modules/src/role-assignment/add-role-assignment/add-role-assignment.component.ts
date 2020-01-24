import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IntermediaryService, RolesService, RolModel} from '@suite/services';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'suite-add-role-assignment',
  templateUrl: './add-role-assignment.component.html',
  styleUrls: ['./add-role-assignment.component.scss'],
})
export class AddRoleAssignmentComponent implements OnInit, AfterContentInit {
  warehouses;
  form: {
    warehouseId,
    roles: any[],
    invalid: boolean
  };
  userName;
  constructor(
    private modalController:ModalController,
    private intermediaryService: IntermediaryService,
    private rolesService: RolesService,
  ) {
    this.form = {
      warehouseId: 0,
      roles: [],
      invalid: true
    }
  }

  async ngOnInit() {
    await this.getRoles();
  }

  ngAfterContentInit() {
    this.form.warehouseId = this.warehouses[0].id;
  }

  async getRoles() {
    await this.intermediaryService.presentLoading('Un momento ...');

    this.rolesService.getIndex().then(async (obsItem: Observable<HttpResponse<RolModel.ResponseIndex>>) => {
      obsItem.subscribe(async (res: HttpResponse<RolModel.ResponseIndex>) => {
        const roles = res.body.data;
        this.form.roles = roles.map(rol => ({
          value: rol.id,
          name: rol.name,
          isChecked: false
        }));

        await this.intermediaryService.dismissLoading();
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

  changeSelect(value: number) {
    this.form.warehouseId = value;
    this.form.invalid = !(this.isSelectCheckbox() && this.form.warehouseId !== 0);
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
