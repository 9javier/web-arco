import {ProductModel, WarehouseModel} from "@suite/services";

export namespace InputSorterModel {

  export interface ParamsProductScan {
    productReference: string
  }

  export interface ProductScan extends ProductModel.Product {
    destinyWarehouse: WarehouseModel.Warehouse
  }

  export interface ResponseProductScan {
    data: ProductScan
  }
}
