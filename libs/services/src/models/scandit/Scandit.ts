export namespace ScanditModel {

  export interface Response {
    result: boolean,
    barcode: Barcode
  }

  export interface ResponsePickingStores extends Response {
    action?: ActionsPickingStores
  }

  export interface ResponsePrintTags extends Response {
    action: ActionsPrintTags,
    type_tags?: 1|2
  }

  interface Barcode {
    data: string,
    id: number
  }

  enum ActionsPickingStores {
    init_picking = 'matrix_simple',
    finish_picking = 'matrix_simple_finish_picking'
  }

  enum ActionsPrintTags {
    change_type = 'change_tag_type'
  }

}
