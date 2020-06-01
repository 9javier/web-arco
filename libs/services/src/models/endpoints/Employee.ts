export namespace EmployeeModel {

  export interface Employee {
    id: number,
    name: string,
    surname: string,
    reference: number
  }

  export interface EmployeeReplenishment {
    createdAt: string,
    updatedAt: string,
    id: number,
    reference: number,
    name: string,
    surname1: string,
    surname2: string,
    province: string,
    replenishment: boolean,
    changed?: boolean
  }

}
