import {HttpRequestModel} from "./HttpRequest";
import {UserModel} from "@suite/services";
import {CarrierModel} from "./Carrier";

export namespace AuditsModel {

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
