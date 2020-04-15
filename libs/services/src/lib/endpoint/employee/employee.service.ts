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

  private employeesUrl: string = environment.apiBase+'/employees';

  constructor(
    private requestsProvider: RequestsProvider
  ) {}

  getAll(): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.get(this.employeesUrl);
  }

  store(employees: EmployeeReplenishment[]): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.employeesUrl, employees);
  }

}
