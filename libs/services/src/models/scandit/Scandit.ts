export namespace ScanditModel {

  export interface Response {
    result: boolean,
    barcode: Barcode
  }

  export interface ResponseSimple extends Response {
    action?: ActionsSimple
  }

  export interface ResponsePickingStores extends Response {
    action?: ActionsPickingStores
  }

  export interface ResponsePrintTags extends Response {
    action: ActionsPrintTags,
    type_tags?: 1|2,
    size_selected?: number
  }

  interface Barcode {
    data: string,
    id: number
  }

  enum ActionsSimple {
    init_scandit = 'matrix_simple'
  }

  enum ActionsPickingStores {
    init_picking = 'matrix_simple',
    finish_picking = 'matrix_simple_finish_picking',
    packing = 'matrix_simple_scan_packings',
  }

  enum ActionsPrintTags {
    change_type = 'change_tag_type',
    select_size = 'select_size'
  }

}
