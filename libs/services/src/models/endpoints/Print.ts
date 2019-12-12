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
        updatedAt?: string,
        lifestyle?: {
          avelonId?: string,
          createdAt?: string,
          datasetHash?: string,
          groupNumber?: string,
          id?: number,
          reference?: string,
          updatedAt?: string
        },
        category?: {
          avelonId?: string,
          createdAt?: string,
          datasetHash?: string,
          groupNumber?: string,
          id?: number,
          reference?: string,
          updatedAt?: string
        },
        detailColor?: string
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
    text?: string[];
    product?: Product;
    price?:{
      id?:number,
      percent?: number,
      percentOutlet?: number,
      totalPrice?: number,
      priceOriginal?: number,
      priceDiscount?: number,
      priceDiscountOutlet?: number,
      numRange?: number,
      valueRange?: string,
      typeLabel?:number;
    };
    type?: number;
  }

  export interface ProductSizeRange {
    reference: string,
    sizeRange: number[]
  }

  export enum LabelTypes {
    LABEL_BARCODE_TEXT = 0,
    LABEL_INFO_PRODUCT = 1,
    LABEL_PRICE_WITHOUT_TARIF = 2,
    LABEL_PRICE_WITHOUT_TARIF_OUTLET = 3,
    LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT = 4,
    LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT_OUTLET = 5,
    LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT = 6,
    LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT_OUTLET = 7,
    LABEL_PRICE_WITHOUT_TARIF_MODUL = 8
  };
}
