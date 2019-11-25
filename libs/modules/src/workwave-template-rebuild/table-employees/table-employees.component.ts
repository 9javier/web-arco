import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PickingParametrizationProvider } from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import { Events } from "@ionic/angular";
import { UserTimeModel } from "@suite/services";
import { WorkwavesService } from 'libs/services/src/lib/endpoint/workwaves/workwaves.service';

@Component({
  selector: 'table-employees',
  templateUrl: './table-employees.component.html',
  styleUrls: ['./table-employees.component.scss']
})
export class TableEmployeesComponent implements OnInit {

  private EMPLOYEES_LOADED = "employees-loaded";

  listEmployees: UserTimeModel.ListUsersRegisterTimeActiveInactive = { usersActive: [], usersInactive: [] };
  employeesSelection: any = {};
  listEmployeesSelected: number[] = [];

  constructor(
    public events: Events,
    public pickingParametrizationProvider: PickingParametrizationProvider,
    private serviceG : WorkwavesService
  ) { }

  ngOnInit() {
    this.events.subscribe(this.EMPLOYEES_LOADED, () => {
      this.listEmployees = this.pickingParametrizationProvider.listEmployees;
      if (this.listEmployees.usersActive.length > 0 || this.listEmployees.usersInactive.length > 0) {
        for (let employee of this.listEmployees.usersActive) {
          this.employeesSelection[employee.id] = true;
        }
        for (let employee of this.listEmployees.usersInactive) {
          this.employeesSelection[employee.id] = false;
        }
      } else {
        this.employeesSelection = {};
      }
      this.selectEmployee('init');
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.EMPLOYEES_LOADED);
  }

  selectEmployee(validation) {
    this.listEmployeesSelected = [];
    for (let iEmployee in this.employeesSelection) {
      if (this.employeesSelection[iEmployee]) {
        this.listEmployeesSelected.push(parseInt(iEmployee));
      }
    }

    let aux = this.serviceG.requestUser.value;
    aux.data.user = this.listEmployeesSelected;
    aux.user = validation === 'init' ?  true : false;
    this.serviceG.requestUser.next(aux);
  }

}
