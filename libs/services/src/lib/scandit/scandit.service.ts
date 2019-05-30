import {Injectable} from '@angular/core';
import {InventoryService} from "../endpoint/inventory/inventory.service";
import {InventoryModel} from "../../models/endpoints/Inventory";
import {WarehouseService} from "../endpoint/warehouse/warehouse.service";
import {Observable} from "rxjs/index";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

const BACKGROUND_COLOR_ERROR: string = '#e8413e';
const BACKGROUND_COLOR_INFO: string = '#15789e';
const BACKGROUND_COLOR_SUCCESS: string = '#2F9E5A';
const TEXT_COLOR: string = '#FFFFFF';
const HEADER_BACKGROUND: string = '#222428';
const HEADER_COLOR: string = '#FFFFFF';

@Injectable({
  providedIn: 'root'
})
export class ScanditService {

  private timeoutHideText;

  constructor(
    private inventoryService: InventoryService,
    private warehouseService: WarehouseService
  ) {}

  setApiKey(api_key) {
    Scandit.License.setAppKey(api_key);
  }

  positioning() {

    let positionsScanning = [];
    let containerReference = '';
    let warehouseId = this.warehouseService.idWarehouseMain;

    ScanditMatrixSimple.init((response) => {
      if (response && response.barcode) {
        //Check Container or product
        let code = response.barcode.data;
        if (code.match(/P([0-9]){3}A([0-9]){2}C([0-9]){3}$/) || code.match(/P([0-9]){2}[A-Z]([0-9]){2}$/)) {
          //Container
          if(containerReference != code){
            positionsScanning = [];
            containerReference = code;
            ScanditMatrixSimple.setText(`Inicio de posicionamiento en ${code}`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
            this.hideTextMessage(2000);
          }
        } else if (code.match(/([0]){2}([0-9]){6}([0-9]){2}([0-9]){3}([0-9]){5}$/)) {
          //Product
          let productReference = code;
          if (!containerReference) {
            ScanditMatrixSimple.setText(`Debe escanear una posición para iniciar el posicionamiento`, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
            this.hideTextMessage(1500);
          } else {

            let searchProductPosition = positionsScanning.filter(el => el.product == productReference && el.position == containerReference);
            if(searchProductPosition.length == 0){
              positionsScanning.push({product: productReference, position: containerReference});
              ScanditMatrixSimple.setText(`Escaneado ${productReference} para posicionar en ${containerReference}`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 16);
              this.hideTextMessage(1500);
              this.inventoryService.postStore({
                productReference: productReference,
                containerReference: containerReference,
                warehouseId: warehouseId
              }).then((data: Observable<HttpResponse<InventoryModel.ResponseStore>>) => {
                data.subscribe((res: HttpResponse<InventoryModel.ResponseStore>) => {
                  if (res.body.code == 200 || res.body.code == 201) {
                    ScanditMatrixSimple.setText(`Producto ${productReference} añadido a la ubicación ${containerReference}`, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 18);
                    this.hideTextMessage(2000);
                  } else {
                    let errorMessage = '';
                    if (res.body.errors.productReference && res.body.errors.productReference.message) {
                      errorMessage = res.body.errors.productReference.message;
                    } else {
                      errorMessage = res.body.message;
                    }
                    ScanditMatrixSimple.setText(errorMessage, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
                    this.hideTextMessage(1500);
                  }
                });
              }, (error: HttpErrorResponse) => {
                ScanditMatrixSimple.setText(error.message, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
                this.hideTextMessage(1500);
              });
            }
          }
        }
      }
    }, 'Ubicar/Escanear', HEADER_BACKGROUND, HEADER_COLOR);
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
