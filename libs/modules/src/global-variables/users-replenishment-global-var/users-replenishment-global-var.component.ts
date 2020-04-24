import {Component, OnInit, ViewChild} from '@angular/core';
import { ModalController } from '@ionic/angular';
import {EmployeeModel} from "../../../../services/src/models/endpoints/Employee";
import EmployeeReplenishment = EmployeeModel.EmployeeReplenishment;
import {EmployeeService} from "../../../../services/src/lib/endpoint/employee/employee.service";
import {MatPaginator} from "@angular/material";
import {IntermediaryService} from "@suite/services";

@Component({
  selector: 'suite-users-replenishment-global-var',
  templateUrl: './users-replenishment-global-var.component.html',
  styleUrls: ['./users-replenishment-global-var.component.scss'],
})
export class UsersReplenishmentGlobalVarComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  employees: EmployeeReplenishment[];
  showFilters: boolean;
  filters: {
    name: string,
    replenishment: string,
    order: string
  };

  constructor(
    private modalController: ModalController,
    private employeeService: EmployeeService,
    private intermediaryService: IntermediaryService
  ) {}

  ngOnInit() {
    this.showFilters = false;
    this.filters = {
      name: '',
      replenishment: 'any',
      order: 'ASC'
    };
    this.paginator.pageSizeOptions = [10, 50, 100];
    this.search();
    this.paginator.page.subscribe(() => this.search());
  }

  search(){
    this.intermediaryService.presentLoading('Cargando usuarios...').then(()=>{
      const searchParameters = {
        name: this.filters.name,
        replenishment: this.filters.replenishment,
        pagination: {
          page: this.paginator.pageIndex+1,
          limit: this.paginator.pageSize,
          sortType: this.filters.order
        }
      };
      this.employeeService.search(searchParameters).then(async response => {
        if(response.code == 200){
          this.employees = response.data[0];
          this.paginator.length = response.data[1];
          await this.intermediaryService.dismissLoading();
        }
      });
    });
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
