export namespace ActionToolbarModel {

  export interface ActionToolbar {
    icon: string,
    label: string,
    action: () => void
  }
}
