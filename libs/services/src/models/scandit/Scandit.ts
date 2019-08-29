export namespace ScanditModel {

  export interface Response {
    result: boolean,
    barcode: Barcode
  }

  export interface ResponseSimple extends Response {
    action?: ActionsSimple
  }

  export interface ResponsePickingStores extends Response {
    action?: ActionsPickingStores,
    filters: {
      sort: Filters[],
      model: Filters[],
      brand: Filters[],
      size: Filters[],
      color: Filters[]
    }
  }

  export interface ResponsePrintTags extends Response {
    action: ActionsPrintTags,
    type_tags?: 1|2,
    size_selected?: number
  }

  export interface ResponseProductInfo extends Response {
    action?: string
  }

  export interface ResponseSwitchToIonic extends Response {
    action?: string
  }

  interface Filters {
    id: number,
    name: string,
    type_sort?: string
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
    filters = 'filters'
  }

  enum ActionsPrintTags {
    change_type = 'change_tag_type',
    select_size = 'select_size'
  }

}
