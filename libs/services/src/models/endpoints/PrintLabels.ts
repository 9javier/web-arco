import { ProductModel, WarehouseModel } from '@suite/services';

export namespace PrintLabelsModel {
 
   export interface AlertsTable{
    id?: number;
    name?:string,
    barcode:string,
    invoiceDateTime:string,
    typeError:number
  }
}
