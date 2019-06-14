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
      if (response && response.barcode) {
        console.warn("scanner log\t1\tscan!", response && response.barcode && response.barcode.data);
        if (this.scannerPausedByWarning) {
          console.error("scanner log\t1.1\tpaused!");
        } else if (response.action != 'force_scanning') {
          console.error("scanner log\t1.2\taction empty");
        }
      } else {
        console.error("scanner log\t2\tempty scan!");
      }
      if (response && response.barcode) {
        //Check Container or product
        let code = response.barcode.data;
        if (code.match(/J[0-9]{3}$/)) {
          // temporary trick to release potential scanner service logic deadlock
          console.warn("scanner log\t#\treleasing pause flag!", this.scannerPausedByWarning);
          this.scannerPausedByWarning = false;
        }
      }
      if (response && response.barcode && (!this.scannerPausedByWarning || response.action == 'force_scanning')) {
        //Check Container or product
        let code = response.barcode.data;
        if (code.match(/P([0-9]){3}A([0-9]){2}C([0-9]){3}$/) || code.match(/P([0-9]){2}[A-Z]([0-9]){2}$/)) {
          console.warn("scanner log\t1.3\tcontainer matched!", code, containerReference);
          //Container
          if(containerReference != code){
            positionsScanning = [];
            containerReference = code;
            console.warn("scanner log\t1.3.1\tpositioning start!");
            ScanditMatrixSimple.setText(`Inicio de posicionamiento en ${code}`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
            this.hideTextMessage(2000);
          }
        } else if (code.match(/([0]){2}([0-9]){6}([0-9]){2}([0-9]){3}([0-9]){5}$/)) {
          console.warn("scanner log\t1.4\tproduct matched!");
          //Product
          let productReference = code;
          if (!containerReference) {
            console.error("scanner log\t1.4.1\tno container!");
            ScanditMatrixSimple.setText(`Debe escanear una posición para iniciar el posicionamiento`, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
            this.hideTextMessage(1500);
          } else {
            console.warn("scanner log\t1.4.2\tyes container!");
            if (response.action == 'force_scanning') {
              console.warn("scanner log\t1.4.2.1\taction force, disable pause!");
              this.scannerPausedByWarning = false;
              if (response.force) {
                console.warn("scanner log\t1.4.2.1.1\tsending save response to server with force!");
                this.storeProductInContainer({
                  productReference: productReference,
                  containerReference: containerReference,
                  warehouseId: warehouseId,
                  force: true
                }, response);
              } else {
                console.warn("scanner log\t1.4.2.1.2\tresponse NO force!");
                ScanditMatrixSimple.setText(`No se ha registrado la ubicación del producto ${productReference} en el contenedor.`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 16);
                this.hideTextMessage(1500);
              }
            } else {
              console.warn("scanner log\t1.4.2.2\taction NO force");
              let searchProductPosition = positionsScanning.filter(el => el.product == productReference && el.position == containerReference);
              if(searchProductPosition.length > 0){
                console.error("scanner log\t1.4.2.2.1\tignored, duplicate!");
              }
              if(searchProductPosition.length == 0){
                console.error("scanner log\t1.4.2.2.2\tproduct located, saving scan hisotry and storing product (server)");
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
            console.warn("scanner log\t1.4.2.2.2.1\tscan saved on server!!!!!");
            ScanditMatrixSimple.setText(`Producto ${params.productReference} añadido a la ubicación ${params.containerReference}`, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 18);
            this.hideTextMessage(2000);
          } else if (res.body.code == 428) {
            console.error("scanner log\t1.4.2.2.2.2\terror 428, stop pause!");
            this.scannerPausedByWarning = true;
            ScanditMatrixSimple.showWarningToForce(true, responseScanning.barcode);
          } else {
            console.error("scanner log\t1.4.2.2.2.3\terror unknown!!!");
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
            console.error("scanner log\t1.4.2.2.2.4\terror 428, stop pause!");
            this.scannerPausedByWarning = true;
            ScanditMatrixSimple.showWarningToForce(true, responseScanning.barcode);
          } else {
            console.error("scanner log\t1.4.2.2.2.5\terror unknown!!!");
            ScanditMatrixSimple.setText(error.error.errors, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
            this.hideTextMessage(1500);
          }
        }
      );
    }, (error: HttpErrorResponse) => {
      if (error.error.code == 428) {
        console.error("scanner log\t1.4.2.2.2.6\terror 428, stop pause!");
        this.scannerPausedByWarning = true;
        ScanditMatrixSimple.showWarningToForce(true, responseScanning.barcode);
      } else {
        console.error("scanner log\t1.4.2.2.2.7\terror unknown!!!");
        ScanditMatrixSimple.setText(error.message, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
        this.hideTextMessage(1500);
      }
    });
  }

  picking(pickingId: number, listProducts: ShoesPickingModel.ShoesPicking[], typePacking: number, packingReference: string) {
    let processInitiated: boolean = false;
    let jailReference: string = null;
    let productsToScan: ShoesPickingModel.ShoesPicking[] = listProducts;
    let productsScanned: string[] = [];
    let lastCodeScanned: string = "start";
    let literalsJailPallet: any = {
      1: {
        not_registered: 'La Jaula escaneada no está registrada en el sistema.',
        process_resumed: 'Para continuar con el proceso de picking escanea la Jaula ',
        process_started: 'Proceso iniciado con la Jaula ',
        scan_before_products: 'Escanea la Jaula a utilizar antes de comenzar el proceso.',
        scan_to_end: 'Todos los productos han sido escaneados. Escanea de nuevo la Jaula utilizada para finalizar el proceso.',
        toThe: "a la Jaula",
        wrong_packing: 'La herramienta de distribución escaneada no es la que se le solicitó. Escanea una Jaula para comenzar el proceso de picking.',
        wrong_process_finished: 'La Jaula escaneada es diferente a la Jaula con la que inició el proceso.'
      },
      2: {
        not_registered: 'El Pallet escaneado no está registrado en el sistema.',
        process_resumed: 'Para continuar con el proceso de picking escanea el Pallet ',
        process_started: 'Proceso iniciado con el Pallet ',
        scan_before_products: 'Escanea el Pallet a utilizar antes de comenzar el proceso.',
        scan_to_end: 'Todos los productos han sido escaneados. Escanea de nuevo el Pallet utilizado para finalizar el proceso.',
        toThe: "al Pallet",
        wrong_packing: 'La herramienta de distribución escaneada no es la que se le solicitó. Escanea un Pallet para comenzar el proceso de picking.',
        wrong_process_finished: 'El Pallet escaneado es diferente al Pallet con el que inició el proceso.'
      }
    };

    ScanditMatrixSimple.init((response) => {
      let code = '';
      if (response.barcode) {
        code = response.barcode.data;
      }
      //Check Jail/Pallet or product
      if (!this.scannerPausedByWarning && (code.match(/J([0-9]){4}/) || code.match(/P([0-9]){4}/))) {
        if (!processInitiated) {
          let typePackingScanned = 0;
          if (code.match(/J([0-9]){4}/)) {
            typePackingScanned = 1;
          } else {
            typePackingScanned = 2;
          }

          if ((packingReference && packingReference == code) || !packingReference) {
            if (typePackingScanned == typePacking) {
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
                  if (!packingReference) {
                    packingReference = jailReference;
                  }
                  ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
                  ScanditMatrixSimple.setText(`${literalsJailPallet[typePacking].process_started}${jailReference}.`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
                  this.hideTextMessage(2000);
                  ScanditMatrixSimple.showTextStartScanPacking(false, typePacking, '');
                }, (error) => {
                  if (error.error.code == 404) {
                    ScanditMatrixSimple.setText(literalsJailPallet[typePacking].not_registered, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                    this.hideTextMessage(2000);
                  } else {
                    ScanditMatrixSimple.setText(error.error.errors, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                    this.hideTextMessage(2000);
                  }
                });
            } else {
              ScanditMatrixSimple.setText(literalsJailPallet[typePacking].wrong_packing, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
              this.hideTextMessage(2000);
            }
          } else {
            ScanditMatrixSimple.setText(`${literalsJailPallet[typePacking].process_resumed}${packingReference}.`, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
            this.hideTextMessage(2000);
          }
        } else if (productsToScan.length != 0) {
          ScanditMatrixSimple.setText('Continúe escaneando los productos que se le indican antes de finalizar el proceso.', BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
          this.hideTextMessage(2000);
        } else if (jailReference != code) {
          ScanditMatrixSimple.setText(literalsJailPallet[typePacking].wrong_process_finished, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
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
              ScanditMatrixSimple.showTextEndScanPacking(false, typePacking, jailReference);
              setTimeout(() => {
                ScanditMatrixSimple.finish();
                this.events.publish('picking:remove');
              }, 1.5 * 1000);
            }, (error) => {
              if (error.error.code == 404) {
                ScanditMatrixSimple.setText(literalsJailPallet[typePacking].not_registered, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                this.hideTextMessage(2000);
              } else {
                ScanditMatrixSimple.setText(error.error.errors, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                this.hideTextMessage(2000);
              }
            });
        }
      } else if (!this.scannerPausedByWarning && code && code != '' && code != lastCodeScanned) {
        if (!processInitiated) {
          ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_before_products, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
          this.hideTextMessage(2000);
        } else {
          lastCodeScanned = code;
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
                  ScanditMatrixSimple.setText(`Producto ${code} escaneado y añadido ${literalsJailPallet[typePacking].toThe}.`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
                  this.hideTextMessage(2000);
                  if (productsToScan.length > 0) {
                    ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
                  } else {
                    ScanditMatrixSimple.showNexProductToScan(false);
                    setTimeout(() => {
                      ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference);
                      ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_to_end, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
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
                            ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference);
                            ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_to_end, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
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
                          ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference);
                          ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_to_end, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
                          this.hideTextMessage(1500);
                        }, 2 * 1000);
                      }

                    }
                  });
              });
          } else {
            ScanditMatrixSimple.showNexProductToScan(false);
            ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference);
            ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_to_end, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
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
                            ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference);
                            ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_to_end, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
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
          if (productsToScan.length > 0) {
            ScanditMatrixSimple.showTextStartScanPacking(true, typePacking, packingReference || '');
          } else {
            jailReference = packingReference;
            processInitiated = true;
            ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference);
          }
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
