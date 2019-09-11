import {BrandModel} from "./Brand";
import {PhotoModel} from "./Photo";
import {SeasonModel} from "./Season";

export namespace ModelModel {
  export interface Model{
    id?: number,
    reference: string,
    color?: any,
    name?: string,
    createdAt?: string,
    updatedAt?: string,
    hash?: string,
    avelonInternalBrandId?: number,
    brand?: BrandModel.Brand,
    photos?: Array<PhotoModel.Photo>,
    domainSize?: any
    has_photos?: boolean
    season?: SeasonModel.Season
  }

  export interface ResponseIndex {
    data: Model[];
  }

  export interface ErrorResponseIndex {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
