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
    },
    reasonId: number,
    requestReference: string,
    response: boolean,
    actionIonic?: string,
    params?: string
  }

  export interface ResponsePrintTags extends Response {
    action: ActionsPrintTags,
    type_tags?: 1|2,
    size_selected?: number,
    response: boolean,
    actionIonic?: string,
    params?: string
  }

  export interface ResponseProductInfo extends Response {
    action?: string
  }

  export interface ResponseSwitchToIonic extends Response {
    action?: string
  }

  export interface ResponseAuthMultiple extends Response {
    exit?: boolean,
    manual?: boolean
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
    filters = 'filters',
    request_reject = 'request_reject',
    products_out_of_packing = 'products_out_of_packing',
    finish = 'matrix_simple_finish'
  }

  enum ActionsPrintTags {
    change_type = 'change_tag_type',
    select_size = 'select_size',
    print_pvp_label = 'print_pvp_label'
  }

}
