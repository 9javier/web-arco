export namespace AppFiltersModel {

  export interface ProductsReceived {
    models: any,
    colors: any,
    sizes: any,
    dates: any,
    lifestyles: any,
    families: any,
    ordertypes: any
  }

  export interface ParamsProductsReceived {
    packingId?: number
  }

  export interface ResponseProductsReceived {
    data: ProductsReceived
  }
}
