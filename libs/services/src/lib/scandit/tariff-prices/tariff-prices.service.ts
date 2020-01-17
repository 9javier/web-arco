import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {Router} from "@angular/router";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {ItemReferencesProvider} from "../../../providers/item-references/item-references.provider";
import {PriceService, ProductModel, ProductsService} from "@suite/services";
import {FilterPriceModel} from "../../../models/endpoints/FilterPrice";
import {PrinterService} from "../../printer/printer.service";

declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class TariffPricesScanditService {

  warehouseId: number;
  tariffId: number;
  lastBarcode = null;

  constructor(
    private router: Router,
    private scanditProvider: ScanditProvider,
    private itemReferencesProvider: ItemReferencesProvider,
    private priceService: PriceService,
    private printerService: PrinterService,
    private productsService: ProductsService
  ) {}

  public init(warehouseId: number, tariffId: number) {
    this.warehouseId = warehouseId;
    this.tariffId = tariffId;
    // this.checkAndPrint({result: true, barcode:{data: '000727331102100036', id: 1}});
    ScanditMatrixSimple.initTariffPrices(
      response => {
        if(response.barcode != undefined) this.checkAndPrint(response);
        else if(response.size_selected != undefined) this.printModel(response);
      },
      'Escáner Tarifas',
      this.scanditProvider.colorsHeader.background.color,
      this.scanditProvider.colorsHeader.color.color
    );
  }

  checkAndPrint(response: ScanditModel.Response) {
    console.log('Llego a checkAndPrint.');
    if (response.barcode.data != this.lastBarcode) {
      let barcode = response.barcode.data;
      this.lastBarcode = barcode;
      if (this.itemReferencesProvider.checkCodeValue(barcode) == this.itemReferencesProvider.codeValue.PRODUCT) {
        this.print({
          warehouseId: this.warehouseId,
          tariffId: this.tariffId,
          reference: barcode
        });
      }else if(this.itemReferencesProvider.checkCodeValue(barcode) == this.itemReferencesProvider.codeValue.PRODUCT_MODEL){
        //Buscar los rangos de tallas disponibles
        this.productsService.getInfo(barcode).then((res: ProductModel.ResponseInfo) => {
          let responseSizeAndModel: ProductModel.SizesAndModel = <ProductModel.SizesAndModel>res.data;
          let listItems = responseSizeAndModel.sizes.map((size) => {
            return { rangesNumbers: { sizeRangeNumberMax: size.name, sizeRangeNumberMin: size.name } }
          });
          ScanditMatrixSimple.showAlertSelectSizeToPrint('Selecciona la talla:', listItems);
        });

      }
    }
  }

  printModel(response: ScanditModel.ResponsePrintTags){
    console.log('Llego a printModel.');
    this.print({
      warehouseId: this.warehouseId,
      tariffId: this.tariffId,
      reference: this.lastBarcode,
      sizeId: response.size_selected
    });
  }

  print(reference: FilterPriceModel.FilterPriceRequest){
    console.log('Llego print.');
    this.priceService.getByReference(reference).then(response => {
      if(response.data.filterPrice.impress){
        // si ya está impreso mostrar toast indicándolo
        console.log('Ya estoy impreso.');
      }else{
        let reference = { references: [{
            warehouseId: this.warehouseId,
            tariffId: this.tariffId,
            modelId:  response.data.modelId,
            numRange: response.data.numRange
          }]};
        this.printerService.printPrices(reference).subscribe(printed => {
          if(printed){
            console.log('Acabo de ser imprimido.');
            // marcarlo como impreso
            // mostrar toast indicándolo
          }else{
            console.log('No he sido imprimido.');
          }
        });
      }
    });
  }

}
