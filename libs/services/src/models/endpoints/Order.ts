import {WarehouseModel} from "@suite/services";
import Warehouse = WarehouseModel.Warehouse;
import {EmployeeModel} from "./Employee";
import Employee = EmployeeModel.Employee;

export namespace OrderModel {

  export interface Order {
    createdAt: string,
    updatedAt: string,
    id: number,
    requestId : number,
    requestDateTime: string,
    employee: Employee,
    originShop: Warehouse,
    destinyShop: Warehouse,
    hash: string
  }

}
