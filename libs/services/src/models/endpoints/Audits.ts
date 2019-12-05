import {HttpRequestModel} from "./HttpRequest";
import {ProductModel, UserModel, WarehouseModel} from "@suite/services";
import {CarrierModel} from "./Carrier";

export namespace AuditsModel {

  export interface AuditPacking {
    createdAt: string,
    updatedAt: string,
    id: number,
    status: number,
    type: number,
    logUser: UserModel.User,
    sorterAuditPackingProducts: AuditPackingProduct[],
    packing: CarrierModel.Carrier,
    has_sorterAuditPackingProducts: boolean
  }

  export interface AuditPackingProduct {
    createdAt: string,
    updatedAt: string,
    id: number,
    hasSorter: boolean,
    incidence: boolean,
    rightAudit: boolean,
    product: ProductModel.Product
  }

  // Create new Audit
  export interface ParamsCreateAudit {
    packingReference: string,
    status: number,
    type: number
  }
  export interface CreateAudit {
    createdAt: string,
    updatedAt: string,
    id: number,
    status: number,
    type: number,
    logUser: UserModel.User,
    sorterAuditPackingProducts: [],
    packing: CarrierModel.Carrier,
    has_sorterAuditPackingProducts: boolean
  }
  export interface ResponseCreateAudit extends HttpRequestModel.Response {
    data: CreateAudit
  }

  // Check Product in Packing
  export interface ParamsCheckProductInPacking {
    packingReference: string,
    productReference: string
  }
  export interface CheckProductInPacking {

  }
  export interface ResponseCheckProductInPacking extends HttpRequestModel.Response {
    data: CheckProductInPacking
  }

  // Get products in packing for audit
  export interface GetAuditProducts {
    product: ProductModel.Product,
    audit: {
      isAudit: true,
      hasSorter: false,
      incidence: true,
      rightAudit: false
    },
    destinyProduct: WarehouseModel.Warehouse
  }
  export interface ResponseGetAuditProducts {
    data: GetAuditProducts[],
    code: number,
    message: string,
    error?: HttpRequestModel.ApiError
  }

  // Check the product in packing for audit
  export interface AuditProductInPacking {
    auditCorrect: boolean,
    product: ProductModel.Product,
    packing: CarrierModel.Carrier
  }
  export interface ResponseAuditProductInPacking {
    data: AuditProductInPacking,
    code: number,
    message: string,
    error?: HttpRequestModel.ApiError
  }
}
