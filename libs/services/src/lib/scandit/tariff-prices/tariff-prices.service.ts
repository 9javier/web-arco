import {Injectable, Input} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {Router} from "@angular/router";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {ItemReferencesProvider} from "../../../providers/item-references/item-references.provider";
import {PriceModel, PriceService} from "@suite/services";
import {PrinterService} from "../../printer/printer.service";
import Price = PriceModel.Price;
import {LocalStorageProvider} from "../../../providers/local-storage/local-storage.provider";
import {PrintModel} from "../../../models/endpoints/Print";
import {Events} from "@ionic/angular";
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";

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
  private readonly timeMillisToResetScannedCode: number = 1000;
  private timeoutStarted = null;

  constructor(
    private router: Router,
    private scanditProvider: ScanditProvider,
    private itemReferencesProvider: ItemReferencesProvider,
    private priceService: PriceService,
    private printerService: PrinterService,
    private localStorageProvider: LocalStorageProvider,
    private events: Events
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
  }

  public init(warehouseId: number, tariffId: number) {
    this.warehouseId = warehouseId;
    this.tariffId = tariffId;
    this.tariffName = Object.values(this.localStorageProvider.get('tariffName'))[1];
    this.lastBarcode = 'start';
    ScanditMatrixSimple.initTariffPrices(
      response => {
        if(response && response.result && response.actionIonic){
          this.executeAction(response.actionIonic, response.params);
        } else if(response.barcode != undefined && response.barcode.data) {
          this.checkAndPrint(response.barcode.data);
        } else if(response.size_selected != undefined){
          this.priceToPrint = this.priceOptions[response.size_selected];
          this.print();
        } else if(response.button != undefined) {
          this.buttonClick();
        } else if (response.action == 'print_pvp_label') {
          if (response.response) {
            this.priceToPrint.typeLabel = PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF;
          } else {
            this.priceToPrint = null;
          }
          this.print();
        } else if (response.action == 'print_current_tariff') {
          if (!response.response) {
            this.priceToPrint = null;
          }
          this.print();
        } else if (response.action == 'print_current_tariff_select_size') {
          if (response.response) {
            let sizeRanges: PriceModel.SizeRange[] = [];
            for(let iPrice of this.priceOptions){
              sizeRanges.push({rangesNumbers: {
                  sizeRangeNumberMax: iPrice.rangesNumbers.sizeRangeNumberMax,
                  sizeRangeNumberMin: iPrice.rangesNumbers.sizeRangeNumberMin
                }});
            }
            ScanditMatrixSimple.showAlertSelectSizeToPrint('Selecciona la talla:', sizeRanges);
          } else {
            this.priceToPrint = null;
            this.print();
          }
        }
      },
      'Tarifa '+this.tariffName,
      this.scanditProvider.colorsHeader.background.color,
      this.scanditProvider.colorsHeader.color.color
    );
  }

  checkAndPrint(barcode: string) {
    if (barcode != this.lastBarcode) {
      this.lastBarcode = barcode;
      ScanditMatrixSimple.setTimeout("lastCodeScannedStart", this.timeMillisToResetScannedCode, "");
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
          switch (this.priceOptions.length) {
            case 0:
              this.priceToPrint = null;
              this.print();
              break;
            case 1:
              this.priceToPrint = response.data[0];
              if (this.priceToPrint.tariff.id == this.tariffId) {
                this.print();
              } else {
                ScanditMatrixSimple.showWarning(true, `No hay registrado un precio para el artículo en la tarifa ${this.tariffName}. ¿Desea imprimir el precio de su tarifa vigente (${this.priceToPrint.tariffName})?`, 'print_current_tariff', 'Sí', 'No');
              }
              break;
            default:
              if (response.data[0].tariff.id == this.tariffId) {
                let sizeRanges: PriceModel.SizeRange[] = [];
                for(let iPrice of this.priceOptions){
                  sizeRanges.push({rangesNumbers: {
                      sizeRangeNumberMax: iPrice.rangesNumbers.sizeRangeNumberMax,
                      sizeRangeNumberMin: iPrice.rangesNumbers.sizeRangeNumberMin
                    }});
                }
                ScanditMatrixSimple.showAlertSelectSizeToPrint('Selecciona la talla:', sizeRanges);
              } else {
                ScanditMatrixSimple.showWarning(true, `No hay registrado un precio para el artículo en la tarifa ${this.tariffName}. ¿Desea imprimir un precio de su tarifa vigente (${this.priceToPrint.tariffName})?`, 'print_current_tariff_select_size', 'Sí', 'No');
              }
          }
        });
      }
    }
  }

  print(){
    this.priceData = [];
    if(this.priceToPrint != null) {
      if (this.priceToPrint.typeLabel == PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET) {
        ScanditMatrixSimple.showWarning(true, 'Este artículo no tiene tarifa outlet. ¿Desea imprimir su etiqueta de PVP?', 'print_pvp_label', 'Sí', 'No');
      } else {
        this.priceData[1] = this.priceToPrint.model.reference;
        this.priceData[2] = this.priceToPrint.model.brand.name;
        this.priceData[3] = this.priceToPrint.model.lifestyle.name;
        this.priceData[5] = this.priceToPrint.totalPrice;

        if (this.priceToPrint.priceDiscountOutlet
          && this.priceToPrint.priceDiscountOutlet !== '0.00'
          && this.priceToPrint.priceDiscountOutlet !== '0,00'
          && this.priceToPrint.priceOriginal !== this.priceToPrint.priceDiscountOutlet) {
          this.priceData[5] = this.priceToPrint.priceDiscountOutlet;
        }

        switch (this.priceToPrint.status) {
          case 1:
            this.priceData[4] = 'Nuevo';
            this.priceData[0] = 'Imprimiendo...';
            ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
            this.printerService.printTagPriceUsingPrice([this.priceToPrint], async ()=>{
              await this.printerService.printNotifyPromiseReturned([this.priceToPrint.id]);
              this.events.publish('setProductAsPrinted');
              this.priceData[0] = 'Artículo impreso con éxito.';
              ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
            }, ()=>{
              this.priceData[0] = 'Error de conexión con la impresora.';
              ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
            });
            break;
          case 2:
            this.priceData[4] = 'Actualizado';
            this.priceData[0] = 'Imprimiendo...';
            ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
            this.printerService.printTagPriceUsingPrice([this.priceToPrint], async ()=>{
              await this.printerService.printNotifyPromiseReturned([this.priceToPrint.id]);
              this.events.publish('setProductAsPrinted');
              this.priceData[0] = 'Artículo impreso con éxito.';
              ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
            }, ()=>{
              this.priceData[0] = 'Error de conexión con la impresora.';
              ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
            });
            break;
          case 3:
          case 7:
            this.priceData[4] = 'Eliminado';
            this.priceData[0] = 'La tarifa no está vigente para este artículo, ¿desea imprimir el precio de la tarifa vigente?';
            this.reprint = false;
            ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
            break;
          case 4:
            this.priceData[4] = 'Impreso';
            this.priceData[0] = 'Este artículo ya está impreso, ¿desea volver a imprimirlo?';
            this.reprint = true;
            ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
            break;
          default:
            this.priceData[4] = 'Desconocido';
            this.priceData[0] = 'La tarifa no está vigente para este artículo, ¿desea imprimir el precio de la tarifa vigente?';
            this.reprint = false;
            ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
        }
      }
    }else{
      this.priceData[0] = 'Error: no hay precios asociados al modelo con referencia '+this.lastBarcode+'.';
      ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
    }
  }

  buttonClick(){
    if(this.reprint){
      this.priceData[6] = 'button reprint';
      this.priceData[0] = 'Imprimiendo...';
      ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
      this.printerService.printTagPriceUsingPrice([this.priceToPrint], async ()=>{
        await this.printerService.printNotifyPromiseReturned([this.priceToPrint.id]);
        this.events.publish('setProductAsPrinted');
        this.priceData[0] = 'Artículo re-impreso con éxito.';
        ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
      }, ()=>{
        this.priceData.splice(6,1);
        this.priceData[0] = 'Error de conexión con la impresora.';
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
        ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
        this.printerService.printTagPriceUsingPrice([this.priceToPrint], ()=>{
          this.priceData[0] = 'Artículo vigente impreso con éxito.';
          ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
        }, ()=>{
          this.priceData.splice(6,1);
          this.priceData[0] = 'Error de conexión con la impresora.';
          ScanditMatrixSimple.loadPriceInfo(null, this.priceData);
        });
      });
    }
  }

  private executeAction(action: string, paramsString: string){
    let params = [];
    try{
      params = JSON.parse(paramsString);
    } catch (e) {

    }

    switch (action){
      case 'lastCodeScannedStart':
        this.lastBarcode = 'start';
        break;
    }
  }

}
