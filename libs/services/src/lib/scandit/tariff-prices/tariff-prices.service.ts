import {Injectable, Input} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {Router} from "@angular/router";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {ItemReferencesProvider} from "../../../providers/item-references/item-references.provider";
import {PriceModel, PriceService} from "@suite/services";
import {PrinterService} from "../../printer/printer.service";
import Price = PriceModel.Price;
import {LocalStorageProvider} from "../../../providers/local-storage/local-storage.provider";

declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class TariffPricesScanditService {

  warehouseId: number;
  tariffId: number;
  tariffName;
  lastBarcode: string = null;
  priceToPrint: PriceModel.PriceByModelTariff;
  priceOptions: PriceModel.PriceByModelTariff[];
  reprint: boolean;
  priceData: string[];

  constructor(
    private router: Router,
    private scanditProvider: ScanditProvider,
    private itemReferencesProvider: ItemReferencesProvider,
    private priceService: PriceService,
    private printerService: PrinterService,
    private localStorageProvider: LocalStorageProvider
  ) {}

  public init(warehouseId: number, tariffId: number) {
    this.warehouseId = warehouseId;
    this.tariffId = tariffId;
    this.tariffName = Object.values(this.localStorageProvider.get('tariffName'))[1];
    this.lastBarcode = null;
    ScanditMatrixSimple.initTariffPrices(
      response => {
        if(response.barcode != undefined && response.barcode.data) this.checkAndPrint(response.barcode.data);
        else if(response.size_selected != undefined){
          this.priceToPrint = this.priceOptions[response.size_selected];
          this.print();
        }
        else if(response.button != undefined) this.buttonClick();
      },
      'Tarifa '+this.tariffName,
      this.scanditProvider.colorsHeader.background.color,
      this.scanditProvider.colorsHeader.color.color
    );
  }

  checkAndPrint(barcode: string) {
    console.log('Ejecutando checkAndPrint()');
    console.log('Código escaneado:',barcode);
    if (barcode != this.lastBarcode) {
      this.lastBarcode = barcode;
      if (this.itemReferencesProvider.checkCodeValue(barcode) == this.itemReferencesProvider.codeValue.PRODUCT) {
        let reference: PriceModel.ProductsReferences = {
          references: [barcode],
          tariffId: this.tariffId
        };
        this.priceService.postPricesByProductsReferences(reference).then(response => {
          this.priceToPrint = response.data[0];
          this.print();
        });
      }else if(this.itemReferencesProvider.checkCodeValue(barcode) == this.itemReferencesProvider.codeValue.PRODUCT_MODEL){
        this.priceService.postPricesByModel(barcode, this.tariffId).then(response=>{
          this.priceOptions = response.data;
          console.log('prices of model:',this.priceOptions);
          switch (this.priceOptions.length) {
            case 0:
              this.priceToPrint = null;
              this.print();
              break;
            case 1:
              this.priceToPrint = response.data[0];
              this.print();
              break;
            default:
              let sizeRanges: PriceModel.SizeRange[] = [];
              for(let iPrice of this.priceOptions){
                sizeRanges.push({rangesNumbers: {
                    sizeRangeNumberMax: iPrice.rangesNumbers.sizeRangeNumberMax,
                    sizeRangeNumberMin: iPrice.rangesNumbers.sizeRangeNumberMin
                  }});
              }
              ScanditMatrixSimple.showAlertSelectSizeToPrint('Selecciona la talla:', sizeRanges);
          }
        });
      }
    }
  }

  print(){
    console.log('Ejecutando print()');
    console.log('price to print:',this.priceToPrint);
    this.priceData = [];
    if(this.priceToPrint != null) {
      this.priceData[1] = this.priceToPrint.model.reference;
      this.priceData[2] = this.priceToPrint.model.brand.name;
      this.priceData[3] = this.priceToPrint.model.lifestyle.name;
      this.priceData[5] = this.priceToPrint.priceDiscountOutlet;
      switch (this.priceToPrint.status) {
        case 1:
          this.priceData[4] = 'Nuevo';
          this.priceData[0] = 'Imprimiendo...';
          console.log('priceData:',this.priceData);
          ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
          this.printerService.printTagPriceUsingPrice([this.priceToPrint], ()=>{
            this.printerService.printNotify([this.priceToPrint.id]);
            this.priceData[0] = 'Artículo impreso con éxito.';
            console.log('priceData:',this.priceData);
            ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
          }, ()=>{
            this.priceData[0] = 'Error de conexión con la impresora.';
            console.log('priceData:',this.priceData);
            ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
          });
          break;
        case 2:
          this.priceData[4] = 'Actualizado';
          this.priceData[0] = 'Imprimiendo...';
          console.log('priceData:',this.priceData);
          ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
          this.printerService.printTagPriceUsingPrice([this.priceToPrint], ()=>{
            this.printerService.printNotify([this.priceToPrint.id]);
            this.priceData[0] = 'Artículo impreso con éxito.';
            console.log('priceData:',this.priceData);
            ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
          }, ()=>{
            this.priceData[0] = 'Error de conexión con la impresora.';
            console.log('priceData:',this.priceData);
            ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
          });
          break;
        case 3:
        case 7:
          this.priceData[4] = 'Eliminado';
          this.priceData[0] = 'La tarifa no está vigente para este artículo, ¿desea imprimir el precio de la tarifa vigente?';
          this.reprint = false;
          console.log('priceData:',this.priceData);
          ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
          break;
        case 4:
          this.priceData[4] = 'Impreso';
          this.priceData[0] = 'Este artículo ya está impreso, ¿desea volver a imprimirlo?';
          this.reprint = true;
          console.log('priceData:',this.priceData);
          ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
          break;
        default:
          this.priceData[4] = 'Desconocido';
          this.priceData[0] = 'La tarifa no está vigente para este artículo, ¿desea imprimir el precio de la tarifa vigente?';
          this.reprint = false;
          console.log('priceData:',this.priceData);
          ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
      }
    }else{
      this.priceData[0] = 'Error: no hay precios asociados al modelo con referencia '+this.lastBarcode+'.';
      console.log('priceData:',this.priceData);
      ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
    }
  }

  buttonClick(){
    console.log('Ejecutando buttonClick()');
    if(this.reprint){
      this.priceData[6] = 'button reprint';
      this.priceData[0] = 'Imprimiendo...';
      console.log('priceData:',this.priceData);
      ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
      this.printerService.printTagPriceUsingPrice([this.priceToPrint], ()=>{
        this.printerService.printNotify([this.priceToPrint.id]);
        this.priceData[0] = 'Artículo re-impreso con éxito.';
        console.log('priceData:',this.priceData);
        ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
      }, ()=>{
        this.priceData.splice(6,1);
        this.priceData[0] = 'Error de conexión con la impresora.';
        console.log('priceData:',this.priceData);
        ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
      });
    }else{
      this.priceService.postPricesByModel(this.priceToPrint.model.reference).then(response => {
        for(let iOption of response.data){
          if(iOption.status != 3 && iOption.status != 4 && iOption.numRange == this.priceToPrint.numRange){
            this.priceToPrint = iOption;
            break;
          }
        }
        this.priceData[6] = 'button invalid';
        this.priceData[0] = 'Imprimiendo...';
        console.log('priceData:',this.priceData);
        ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
        this.printerService.printTagPriceUsingPrice([this.priceToPrint], ()=>{
          this.priceData[0] = 'Artículo vigente impreso con éxito.';
          console.log('priceData:',this.priceData);
          ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
        }, ()=>{
          this.priceData.splice(6,1);
          this.priceData[0] = 'Error de conexión con la impresora.';
          console.log('priceData:',this.priceData);
          ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
        });
      });
    }
  }

}
