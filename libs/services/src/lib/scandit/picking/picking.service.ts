import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {PickingProvider} from "../../../providers/picking/picking.provider";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class PickingScanditService {

  constructor(
    private scanditProvider: ScanditProvider,
    private pickingProvider: PickingProvider
  ) {}

  async picking() {
    let listProductsToStorePickings = this.pickingProvider.listProductsToStorePickings;
    ScanditMatrixSimple.initPickingStores((response) => {
      if (response.result) {
        if (response.action == 'matrix_simple') {
          ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings);
        }
      }
    }, 'Picking', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color);
  }

}
