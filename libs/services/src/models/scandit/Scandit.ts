export namespace ScanditModel {

  export interface ResponsePickingStores {
    result: boolean,
    action?: Actions,
    barcode: Barcode
  }

  interface Barcode {
    data: string,
    id: number
  }

  enum Actions {
    init_picking = 'matrix_simple',
    finish_picking = 'matrix_simple_finish_picking'
  }

}
