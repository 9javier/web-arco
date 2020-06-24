import {BrandModel} from "./Brand";
import {PhotoModel} from "./Photo";
import {SeasonModel} from "./Season";
import {FamilyModel} from "./Family";
import {LifestyleModel} from "./Lifestyle";
import {ColorModel} from "./Color";

export namespace ModelModel {
  export interface Model{
    id?: number,
    reference: string,
    color?: ColorModel.Color,
    name?: string,
    createdAt?: string,
    updatedAt?: string,
    hash?: string,
    avelonInternalBrandId?: number,
    brand?: BrandModel.Brand,
    photos?: Array<PhotoModel.Photo>,
    domainSize?: any
    has_photos?: boolean
    season?: SeasonModel.Season,
    family?: FamilyModel.Family,
    lifestyle?: LifestyleModel.Lifestyle
  }

  export interface ModelT {
    model?,
    groupOfSizes?:string,
    quantityGroup?: number,
    quantitySuccess?: boolean,
    note?: string,
    status?
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
