export namespace ColorModel {

  export interface Color{
    createdAt: string,
    updatedAt: string,
    id: number,
    avelonId: (string | number),
    datasetHash: string,
    name: string,
    colorHex?: any,
    description: string
  }

}
