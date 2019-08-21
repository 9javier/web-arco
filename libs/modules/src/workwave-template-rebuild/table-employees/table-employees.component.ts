import {Component, OnInit} from '@angular/core';
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

  listEmployees: UserTimeModel.ListUsersRegisterTimeActiveInactive = {usersActive: [], usersInactive: []};

  constructor(
    private events: Events,
    private pickingParametrizationProvider: PickingParametrizationProvider
  ) {}

  ngOnInit() {
    this.events.subscribe(this.EMPLOYEES_LOADED, () => {
      this.listEmployees = this.pickingParametrizationProvider.listEmployees;
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.EMPLOYEES_LOADED);
  }

}
