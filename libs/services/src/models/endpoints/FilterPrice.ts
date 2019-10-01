export namespace FilterPriceModel {

  export interface FilterPrice {
    createdAt: string,
    updatedAt: string,
    id: number,
    typeLabel: number,
    outlet: boolean,
    impress: boolean,
    discount: boolean,
    tariffFuture: boolean,
    percent: number,
    percentOutlet: number,
    totalPrice: string,
    priceOriginal: string,
    priceDiscount: string,
    priceDiscountOutlet: string,
    activeTill: string,
    activeFrom: string,
    tariffName: string,
    numRange: number,
    hash: string,
    status: number,
    enabled: boolean,
  }
}
