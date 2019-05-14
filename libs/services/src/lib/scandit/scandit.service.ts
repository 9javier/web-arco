import {Injectable} from '@angular/core';
import {SCANDIT_API_KEY} from "../../../../../config/base";
import {InventoryService} from "../endpoint/inventory/inventory.service";
import {InventoryModel} from "../../models/endpoints/Inventory";
import {WarehouseService} from "../endpoint/warehouse/warehouse.service";
import {Observable} from "rxjs/index";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class ScanditService {

  private timeoutHideText;

  constructor(
    private inventoryService: InventoryService,
    private warehouseService: WarehouseService
  ) {}

  setApiKey() {
    Scandit.License.setAppKey(SCANDIT_API_KEY);
  }

  scanReferences() {
    GScandit.matrix_bubble((response) => {
      console.log("TEST::GScandit response", response);
      GScandit.setDataReference(response.barcode.id, response.barcode.data, response.barcode.data, '10,99', [{attribute_name:'40', color: 'Azul'}], false, "Nothing", "Nothing");
    }, '', '', 1);
  }

  positioning() {

    let positionsScanning = [];
    let containerReference = '';
    let warehouseId = this.warehouseService.idWarehouseMain;

    ScanditMatrixSimple.init((response) => {
      console.log("TEST::response", response);
      if (response && response.barcode) {
        //Check Container or product
        let code = response.barcode.data;
        if (code.match(/P([0-9]){3}A([0-9]){2}C([0-9]){3}$/)) {
          //Container
          if(containerReference != code){
            containerReference = code;
            ScanditMatrixSimple.setText(`Inicio de posicionamiento en ${code}`, '#15789e', '#FFFFFF', 18);
            ScanditMatrixSimple.showText(true);
            this.hideTextMessage(2000);
          }
        } else if (code.match(/([0]){2}([0-9]){6}([0-9]){2}([0-9]){3}([0-9]){5}$/)) {
          //Product
          let productReference = code;
          if (!containerReference) {
            ScanditMatrixSimple.setText(`Debe escanear una posición para iniciar el posicionamiento`, '#e8413e', '#FFFFFF', 18);
            ScanditMatrixSimple.showText(true);
            this.hideTextMessage(1500);
          } else {

            ScanditMatrixSimple.setText(`Escaneado ${productReference} para posicionar en ${containerReference}`, '#15789e', '#FFFFFF', 16);
            ScanditMatrixSimple.showText(true);
            this.hideTextMessage(1500);
            this.inventoryService.postStore({
              productReference: productReference,
              containerReference: containerReference,
              warehouseId: warehouseId
            }).then((data: Observable<HttpResponse<InventoryModel.ResponseStore>>) => {
              data.subscribe((res: HttpResponse<InventoryModel.ResponseStore>) => {
                if (res.body.code == 200 || res.body.code == 201) {
                  ScanditMatrixSimple.setText(`Producto ${productReference} añadido a la ubicación ${containerReference}`, '#2F9E5A', '#FFFFFF', 18);
                  ScanditMatrixSimple.showText(true);
                  this.hideTextMessage(2000);
                } else {
                  let errorMessage = '';
                  if (res.body.errors.productReference && res.body.errors.productReference.message) {
                    errorMessage = res.body.errors.productReference.message;
                  } else {
                    errorMessage = res.body.message;
                  }
                  ScanditMatrixSimple.setText(errorMessage, '#e8413e', '#FFFFFF', 18);
                  ScanditMatrixSimple.showText(true);
                  this.hideTextMessage(1500);
                }
              });
            }, (error: HttpErrorResponse) => {
              ScanditMatrixSimple.setText(error.message, '#e8413e', '#FFFFFF', 18);
              ScanditMatrixSimple.showText(true);
              this.hideTextMessage(1500);
            });
          }
        }
      }
    }, 'Ubicar/Escanear', '#FFFFFF', '#424242');
  }

  private hideTextMessage(delay: number){
    if(this.timeoutHideText){
      clearTimeout(this.timeoutHideText);
    }
    this.timeoutHideText = setTimeout(() => {
      ScanditMatrixSimple.showText(false);
    }, delay);
  }

}
