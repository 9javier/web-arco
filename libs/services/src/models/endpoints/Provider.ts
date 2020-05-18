import {BrandModel} from "./Brand";
import Brand = BrandModel.Brand;

export namespace ProviderModel{

  export interface Provider {
    id: number,
    name: string,
    hash: string,
    avelonId: number,
    brands?: Brand[]
  }

}
