import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PickingParametrizationProvider} from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import {Events} from "@ionic/angular";
import {UserTimeModel} from "@suite/services";

@Component({
  selector: 'table-employees',
  templateUrl: './table-employees.component.html',
  styleUrls: ['./table-employees.component.scss']
})
export class TableEmployeesComponent implements OnInit {

  private EMPLOYEES_LOADED = "employees-loaded";

  @Output() changeEmployee = new EventEmitter();

  listEmployees: UserTimeModel.ListUsersRegisterTimeActiveInactive = {usersActive: [], usersInactive: []};
  employeesSelection: any = {};
  listEmployeesSelected: number[] = [];

  constructor(
    private events: Events,
    private pickingParametrizationProvider: PickingParametrizationProvider
  ) {}

  ngOnInit() {
    this.events.subscribe(this.EMPLOYEES_LOADED, () => {
      this.listEmployees = this.pickingParametrizationProvider.listEmployees;
      for (let employee of this.listEmployees.usersActive) {
        this.employeesSelection[employee.id] = true;
      }
      for (let employee of this.listEmployees.usersInactive) {
        this.employeesSelection[employee.id] = false;
      }
      this.selectEmployee();
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.EMPLOYEES_LOADED);
  }

  selectEmployee() {
    this.listEmployeesSelected = [];
    for (let iEmployee in this.employeesSelection) {
      if (this.employeesSelection[iEmployee]) {
        this.listEmployeesSelected.push(parseInt(iEmployee));
      }
    }
    this.changeEmployee.next(this.listEmployeesSelected);
  }

}
