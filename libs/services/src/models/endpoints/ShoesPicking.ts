import {ProductModel} from "@suite/services";

export namespace ShoesPickingModel {
  export interface Inventory {
    createdAt: string;
    updatedAt: string;
    id: number;
    packingId: number;
    packingType: string;
    status: number;
    rack: {
      id: number;
      enabled: boolean;
      hall: number;
      columns: number;
      rows: number;
    },
    container: {
      id: number;
      row: number;
      column: number;
      enabled: boolean;
      reference: string;
      lock: boolean;
      on_right_side: boolean;
      items: number;
    }
  }

  export interface WorkwaveOrder {
    createdAt: string;
    updatedAt: string;
    id: number;
    typePicking: number;
    typeGeneration: number;
    status: number;
    packingId: number;
    packingType: string;
  }

  export interface ShoesPicking {
    createdAt: string;
    updatedAt: string;
    id: number;
    status: number;
    typeSelectionCriteria: number;
    typeGeneration: number;
    typePreparationLine: number;
    workWaveOrder: WorkwaveOrder;
    inventory: Inventory;
    product: ProductModel.ProductPicking;
  }

  export interface ResponseListyByPicking {
    data: ShoesPicking[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ErrorResponse {
    errors: string;
    message: string;
    code: number;
  }
}
