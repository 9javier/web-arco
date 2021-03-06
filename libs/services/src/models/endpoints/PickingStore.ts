import {StoresLineRequestsModel} from "./StoresLineRequests";
import {ModelModel, SizeModel, WarehouseModel} from "@suite/services";
import {HttpRequestModel} from "./HttpRequest";
import {DeliveryRequestModel} from "./DeliveryRequest";
import Model = ModelModel.Model;
import Size = SizeModel.Size;
import DeliveryRequest = DeliveryRequestModel.DeliveryRequest;
import {LineRequestModel} from "./LineRequest";
import LineRequest = LineRequestModel.LineRequest;

export namespace PickingStoreModel {

  export interface ListStoresIds {
    warehouseIds: number[]
  }

  export interface PostPacking {
    packingReferences: string[]
  }

  export interface ProductReference {
    reference: string
  }

  export interface SendProcess {
    productReference: string,
    storeOnline?: boolean
  }

  export interface ListItem {
    createdAt: string,
    updatedAt: string,
    id: number,
    reference: string,
    status: number,
    model: Model,
    size: Size,
    selected: boolean,
    shippingMode?: number
  }

  export interface ChangeStatus {
    status: 1|2|3,
    warehouseIds: number[],
    requestIds: number[],
    packing?: boolean
  }

  export interface InitiatedPicking {
    status: 1|2|3,
    destinationWarehouses: WarehouseModel.Warehouse[],
    linesPending: ResponseDataLineRequestsPending
  }

  export interface ResponseInitiated extends HttpRequestModel.Response{
    data: InitiatedPicking;
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseLineRequests extends HttpRequestModel.Response {
    data: StoresLineRequestsModel.StoresLineRequests[];
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseOrderRequests extends HttpRequestModel.Response {
    data: StoresLineRequestsModel.StoresOrderRequests[];
    message: string;
    code: number;
    errors: any;
  }

  export interface StoreOnlineRequestsResponse extends HttpRequestModel.Response {
    data: Array<LineRequest | DeliveryRequest>;
    message: string;
    code: number;
    errors: any;
  }

  export interface Pagination {
    page: number;
    limit: number;
    totalResults: number;
  }

  interface FiltersSortTypes {
    type: number,
    order: string
  }

  export interface ParamsFiltered {
    models: number[],
    colors: number[],
    sizes: string[],
    brands: number[],
    orderbys: FiltersSortTypes[],
    toAssociate?: boolean
  }

  export interface FilterObj {
    id: number,
    name: string,
    reference?: string
  }

  export interface Filters {
    brands?: FilterObj[],
    colors?: FilterObj[],
    models?: FilterObj[],
    ordertypes?: FilterObj[],
    sizes?: FilterObj[],
    types?: FilterObj[]
  }

  export interface ResponseDataLineRequestsPending {
    results: StoresLineRequestsModel.LineRequests[];
    pagination: Pagination,
    filters: Filters
  }


  export interface ResponseDataLineRequestsFiltered {
    pending: StoresLineRequestsModel.LineRequests[],
    processed: StoresLineRequestsModel.LineRequests[],
    filters: Filters
  }

  export interface ResponseLineRequestsPending {
    data: ResponseDataLineRequestsPending;
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponsePostPacking extends HttpRequestModel.Response {
    data: any;
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseLineRequestsFiltered extends HttpRequestModel.Response {
    data: ResponseDataLineRequestsFiltered,
    message: string,
    code: number,
    errors: any
  }

  export interface RejectionReasons {
    createdAt: string,
    updatedAt: string,
    id: number,
    reference: number,
    name: string,
    position: number,
    visible: boolean,
    isHeadoffice: boolean,
    isPos: boolean
  }

  export interface ResponseLoadRejectionReasons extends HttpRequestModel.Response {
    data: Array<RejectionReasons>
  }

  export interface ParamsRejectRequest {
    reference: string,
    reasonRejectionId: number,
    filters: ParamsFiltered,
    storeOnline?: boolean
  }

  export interface RejectRequest {
    pickingStoreLinesRequestReject: any,
    linesRequestFiltered: ResponseDataLineRequestsFiltered
  }

  export interface ResponseRejectRequest extends HttpRequestModel.Response {
    data: RejectRequest
  }

  export interface ParamsLineRequestDisassociate {
    productReference: string,
    filters: ParamsFiltered
  }

  export interface ResponseLineRequestDisassociate extends HttpRequestModel.Response {
    data: ResponseDataLineRequestsFiltered
  }

  export interface ResponseSendProcess extends HttpRequestModel.Response {
    data: (DeliveryRequest | LineRequest);
    message: string;
    code: number;
    errors: any;
  }

  export interface ResponseChangeStatus extends HttpRequestModel.Response {
    data: any;
    message: string;
    code: number;
    errors: any;
  }

  export interface ParamsVentilate {
    withSorter: boolean,
    needNotifyAvelon: boolean,
    paramsCreateInventory: {
      productReference?: string,
      containerReference?: string,
      packingReference?: string,
      warehouseId?: number,
      force?: boolean,
      avoidAvelonMovement?: boolean,
      locateOutRack?: boolean
    }
  }
  export interface ResponseVentilate extends HttpRequestModel.Response {
    data: any
  }

  export interface ErrorResponse {
    errors: string;
    message: string;
    code: number;
  }

}
