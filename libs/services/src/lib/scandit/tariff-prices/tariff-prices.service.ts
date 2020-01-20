import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {Router} from "@angular/router";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {ItemReferencesProvider} from "../../../providers/item-references/item-references.provider";
import {PriceModel, PriceService} from "@suite/services";
import {PrinterService} from "../../printer/printer.service";

declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class TariffPricesScanditService {

  warehouseId: number;
  tariffId: number;
  lastBarcode: string = null;
  priceOptions: PriceModel.PriceByModelTariff[];

  constructor(
    private router: Router,
    private scanditProvider: ScanditProvider,
    private itemReferencesProvider: ItemReferencesProvider,
    private priceService: PriceService,
    private printerService: PrinterService
  ) {}

  public init(warehouseId: number, tariffId: number) {
    this.warehouseId = warehouseId;
    this.tariffId = tariffId;
    // this.checkAndPrint({result: true, barcode:{data: '000834751400178907', id: 1}});
    // this.checkAndPrint({result: true, barcode:{data: '083475', id: 1}});
    ScanditMatrixSimple.initTariffPrices(
      response => {
        if(response.barcode != undefined) this.checkAndPrint(response);
        else if(response.size_selected != undefined) this.print(this.priceOptions[response.size_selected]);
        else if(response.button != undefined) this.buttonClick();
      },
      'Tarifa '+this.tariffId,
      this.scanditProvider.colorsHeader.background.color,
      this.scanditProvider.colorsHeader.color.color
    );
  }

  checkAndPrint(response: ScanditModel.Response) {
    console.log('Ejecutando checkAndPrint()');
    if (response.barcode.data != this.lastBarcode) {
      let barcode = response.barcode.data;
      console.log('Código escaneado:',barcode);
      this.lastBarcode = barcode;
      if (this.itemReferencesProvider.checkCodeValue(barcode) == this.itemReferencesProvider.codeValue.PRODUCT) {
        let reference: PriceModel.ProductsReferences = {
          references: [barcode],
          tariffId: this.tariffId
        };
        this.priceService.postPricesByProductsReferences(reference).then(response => {
          let price: PriceModel.PriceByModelTariff = response.data[0];
          this.print(price);
        });
      }else if(this.itemReferencesProvider.checkCodeValue(barcode) == this.itemReferencesProvider.codeValue.PRODUCT_MODEL){
        this.priceService.postPricesByModel(barcode, this.tariffId).then(response=>{
          let prices: PriceModel.PriceByModelTariff[] = response.data;
          console.log('prices of model:',prices);
          switch (prices.length) {
            case 0:
              this.print(null);
              break;
            case 1:
              this.print(prices[0]);
              break;
            default:
              let sizeRanges: PriceModel.SizeRange[] = [];
              for(let iPrice of prices){
                sizeRanges.push({rangesNumbers: {
                    sizeRangeNumberMax: iPrice.rangesNumbers.sizeRangeNumberMax,
                    sizeRangeNumberMin: iPrice.rangesNumbers.sizeRangeNumberMin
                  }});
              }
              this.priceOptions = prices;
              ScanditMatrixSimple.showAlertSelectSizeToPrint('Selecciona la talla:', sizeRanges);
          }
        });
      }
    }
  }

  print(price: PriceModel.PriceByModelTariff){
    console.log('Ejecutando print()');
    console.log('price to print:',price);
    let priceData: String[] = [];
    if(price != null) {
      priceData[1] = price.model.reference;
      priceData[2] = price.model.brand.name;
      priceData[3] = price.model.lifestyle.name;
      priceData[5] = price.priceDiscountOutlet;
      switch (price.status) {
        case 1:
          this.printerService.printTagPriceUsingPrice([price]);
          priceData[0] = 'Artículo impreso con éxito';
          priceData[4] = 'Nuevo';
          break;
        case 2:
          this.printerService.printTagPriceUsingPrice([price]);
          priceData[0] = 'Artículo impreso con éxito';
          priceData[4] = 'Actualizado';
          break;
        case 3:
        case 7:
          priceData[0] = 'La tarifa no está vigente para este artículo, ¿desea imprimir el precio de la tarifa vigente?';
          priceData[4] = 'Eliminado';
          break;
        case 4:
          priceData[0] = 'Este artículo ya está impreso, ¿desea volver a imprimirlo?';
          priceData[4] = 'Impreso';
          break;
        default:
          priceData[0] = 'La tarifa no está vigente para este artículo, ¿desea imprimir el precio de la tarifa vigente?';
          priceData[4] = 'Desconocido';
      }
    }else{
     priceData[0] = 'Error: no hay precios asociados con ese modelo.';
    }
    console.log('priceData:',priceData);
    ScanditMatrixSimple.loadPriceInfo(null, priceData);
  }

  buttonClick(){

  }

}
