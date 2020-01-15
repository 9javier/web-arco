import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {Router} from "@angular/router";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {ItemReferencesProvider} from "../../../providers/item-references/item-references.provider";
import {PriceService} from "@suite/services";

declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class TariffPricesScanditService {

  lastBarcode = null;

  constructor(
    private router: Router,
    private scanditProvider: ScanditProvider,
    private itemReferencesProvider: ItemReferencesProvider,
    private priceService: PriceService
  ) {}

  public init() {
    ScanditMatrixSimple.initTariffPrices(
      async (response: ScanditModel.Response) => {
        let barcode = response.barcode.data;
        if (barcode != this.lastBarcode) {
          this.lastBarcode = barcode;
          if (this.itemReferencesProvider.checkCodeValue(barcode) == this.itemReferencesProvider.codeValue.PRODUCT) {
            let filterPrice = await this.priceService.getByReference({
              warehouseId: warehouseId,
              tariffId: tariffId,
              modelId: barcode.substr(2, 6),
              numRange: numRange
            });
          }
          // utilizar el código para comprobar si está impreso
          // si ya está impreso mostrar toast indicándolo
          // si no está impreso imprimirlo
          // confirmar impresión
          // marcarlo como impreso
          // mostrar toast indicándolo
        }
      },
      'Escáner Tarifas',
      this.scanditProvider.colorsHeader.background.color,
      this.scanditProvider.colorsHeader.color.color
    );
  }

}
