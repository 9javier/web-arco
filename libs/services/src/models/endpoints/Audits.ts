import {HttpRequestModel} from "./HttpRequest";
import {ProductModel, UserModel} from "@suite/services";
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
}
