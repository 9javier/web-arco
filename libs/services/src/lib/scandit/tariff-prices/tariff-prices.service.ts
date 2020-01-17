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
    // this.checkAndPrint({result: true, barcode:{data: '081088', id: 1}});
    ScanditMatrixSimple.initTariffPrices(
      response => {
        if(response.barcode != undefined) this.checkAndPrint(response);
        else if(response.size_selected != undefined) this.selectSize(response);
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
          console.log('price:', price);
          this.print(price);
        });
      }else if(this.itemReferencesProvider.checkCodeValue(barcode) == this.itemReferencesProvider.codeValue.PRODUCT_MODEL){
        this.priceService.postPricesByModel(barcode, this.tariffId).then(response=>{
          let prices: PriceModel.PriceByModelTariff[] = response.data;
          console.log('prices:',prices);
          if(prices.length == 1){
            this.print(prices[0]);
          }else{
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

  selectSize(response){
    console.log('Ejecutando printModel()');
    console.log('size_selected:', response.size_selected);
    this.print(this.priceOptions[response.size_selected]);
  }

  print(price: PriceModel.PriceByModelTariff){
    console.log('Ejecutando print()');
    console.log('price:',price);
    switch(price.status){
      case 1:
      case 2:
        this.printerService.printTagPriceUsingPrice([price]);
        console.log('Artículo impreso con éxito');
        break;
      case 4:
        console.log('Este artículo ya está impreso, ¿desea volver a imprimirlo?');
        break;
      default:
        console.log('La tarifa no está vigente para este artículo, ¿desea imprimir el precio de la tarifa vigente?');
    }
  }

}
