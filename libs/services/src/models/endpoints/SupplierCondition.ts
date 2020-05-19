import {ProviderModel} from "./Provider";
import {BrandModel} from "./Brand";
import Provider = ProviderModel.Provider;
import Brand = BrandModel.Brand;

export namespace SupplierConditionModel {

  export interface SupplierCondition {
    id: number,
    noClaim: boolean,
    contact: string,
    observations: string,
    provider?: Provider,
    brand?: Brand,
    showObs?: boolean
  }

}
