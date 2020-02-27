import { Request } from './request';
import { WarehouseModel } from './Warehouse';

export namespace UserTimeModel{

  export interface UserTimeRequest{
      type:number;
  }

  export interface UserRegisterTime {
    id: number;
    inputDate: string;
    outputDate: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface ListUsersRegisterTimeActiveInactive {
    usersActive: Array<User>,
    usersInactive: Array<User>
  }

  export interface PickingInfo {
    quantityShoes: number,
    temporary: boolean
  }

  export interface PickingsUser {
    id: number,
    name: string,
    pickings: PickingInfo[]
  }

  export interface ListPickingsUsersResponse extends Request.Success {
    data: PickingsUser[]
  }

  export interface ListUsersRegisterResponse extends Request.Success {
    data: ListUsersRegisterTimeActiveInactive
  }

  export interface UserRegisterTimeResponse extends Request.Success {
    data: UserRegisterTime
  }

  export interface UserTimeResponse extends Request.Success{
      data:UserTime
  }

  export interface User {
    id: number,
    email: string,
    name: string,
    address: string,
    phone: string,
    employedId: number,
    hasWarehouse: boolean,
    permits: Array<any>,
    warehouse: WarehouseModel.Warehouse,
    start_time?: string
  }

  export interface UserTime{
      user: User,
      inputDate: string;
      outputDate: string;
      createdAt: string;
      updatedAt: string;
      id: number;
  }

}
