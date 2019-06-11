import {Injectable} from '@angular/core';
import {InventoryService} from "../endpoint/inventory/inventory.service";
import {InventoryModel} from "../../models/endpoints/Inventory";
import {WarehouseService} from "../endpoint/warehouse/warehouse.service";
import {from, Observable} from "rxjs/index";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {ShoesPickingModel} from "../../models/endpoints/ShoesPicking";
import {PickingModel} from "../../models/endpoints/Picking";
import {switchMap} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {AuthenticationService} from "../endpoint/authentication/authentication.service";
import {Events} from "@ionic/angular";

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
  private scannerPausedByWarning: boolean = false;

  private postVerifyPackingUrl = environment.apiBase+"/workwaves/order/packing";
  private getPendingListByPickingUrl = environment.apiBase+"/shoes/picking/{{id}}/pending";
  private putProductNotFoundUrl = environment.apiBase+"/shoes/picking/{{workWaveOrderId}}/product-not-found/{{productId}}";

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private inventoryService: InventoryService,
    private warehouseService: WarehouseService,
    private events: Events
  ) {

  }

  setApiKey(api_key) {
    Scandit.License.setAppKey(api_key);
  }

  positioning() {

    let positionsScanning = [];
    let containerReference = '';
    let warehouseId = this.warehouseService.idWarehouseMain;

    ScanditMatrixSimple.init((response) => {
      if (response && response.barcode && (!this.scannerPausedByWarning || response.action == 'force_scanning')) {
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
            if (response.action == 'force_scanning') {
              this.scannerPausedByWarning = false;
              if (response.force) {
                this.storeProductInContainer({
                  productReference: productReference,
                  containerReference: containerReference,
                  warehouseId: warehouseId,
                  force: true
                }, response);
              } else {
                ScanditMatrixSimple.setText(`No se ha registrado la ubicación del producto ${productReference} en el contenedor.`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 16);
                this.hideTextMessage(1500);
              }
            } else {
              let searchProductPosition = positionsScanning.filter(el => el.product == productReference && el.position == containerReference);
              if(searchProductPosition.length == 0){
                positionsScanning.push({product: productReference, position: containerReference});
                ScanditMatrixSimple.setText(`Escaneado ${productReference} para posicionar en ${containerReference}`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 16);
                this.hideTextMessage(1500);
                this.storeProductInContainer({
                  productReference: productReference,
                  containerReference: containerReference,
                  warehouseId: warehouseId
                }, response);
              }
            }
          }
        }
      }
    }, 'Ubicar/Escanear', HEADER_BACKGROUND, HEADER_COLOR);
  }

  private storeProductInContainer(params, responseScanning) {
    this.inventoryService.postStore(params).then((data: Observable<HttpResponse<InventoryModel.ResponseStore>>) => {
      data.subscribe((res: HttpResponse<InventoryModel.ResponseStore>) => {
          if (res.body.code == 200 || res.body.code == 201) {
            ScanditMatrixSimple.setText(`Producto ${params.productReference} añadido a la ubicación ${params.containerReference}`, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 18);
            this.hideTextMessage(2000);
          } else if (res.body.code == 428) {
            this.scannerPausedByWarning = true;
            ScanditMatrixSimple.showWarningToForce(true, responseScanning.barcode);
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
        }, (error) => {
          if (error.error.code == 428) {
            this.scannerPausedByWarning = true;
            ScanditMatrixSimple.showWarningToForce(true, responseScanning.barcode);
          } else {
            ScanditMatrixSimple.setText(error.error.errors, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
            this.hideTextMessage(1500);
          }
        }
      );
    }, (error: HttpErrorResponse) => {
      if (error.error.code == 428) {
        this.scannerPausedByWarning = true;
        ScanditMatrixSimple.showWarningToForce(true, responseScanning.barcode);
      } else {
        ScanditMatrixSimple.setText(error.message, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
        this.hideTextMessage(1500);
      }
    });
  }

  picking(pickingId: number, listProducts: ShoesPickingModel.ShoesPicking[]) {
    let processInitiated: boolean = false;
    let jailReference: string = null;
    let productsToScan: ShoesPickingModel.ShoesPicking[] = listProducts;
    let productsScanned: string[] = [];
    let typePacking: number = 0;

    ScanditMatrixSimple.init((response) => {
      let code = '';
      if (response.barcode) {
        code = response.barcode.data;
      }
      //Check Jail/Pallet or product
      if (!this.scannerPausedByWarning && (code.match(/J([0-9]){4}/) || code.match(/P([0-9]){4}/))) {
        if (!processInitiated) {
          this.postVerifyPacking({
              status: 2,
              pickingId: pickingId,
              packingReference: code
            })
            .subscribe((res) => {
              if (code.match(/J([0-9]){4}/)) {
                typePacking = 1;
              } else {
                typePacking = 2;
              }
              processInitiated = true;
              jailReference = code;
              ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
              ScanditMatrixSimple.setText(`Proceso iniciado con la Jaula ${jailReference}.`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
              this.hideTextMessage(2000);
              ScanditMatrixSimple.showTextScanJail(false, '');
            }, (error) => {
              if (error.error.code == 404) {
                ScanditMatrixSimple.setText('La Jaula escaneada no está registrada en el sistema.', BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                this.hideTextMessage(2000);
              } else {
                ScanditMatrixSimple.setText(error.error.errors, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                this.hideTextMessage(2000);
              }
            });
        } else if (productsToScan.length != 0) {
          ScanditMatrixSimple.setText('Continúe escaneando los productos que se le indican antes de finalizar el proceso.', BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
          this.hideTextMessage(2000);
        } else if (jailReference != code) {
          ScanditMatrixSimple.setText('La Jaula escaneada es diferente a la Jaula con la que inició el proceso.', BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
          this.hideTextMessage(2000);
        } else {
          this.postVerifyPacking({
              status: 3,
              pickingId: pickingId,
              packingReference: jailReference
            })
            .subscribe((res) => {
              ScanditMatrixSimple.setText('Proceso finalizado correctamente.', BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 18);
              this.hideTextMessage(1500);
              ScanditMatrixSimple.showTextScanJail(false, jailReference);
              setTimeout(() => {
                ScanditMatrixSimple.finish();
                this.events.publish('picking:remove');
              }, 1.5 * 1000);
            }, (error) => {
              if (error.error.code == 404) {
                ScanditMatrixSimple.setText('La Jaula escaneada no está registrada en el sistema.', BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                this.hideTextMessage(2000);
              } else {
                ScanditMatrixSimple.setText(error.error.errors, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                this.hideTextMessage(2000);
              }
            });
        }
      } else if (!this.scannerPausedByWarning && code && code != '') {
        if (!processInitiated) {
          ScanditMatrixSimple.setText('Escanea la Jaula a utilizar antes de comenzar el proceso.', BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
          this.hideTextMessage(2000);
        } else {
          if (productsToScan.length > 0) {
            let picking: InventoryModel.Picking = {
              packingReference: jailReference,
              packingType: typePacking,
              pikingId: pickingId,
              productReference: code
            };
            this.inventoryService
              .postPicking(picking)
              .subscribe((res: InventoryModel.ResponsePicking) => {
                if (res.code == 200 || res.code == 201) {
                  productsToScan = res.data.shoePickingPending;
                  productsScanned.push(code);
                  ScanditMatrixSimple.setText(`Producto ${code} escaneado y añadido a la Jaula.`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
                  this.hideTextMessage(2000);
                  if (productsToScan.length > 0) {
                    ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
                  } else {
                    ScanditMatrixSimple.showNexProductToScan(false);
                    setTimeout(() => {
                      ScanditMatrixSimple.showTextScanJail(true, jailReference);
                      ScanditMatrixSimple.setText('Todos los productos han sido escaneados. Escanea de nuevo la Jaula o Pallet utilizado para finalizar el proceso.', BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
                      this.hideTextMessage(1500);
                    }, 2 * 1000);
                  }
                } else {
                  ScanditMatrixSimple.setText(res.message, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
                  this.hideTextMessage(2000);
                  this.getPendingListByPicking(pickingId)
                    .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                      if (res.code == 200 || res.code == 201) {
                        productsToScan = res.data;
                        if (productsToScan.length > 0) {
                          ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
                        } else {
                          ScanditMatrixSimple.showNexProductToScan(false);
                          setTimeout(() => {
                            ScanditMatrixSimple.showTextScanJail(true, jailReference);
                            ScanditMatrixSimple.setText('Todos los productos han sido escaneados. Escanea de nuevo la Jaula o Pallet utilizado para finalizar el proceso.', BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
                            this.hideTextMessage(1500);
                          }, 2 * 1000);
                        }
                      }
                    });
                }
              }, (error) => {
                ScanditMatrixSimple.setText(error.error.errors, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
                this.hideTextMessage(2000);
                this.getPendingListByPicking(pickingId)
                  .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                    if (res.code == 200 || res.code == 201) {
                      productsToScan = res.data;
                      if (productsToScan.length > 0) {
                        ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
                      } else {
                        ScanditMatrixSimple.showNexProductToScan(false);
                        setTimeout(() => {
                          ScanditMatrixSimple.showTextScanJail(true, jailReference);
                          ScanditMatrixSimple.setText('Todos los productos han sido escaneados. Escanea de nuevo la Jaula o Pallet utilizado para finalizar el proceso.', BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
                          this.hideTextMessage(1500);
                        }, 2 * 1000);
                      }

                    }
                  });
              });
          } else {
            ScanditMatrixSimple.showNexProductToScan(false);
            ScanditMatrixSimple.showTextScanJail(true, jailReference);
            ScanditMatrixSimple.setText('Todos los productos han sido escaneados. Escanea de nuevo la Jaula o Pallet utilizado para finalizar el proceso.', BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
            this.hideTextMessage(1500);
          }
        }
      } else {
        if (response.action == 'product_not_found') {
          this.scannerPausedByWarning = false;
          if (response.found) {
            let productNotFoundId = response.product_id;
            this.putProductNotFound(pickingId, productNotFoundId)
              .subscribe((res: ShoesPickingModel.ResponseProductNotFound) => {
                if (res.code == 200 || res.code == 201) {
                  ScanditMatrixSimple.setText('El producto ha sido reportado como no encontrado.', BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
                  this.hideTextMessage(1500);
                  this.getPendingListByPicking(pickingId)
                    .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                      if (res.code == 200 || res.code == 201) {
                        productsToScan = res.data;
                        if (productsToScan.length > 0) {
                          ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
                        } else {
                          ScanditMatrixSimple.showNexProductToScan(false);
                          setTimeout(() => {
                            ScanditMatrixSimple.showTextScanJail(true, jailReference);
                            ScanditMatrixSimple.setText('Todos los productos han sido escaneados. Escanea de nuevo la Jaula o Pallet utilizado para finalizar el proceso.', BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
                            this.hideTextMessage(1500);
                          }, 2 * 1000);
                        }

                      }
                    });
                } else {
                  ScanditMatrixSimple.setText('Ha ocurrido un error al intentar reportar el producto como no encontrado.', BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
                  this.hideTextMessage(2000);
                }
              }, error => {
                ScanditMatrixSimple.setText('Ha ocurrido un error al intentar reportar el producto como no encontrado.', BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
                this.hideTextMessage(2000);
              });
          }
        } else if (response.action == 'warning_product_not_found') {
          this.scannerPausedByWarning = true;
        } else if (response.action == 'matrix_simple') {
          ScanditMatrixSimple.showTextScanJail(true, '');
        }
      }
    }, 'Escanear', HEADER_BACKGROUND, HEADER_COLOR);
  }

  private hideTextMessage(delay: number){
    if(this.timeoutHideText){
      clearTimeout(this.timeoutHideText);
    }
    this.timeoutHideText = setTimeout(() => {
      ScanditMatrixSimple.showText(false);
    }, delay);
  }

  private postVerifyPacking(packing) : Observable<PickingModel.ResponseUpdate> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<PickingModel.ResponseUpdate>(this.postVerifyPackingUrl, packing, { headers });
    }));
  }

  private getPendingListByPicking(pickingId: number) : Observable<ShoesPickingModel.ResponseListByPicking> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.get<ShoesPickingModel.ResponseListByPicking>(this.getPendingListByPickingUrl.replace('{{id}}', pickingId.toString()), { headers });
    }));
  }

  private putProductNotFound(pickingId: number, productId: number) : Observable<ShoesPickingModel.ResponseProductNotFound> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      let putProductNotFoundUrl = this.putProductNotFoundUrl.replace('{{workWaveOrderId}}', pickingId.toString());
      putProductNotFoundUrl = putProductNotFoundUrl.replace('{{productId}}', productId.toString());
      return this.http.put<ShoesPickingModel.ResponseProductNotFound>(putProductNotFoundUrl, { headers });
    }));
  }

}
