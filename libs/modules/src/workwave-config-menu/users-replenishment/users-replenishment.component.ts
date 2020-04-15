import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {EmployeeModel} from "../../../../services/src/models/endpoints/Employee";
import EmployeeReplenishment = EmployeeModel.EmployeeReplenishment;

@Component({
  selector: 'suite-users-replenishment',
  templateUrl: './users-replenishment.component.html',
  styleUrls: ['./users-replenishment.component.scss'],
})
export class UsersReplenishmentComponent implements OnInit {

  employees: EmployeeReplenishment[];

  constructor(
    private modalController: ModalController
  ) {}

  ngOnInit() {
    for(let employee of this.employees){
      employee.changed = false;
    }
  }

  async close() {
    await this.modalController.dismiss();
  }

  checkChanges(): boolean {
    return this.employees.filter(employee => employee.changed).length == 0;
  }

  async submit() {
    await this.modalController.dismiss(this.employees.filter(employee => employee.changed));
  }

}
