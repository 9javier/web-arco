import { WarehouseModel } from '@suite/services';
import { Request } from './request';

export namespace RackModel {
    export interface Rack {
      id: number;
      createdAt: string,
      updatedAt: string,
      name: string;
      reference: string;
      warehouse:WarehouseModel.Warehouse;
      belongWarehouse:WarehouseModel.Warehouse;
    }

  export interface ResponseIndex {
    data: Rack[];
  }

  export interface SingleRackResponse extends Request.Success{
    data:Rack
  }

  export interface ResponseDestroy {
    data: number;
    message: string;
    code: number;
  }
}
