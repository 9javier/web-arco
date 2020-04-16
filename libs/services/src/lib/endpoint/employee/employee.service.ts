import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";
import {EmployeeModel} from "../../../models/endpoints/Employee";
import EmployeeReplenishment = EmployeeModel.EmployeeReplenishment;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private postSearchEmployeesUrl: string = environment.apiBase+'/employees/search';
  private postStoresEmployeesUrl: string = environment.apiBase+'/employees/store';

  constructor(
    private requestsProvider: RequestsProvider
  ) {}

  search(parameters): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postSearchEmployeesUrl, parameters);
  }

  store(employees: EmployeeReplenishment[]): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postStoresEmployeesUrl, employees);
  }

}
