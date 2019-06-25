export namespace PrintModel {
  export interface Product {
    container?: {
      column?: number,
      enabled?: boolean,
      id?: number,
      items?: number,
      lock?: boolean,
      on_right_side?: boolean,
      rack?: {
        columns?: number,
        enabled?: boolean,
        hall?: number,
        id?: number,
        rows?: number
      },
      reference?: string,
      row?: number
    },
    createdAt?: string,
    id?: number,
    packingId?: number,
    packingType?: number,
    productShoeUnit: {
      id?: number,
      initialWarehouseReference?: string,
      manufacturer?: {
        avelonId?: number,
        id?: number,
        name?: string
      },
      model: {
        color?: {
          avelonId?: string,
          colorHex?: string,
          createdAt?: string,
          datasetHash?: string,
          description?: string,
          id?: number,
          name?: string,
          updatedAt?: string
        },
        createdAt?: string,
        datasetHash?: string,
        hash?: string,
        id?: number,
        name?: string,
        reference?: string,
        season?: {
          avelonId?: string,
          id?: number,
          name?: string
        },
        updatedAt?: string
      },
      reference?: string,
      size?: {
        createdAt?: string,
        datasetHash?: string,
        description?: string,
        id?: number,
        name?: string,
        number?: string,
        reference?: string,
        updatedAt?: string
      }
    },
    status?: number,
    updatedAt?: string,
    warehouse?: {
      description?: string,
      has_racks?: boolean,
      id?: number,
      is_main?: boolean,
      is_store?: boolean,
      name?: string,
      reference?: string
    }
  }

  export interface Print {
    text?: string;
    product?: Product;
    price?:{
      percent?: number,
      percentOutlet?: number,
      totalPrice?: number,
      priceOriginal?: number,
      priceDiscount?: number,
      priceDiscountOutlet?: number,
      numRange?: number,
      typeLabel?:number;
    };
    type?: number;
  }

  export interface ProductSizeRange {
    reference: string,
    sizeRange: number[]
  }
}
