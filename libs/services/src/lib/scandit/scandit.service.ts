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
import {WarehouseModel} from "@suite/services";
import {ScanditProvider} from "../../providers/scandit/scandit.provider";

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
  private scannerPaused: boolean = false;

  private postVerifyPackingUrl = environment.apiBase+"/processes/picking-main/packing";
  private getPendingListByPickingUrl = environment.apiBase+"/processes/picking-main/shoes//{{id}}/pending";
  private putProductNotFoundUrl = environment.apiBase+"/processes/picking-main/shoes/{{workWaveOrderId}}/product-not-found/{{productId}}";
  private postCheckContainerProductUrl = environment.apiBase + "/inventory/check-container";

  private scanContainerToNotFound: string = null;
  private intervalCleanLastCodeScanned = null;

  private isStoreUser: boolean = false;
  private storeUserObj: WarehouseModel.Warehouse = null;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private inventoryService: InventoryService,
    private warehouseService: WarehouseService,
    private authenticationService: AuthenticationService,
    private events: Events,
    private scanditProvider: ScanditProvider
  ) {

  }

  async setApiKey(api_key) {
    Scandit.License.setAppKey(api_key);
  }

  async positioning() {
    this.isStoreUser = await this.authenticationService.isStoreUser();
    if (this.isStoreUser) {
      this.storeUserObj = await this.authenticationService.getStoreCurrentUser();
    }

    let lastCodeScanned: string = "start";
    let positionsScanning = [];
    let containerReference = null;
    let packingReference = null;
    let warehouseId = this.isStoreUser ? this.storeUserObj.id : this.warehouseService.idWarehouseMain;

    ScanditMatrixSimple.init((response) => {
      if (response && response.barcode) {
        let code = response.barcode.data;
        if (code === "P0001") {
          // temporary trick to release potential scanner service logic deadlock
          this.positioningLog(2, "#1", "releasing pause flag!", [this.scannerPaused]);
          this.scannerPaused = false;
          return;
        }
        if (code === "P0002") {
          // temporary trick to release potential scanner service logic deadlock
          this.positioningLog(2, "#2", "clearing scanned codes buffer!", [this.scannerPaused]);
          positionsScanning = [];
          return;
        }
      }
      if (response && response.barcode) {
        this.positioningLog(2, "1", "scan!", [response && response.barcode && response.barcode.data]);
        if (this.scannerPaused) {
          this.positioningLog(3, "1.1", "paused!");
        } else if (response.action != 'force_scanning') {
          this.positioningLog(3, "1.2", "action empty");
        }
      } else {
        this.positioningLog(3, "2", "empty scan!");
      }
      if (response && response.barcode && (!this.scannerPaused || response.action == 'force_scanning')) {
        //Check Container or product
        let code = response.barcode.data;

        if (code === lastCodeScanned) return;
        lastCodeScanned = code;

        if (!this.isStoreUser && (code.match(/([A-Z]){1,4}([0-9]){3}A([0-9]){2}C([0-9]){3}$/) || code.match(/P([0-9]){2}[A-Z]([0-9]){2}$/))) {
          this.positioningLog(2, "1.3", "container matched!", [code, containerReference]);
          //Container
          positionsScanning = [];
          this.positioningLog(2, "1.3.1", "positioning start!");
          ScanditMatrixSimple.setText(`Inicio de ubicación en la posición ${code}`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
          this.hideTextMessage(2000);
          containerReference = code;
          packingReference = null;
        } else if (code.match(/([0]){2}([0-9]){6}([0-9]){2}([0-9]){3}([0-9]){5}$/)) {
          this.positioningLog(2, "1.4", "product matched!");
          //Product
          let productReference = code;
          if (!this.isStoreUser && (!containerReference || !packingReference)) {
            this.positioningLog(3, "1.4.1", "no container!");
            ScanditMatrixSimple.setText(`Debe escanear una posición o embalaje para iniciar el posicionamiento`, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
            this.hideTextMessage(1500);
          } else {
            this.positioningLog(2, "1.4.2", "yes container!");
            if (response.action == 'force_scanning') {
              this.positioningLog(2, "1.4.2.1", "action force, disable pause!");
              this.scannerPaused = false;
              if (response.force) {
                this.positioningLog(2, "1.4.2.1.1", "sending save response to server with force!");
                let params: any = {
                  productReference: productReference,
                  warehouseId: warehouseId,
                  force: true
                };
                if (!this.isStoreUser && containerReference) {
                  params.containerReference = containerReference;
                } else if (!this.isStoreUser && packingReference) {
                  params.packingReference = packingReference;
                }

                this.storeProductInContainer(params, response);
              } else {
                this.positioningLog(2, "1.4.2.1.2", "response NO force!");
                let msg = '';
                if (this.isStoreUser) {
                  msg = `No se ha registrado la ubicación del producto ${productReference} en la tienda.`;
                } else {
                  if (containerReference) {
                    msg = `No se ha registrado la ubicación del producto ${productReference} en el contenedor.`;
                  } else {
                    msg = `No se ha registrado la ubicación del producto ${productReference} en el embalaje.`;
                  }
                }
                ScanditMatrixSimple.setText(msg, BACKGROUND_COLOR_INFO, TEXT_COLOR, 16);
                this.hideTextMessage(1500);
              }
            } else {
              this.positioningLog(2, "1.4.2.2", "action NO force");
              let searchProductPosition = positionsScanning.filter(el => el.product == productReference && ((containerReference && el.position == containerReference) || (packingReference && el.position == packingReference) || (!containerReference && !packingReference && el.warehouse == warehouseId)));
              if(searchProductPosition.length > 0){
                this.positioningLog(3, "1.4.2.2.1", "ignored, duplicate!");
              }
              if(searchProductPosition.length == 0){
                this.positioningLog(3, "1.4.2.2.2", "product located, saving scan hisotry and storing product (server)");
                positionsScanning.push({product: productReference, position: containerReference, warehouse: warehouseId, packing: packingReference});
                let msgSetText = '';
                if (this.isStoreUser) {
                  msgSetText = `Escaneado ${productReference} para ubicar en la tienda ${this.storeUserObj.name}`;
                } else {
                  if (packingReference) {
                    msgSetText = `Escaneado ${productReference} para ubicar en el embalaje ${packingReference}`;
                  } else {
                    msgSetText = `Escaneado ${productReference} para ubicar en la posición ${containerReference}`;
                  }
                }
                ScanditMatrixSimple.setText(msgSetText, BACKGROUND_COLOR_INFO, TEXT_COLOR, 16);
                this.hideTextMessage(1500);
                let params: any = {
                  productReference: productReference,
                  warehouseId: warehouseId
                };
                if (!this.isStoreUser && containerReference) {
                  params.containerReference = containerReference;
                } else if (!this.isStoreUser && packingReference) {
                  params.packingReference = packingReference;
                }
                this.storeProductInContainer(params, response);
              }
            }
          }
        } else if (!this.isStoreUser && (this.scanditProvider.checkCodeValue(code) == this.scanditProvider.codeValue.PALLET
          || this.scanditProvider.checkCodeValue(code) == this.scanditProvider.codeValue.JAIL)) {
          positionsScanning = [];
          ScanditMatrixSimple.setText(`Inicio de ubicación en el embalaje ${code}`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
          this.hideTextMessage(2000);
          packingReference = code;
          containerReference = null;
        }
      }
    }, 'Ubicar/Escanear', HEADER_BACKGROUND, HEADER_COLOR);
  }

  private storeProductInContainer(params, responseScanning) {
    this.inventoryService.postStore(params).then((data: Observable<HttpResponse<InventoryModel.ResponseStore>>) => {
      data.subscribe((res: HttpResponse<InventoryModel.ResponseStore>) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.positioningLog(2, "1.4.2.2.2.1", "scan saved on server!!!!!");
            let msgSetText = '';
            if (this.isStoreUser) {
              msgSetText = `Producto ${params.productReference} añadido a la tienda ${this.storeUserObj.name}`;
            } else {
              if (params.packingReference) {
                msgSetText = `Producto ${params.productReference} añadido al embalaje ${params.packingReference}`;
              } else {
                msgSetText = `Producto ${params.productReference} añadido a la ubicación ${params.containerReference}`;
              }
            }
            ScanditMatrixSimple.setText(msgSetText, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 18);
            this.hideTextMessage(2000);
          } else if (res.body.code == 428) {
            this.positioningLog(3, "1.4.2.2.2.2", "error 428, stop pause!");
            this.scannerPaused = true;
            ScanditMatrixSimple.showWarningToForce(true, responseScanning.barcode);
          } else {
            this.positioningLog(3, "1.4.2.2.2.3", "error unknown!!!");
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
            this.positioningLog(3, "1.4.2.2.2.4", "error 428, stop pause!");
            this.scannerPaused = true;
            ScanditMatrixSimple.showWarningToForce(true, responseScanning.barcode);
          } else {
            this.positioningLog(3, "1.4.2.2.2.5", "error unknown!!!");
            ScanditMatrixSimple.setText(error.error.errors, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
            this.hideTextMessage(1500);
          }
        }
      );
    }, (error: HttpErrorResponse) => {
      if (error.error.code == 428) {
        this.positioningLog(3, "1.4.2.2.2.6", "error 428, stop pause!");
        this.scannerPaused = true;
        ScanditMatrixSimple.showWarningToForce(true, responseScanning.barcode);
      } else {
        this.positioningLog(3, "1.4.2.2.2.7", "error unknown!!!");
        ScanditMatrixSimple.setText(error.message, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
        this.hideTextMessage(1500);
      }
    });
  }

  picking(pickingId: number, listProducts: ShoesPickingModel.ShoesPicking[], typePacking: number) {
    let processInitiated: boolean = false;
    let jailReference: string = '';
    let lastCarrierScanned: string = '';
    let productsToScan: ShoesPickingModel.ShoesPicking[] = listProducts;
    let productsScanned: string[] = [];
    let lastCodeScanned: string = "start";
    let literalsJailPallet: any = {
      1: {
        not_registered: 'La Jaula escaneada no está registrada en el sistema.',
        process_resumed: 'Para continuar con el proceso de picking escanea la Jaula ',
        process_started: 'Proceso iniciado con la Jaula ',
        process_end_packing: 'Proceso finalizado con la Jaula ',
        process_packing_empty: 'Desasociada del picking la Jaula ',
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
        process_end_packing: 'Proceso finalizado con el Pallet ',
        process_packing_empty: 'Desasociada del picking el Pallet ',
        scan_before_products: 'Escanea el Pallet a utilizar antes de comenzar el proceso.',
        scan_to_end: 'Todos los productos han sido escaneados. Escanea de nuevo el Pallet utilizado para finalizar el proceso.',
        toThe: "al Pallet",
        wrong_packing: 'La herramienta de distribución escaneada no es la que se le solicitó. Escanea un Pallet para comenzar el proceso de picking.',
        wrong_process_finished: 'El Pallet escaneado es diferente al Pallet con el que inició el proceso.'
      }
    };
    let timeLastCodeScanned: number = 0;
    let packingReference: string = '';

    this.clearTimeoutCleanLastCodeScanned();
    this.intervalCleanLastCodeScanned = setInterval(() => {
      if (this.scanditProvider.checkCodeValue(lastCodeScanned) == this.scanditProvider.codeValue.PALLET || this.scanditProvider.checkCodeValue(lastCodeScanned) == this.scanditProvider.codeValue.JAIL) {
        if(Math.abs((new Date().getTime() - timeLastCodeScanned) / 1000) > 4){
          lastCodeScanned = 'start';
        }
      }
    }, 1000);

    ScanditMatrixSimple.init((response) => {
      if (response && response.barcode) {
        let code = response.barcode.data;
        if (code === "P0001") {
          // temporary trick to release potential scanner service logic deadlock
          this.positioningLog(2, "#1", "releasing pause flag!", [this.scannerPaused]);
          this.scannerPaused = false;
          return;
        }
        if (code === "P0002") {
          // temporary trick to release potential scanner service logic deadlock
          this.positioningLog(2, "#2", "forgetting last code scanned!", [this.scannerPaused]);
          lastCodeScanned = "start";
          return;
        }
      }
      this.pickingLog(2, "1", "ScanditMatrixSimple.init((response) => {");
      let code = '';
      if (response.barcode) {
        this.pickingLog(2, "2", "if (response.barcode) {");
        code = response.barcode.data;
      }

      if (code === lastCodeScanned) return;
      lastCodeScanned = code;

      //Check Jail/Pallet or product
      if (!this.scannerPaused && (code.match(/J([0-9]){4}/) || code.match(/P([0-9]){4}/))) {
        this.pickingLog(2, "3", "if (!this.scannerPaused && (code.match(/J([0-9]){4}/) || code.match(/P([0-9]){4}/))) {");
        if (productsToScan.length != 0) {
          this.pickingLog(2, "4", "if (productsToScan.length != 0) {");
          let typePackingScanned = 0;
          if (code.match(/J([0-9]){4}/)) {
            this.pickingLog(2, "5", "if (code.match(/J([0-9]){4}/)) {");
            typePackingScanned = 1;
          } else {
            this.pickingLog(2, "6", "} else {");
            typePackingScanned = 2;
          }

          if ((packingReference && packingReference == code) || !packingReference) {
            timeLastCodeScanned = new Date().getTime();
            lastCarrierScanned = code;
            this.pickingLog(2, "7", "if ((packingReference && packingReference == code) || !packingReference) {");
            if (typePackingScanned == typePacking) {
              this.pickingLog(2, "8", "if (typePackingScanned == typePacking) {");
              this.postVerifyPacking({
                status: 2,
                pickingId: pickingId,
                packingReference: code
              })
                .subscribe((res) => {
                  this.pickingLog(2, "9", ".subscribe((res) => {");
                  if (code.match(/J([0-9]){4}/)) {
                    this.pickingLog(2, "10", "if (code.match(/J([0-9]){4}/)) {");
                    typePacking = 1;
                  } else {
                    this.pickingLog(2, "11", "} else {");
                    typePacking = 2;
                  }
                  if(res){
                    if (res.code == 200 || res.code == 201) {
                      if(res.data.packingStatus == 2){
                        processInitiated = true;
                        jailReference = code;
                        packingReference = code;
                        ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
                        ScanditMatrixSimple.setText(`${literalsJailPallet[typePacking].process_started}${jailReference}.`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
                        this.hideTextMessage(2000);
                        ScanditMatrixSimple.showTextStartScanPacking(false, typePacking, '');
                      } else if(res.data.packingStatus == 3){
                        processInitiated = false;
                        packingReference = code;
                        packingReference = '';
                        ScanditMatrixSimple.showNexProductToScan(false);
                        ScanditMatrixSimple.setText(`${literalsJailPallet[typePacking].process_end_packing}${code}.`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
                        this.hideTextMessage(2000);
                        ScanditMatrixSimple.showTextStartScanPacking(true, typePacking, '');
                      } else {
                        processInitiated = false;
                        console.error('Error Subscribe::Check Packing Reference::', res);
                        ScanditMatrixSimple.setText(
                          res.message,
                          this.scanditProvider.colorsMessage.error.color,
                          this.scanditProvider.colorText.color,
                          16);
                        this.hideTextMessage(1500);
                      }
                    } else {
                      processInitiated = false;
                      console.error('Error Subscribe::Check Packing Reference::', res);
                      ScanditMatrixSimple.setText(
                        res.message,
                        this.scanditProvider.colorsMessage.error.color,
                        this.scanditProvider.colorText.color,
                        16);
                      this.hideTextMessage(1500);
                    }
                  } else {
                    processInitiated = false;
                    packingReference = '';
                    ScanditMatrixSimple.showNexProductToScan(false);
                    ScanditMatrixSimple.setText(`${literalsJailPallet[typePacking].process_packing_empty}${code}.`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
                    ScanditMatrixSimple.showTextStartScanPacking(true, typePacking, '');
                    this.hideTextMessage(2000);
                  }
                }, (error) => {
                  this.pickingLog(2, "13", "}, (error) => {");
                  if (error.error.code == 404) {
                    this.pickingLog(2, "14", "if (error.error.code == 404) {");
                    ScanditMatrixSimple.setText(literalsJailPallet[typePacking].not_registered, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                    this.hideTextMessage(2000);
                  } else {
                    this.pickingLog(2, "15", "} else {");
                    ScanditMatrixSimple.setText(error.error.errors, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                    this.hideTextMessage(2000);
                  }
                });
            } else {
              this.pickingLog(2, "16", "} else {");
              ScanditMatrixSimple.setText(literalsJailPallet[typePacking].wrong_packing, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
              this.hideTextMessage(2000);
            }
          } else {
            this.pickingLog(2, "17", "} else {");
            ScanditMatrixSimple.setText(`${literalsJailPallet[typePacking].process_resumed}${packingReference}.`, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
            this.hideTextMessage(2000);
          }
        } else if (jailReference && jailReference != code) {
          this.pickingLog(2, "19", "} else if (jailReference != code) {");
          ScanditMatrixSimple.setText(literalsJailPallet[typePacking].wrong_process_finished, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
          this.hideTextMessage(2000);
        } else {
          this.pickingLog(2, "20", "} else {");
          // lock scanner in order to avoid double jail or pallet reading, requesting the server twice and thus sending two dispatchnote to Avelon
          this.scannerPaused = true;
          const scanUnlockTimeout = setTimeout(() => { this.scannerPaused = false; }, 10 * 1000);
          try {
            this.postVerifyPacking({
              status: 3,
              pickingId: pickingId,
              packingReference: code
            })
              .subscribe((res) => {
                this.pickingLog(2, "21", ".subscribe((res) => {");
                ScanditMatrixSimple.setText('Proceso finalizado correctamente.', BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 18);
                this.hideTextMessage(1500);
                ScanditMatrixSimple.showTextEndScanPacking(false, typePacking, jailReference ? jailReference : lastCarrierScanned);
                this.clearTimeoutCleanLastCodeScanned();
                setTimeout(() => {
                  this.pickingLog(2, "22", "setTimeout(() => {");
                  ScanditMatrixSimple.finish();
                  this.events.publish('picking:remove');
                }, 1.5 * 1000);
              }, (error) => {
                this.pickingLog(2, "23", "}, (error) => {");
                this.scannerPaused = false;
                clearTimeout(scanUnlockTimeout);
                this.clearTimeoutCleanLastCodeScanned();
                if (error.error.code == 404) {
                  this.pickingLog(2, "24", "if (error.error.code == 404) {");
                  ScanditMatrixSimple.setText(literalsJailPallet[typePacking].not_registered, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                  this.hideTextMessage(2000);
                } else {
                  this.pickingLog(2, "25", "} else {");
                  ScanditMatrixSimple.setText(error.error.errors, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 16);
                  this.hideTextMessage(2000);
                }
              });
          } catch (e) {
            this.scannerPaused = false;
            clearTimeout(scanUnlockTimeout);
            this.clearTimeoutCleanLastCodeScanned();
            throw e;
          }
        }
      } else if (this.scanditProvider.checkCodeValue(code) == this.scanditProvider.codeValue.PRODUCT && !this.scannerPaused && code) {
        this.pickingLog(2, "26", "} else if (!this.scannerPaused && code && code != '' && code != lastCodeScanned) {");
        if (!processInitiated) {
          this.pickingLog(2, "27", "if (!processInitiated) {");
          ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_before_products, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
          this.hideTextMessage(2000);
        } else {
          this.pickingLog(2, "28", "} else {");
          if (productsToScan.length > 0) {
            this.pickingLog(2, "29", "if (productsToScan.length > 0) {");
            let picking: InventoryModel.Picking = {
              packingReference: jailReference,
              packingType: typePacking,
              pikingId: pickingId,
              productReference: code
            };
            this.inventoryService
              .postPicking(picking)
              .subscribe((res: InventoryModel.ResponsePicking) => {
                this.pickingLog(2, "31", ".subscribe((res: InventoryModel.ResponsePicking) => {");
                if (res.code == 200 || res.code == 201) {
                  this.pickingLog(2, "32", "if (res.code == 200 || res.code == 201) {");
                  productsToScan = res.data.shoePickingPending;
                  productsScanned.push(code);
                  ScanditMatrixSimple.setText(`Producto ${code} escaneado y añadido ${literalsJailPallet[typePacking].toThe}.`, BACKGROUND_COLOR_INFO, TEXT_COLOR, 18);
                  this.hideTextMessage(2000);
                  if (productsToScan.length > 0) {
                    this.pickingLog(2, "33", "if (productsToScan.length > 0) {");
                    ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
                  } else {
                    this.pickingLog(2, "34", "} else {");
                    ScanditMatrixSimple.showNexProductToScan(false);
                    setTimeout(() => {
                      this.pickingLog(2, "35", "setTimeout(() => {");
                      ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference ? jailReference : lastCarrierScanned);
                      ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_to_end, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
                      this.hideTextMessage(1500);
                    }, 2 * 1000);
                  }
                } else {
                  this.pickingLog(2, "36", "} else {");
                  ScanditMatrixSimple.setText(res.message, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
                  this.hideTextMessage(2000);
                  this.getPendingListByPicking(pickingId)
                    .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                      this.pickingLog(2, "37", ".subscribe((res: ShoesPickingModel.ResponseListByPicking) => {");
                      if (res.code == 200 || res.code == 201) {
                        this.pickingLog(2, "38", "if (res.code == 200 || res.code == 201) {");
                        productsToScan = res.data;
                        if (productsToScan.length > 0) {
                          this.pickingLog(2, "39", "if (productsToScan.length > 0) {");
                          ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
                        } else {
                          this.pickingLog(2, "40", "} else {");
                          ScanditMatrixSimple.showNexProductToScan(false);
                          setTimeout(() => {
                            this.pickingLog(2, "41", "setTimeout(() => {");
                            ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference ? jailReference : lastCarrierScanned);
                            ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_to_end, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
                            this.hideTextMessage(1500);
                          }, 2 * 1000);
                        }
                      }
                    });
                }
              }, (error) => {
                this.pickingLog(2, "42", "}, (error) => {");
                ScanditMatrixSimple.setText(error.error.errors, BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
                this.hideTextMessage(2000);
                this.getPendingListByPicking(pickingId)
                  .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                    this.pickingLog(2, "43", ".subscribe((res: ShoesPickingModel.ResponseListByPicking) => {");
                    if (res.code == 200 || res.code == 201) {
                      this.pickingLog(2, "44", "if (res.code == 200 || res.code == 201) {");
                      productsToScan = res.data;
                      if (productsToScan.length > 0) {
                        this.pickingLog(2, "45", "if (productsToScan.length > 0) {");
                        ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
                      } else {
                        this.pickingLog(2, "46", "} else {");
                        ScanditMatrixSimple.showNexProductToScan(false);
                        setTimeout(() => {
                          this.pickingLog(2, "47", "setTimeout(() => {");
                          ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference ? jailReference : lastCarrierScanned);
                          ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_to_end, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
                          this.hideTextMessage(1500);
                        }, 2 * 1000);
                      }

                    }
                  });
              });
          } else {
            this.pickingLog(2, "48", "} else {");
            ScanditMatrixSimple.showNexProductToScan(false);
            ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference ? jailReference : lastCarrierScanned);
            ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_to_end, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
            this.hideTextMessage(1500);
          }
        }
      } else if (this.scanContainerToNotFound && !response.action) {
        if ((this.scanditProvider.checkCodeValue(code) == this.scanditProvider.codeValue.CONTAINER || this.scanditProvider.checkCodeValue(code) == this.scanditProvider.codeValue.CONTAINER_OLD)) {
          this.postCheckContainerProduct(code, productsToScan[0].inventory.id)
            .subscribe((res: InventoryModel.ResponseCheckContainer) => {
              if (res.code == 200) {
                let productNotFoundId = productsToScan[0].product.id;
                this.putProductNotFound(pickingId, productNotFoundId)
                  .subscribe((res: ShoesPickingModel.ResponseProductNotFound) => {
                    this.pickingLog(2, "52", ".subscribe((res: ShoesPickingModel.ResponseProductNotFound) => {");
                    if (res.code == 200 || res.code == 201) {
                      this.pickingLog(2, "53", "if (res.code == 200 || res.code == 201) {");
                      this.scanContainerToNotFound = null;
                      ScanditMatrixSimple.showFixedTextBottom(false, this.scanContainerToNotFound);
                      ScanditMatrixSimple.setText('El producto ha sido reportado como no encontrado.', BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
                      this.hideTextMessage(1500);
                      this.getPendingListByPicking(pickingId)
                        .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                          this.pickingLog(2, "54", ".subscribe((res: ShoesPickingModel.ResponseListByPicking) => {");
                          if (res.code == 200 || res.code == 201) {
                            this.pickingLog(2, "55", "if (res.code == 200 || res.code == 201) {");
                            productsToScan = res.data;
                            if (productsToScan.length > 0) {
                              this.pickingLog(2, "56", "if (productsToScan.length > 0) {");
                              ScanditMatrixSimple.setNexProductToScan(productsToScan[0], HEADER_BACKGROUND, HEADER_COLOR);
                            } else {
                              this.pickingLog(2, "57", "} else {");
                              ScanditMatrixSimple.showNexProductToScan(false);
                              setTimeout(() => {
                                this.pickingLog(2, "58", "setTimeout(() => {");
                                ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference ? jailReference : lastCarrierScanned);
                                ScanditMatrixSimple.setText(literalsJailPallet[typePacking].scan_to_end, BACKGROUND_COLOR_SUCCESS, TEXT_COLOR, 16);
                                this.hideTextMessage(1500);
                              }, 2 * 1000);
                            }

                          }
                        });
                    } else {
                      this.pickingLog(2, "59", "} else {");
                      ScanditMatrixSimple.setText('Ha ocurrido un error al intentar reportar el producto como no encontrado.', BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
                      this.hideTextMessage(2000);
                    }
                  }, error => {
                    this.pickingLog(2, "60", "}, error => {");
                    ScanditMatrixSimple.setText('Ha ocurrido un error al intentar reportar el producto como no encontrado.', BACKGROUND_COLOR_ERROR, TEXT_COLOR, 18);
                    this.hideTextMessage(2000);
                  });
              } else {
                ScanditMatrixSimple.setText('El código escaneado no corresponde a la ubicación del producto.', this.scanditProvider.colorsMessage.error.color, this.scanditProvider.colorText.color, 16);
                this.hideTextMessage(1500);
              }
            }, (error) => {
              console.error('Error::Subscribe::CheckContainerProduct -> ', error);
              ScanditMatrixSimple.setText('El código escaneado no corresponde a la ubicación del producto.', this.scanditProvider.colorsMessage.error.color, this.scanditProvider.colorText.color, 16);
              this.hideTextMessage(1500);
            });
        } else {
          ScanditMatrixSimple.setText('El código escaneado no corresponde a la ubicación del producto.', this.scanditProvider.colorsMessage.error.color, this.scanditProvider.colorText.color, 16);
          this.hideTextMessage(1500);
        }
      } else {
        this.pickingLog(2, "49", "} else {");
        if (response.action == 'product_not_found') {
          this.pickingLog(2, "50", "if (response.action == 'product_not_found') {");
          this.scannerPaused = false;
          if (response.found) {
            this.pickingLog(2, "51", "if (response.found) {");
            this.scanContainerToNotFound = "Escanea la ubicación que estás revisando para comprobar que sea la correcta. Escanea el producto si lo encuentra.";
            ScanditMatrixSimple.showFixedTextBottom(true, this.scanContainerToNotFound);
          } else {
            this.scanContainerToNotFound = null;
            ScanditMatrixSimple.showFixedTextBottom(false, this.scanContainerToNotFound);
          }
        } else if (response.action == 'warning_product_not_found') {
          this.pickingLog(2, "61", "} else if (response.action == 'warning_product_not_found') {");
          this.scannerPaused = true;
        } else if (response.action == 'matrix_simple') {
          this.pickingLog(2, "62", "} else if (response.action == 'matrix_simple') {");
          if (productsToScan.length > 0) {
            this.pickingLog(2, "63", "if (productsToScan.length > 0) {");
            ScanditMatrixSimple.showTextStartScanPacking(true, typePacking, packingReference || '');
          } else {
            this.pickingLog(2, "64", "} else {");
            jailReference = packingReference;
            processInitiated = true;
            ScanditMatrixSimple.showTextEndScanPacking(true, typePacking, jailReference ? jailReference : lastCarrierScanned);
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

  private postVerifyPacking(packing) : Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<any>(this.postVerifyPackingUrl, packing, { headers });
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

  private postCheckContainerProduct(containerReference: string, inventoryId: number) : Observable<InventoryModel.ResponseCheckContainer> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      let params: InventoryModel.ParamsCheckContainer = { inventoryId, containerReference };

      return this.http.post<InventoryModel.ResponseCheckContainer>(this.postCheckContainerProductUrl, params, { headers });
    }));
  }

  positioningLog(type: 1|2|3, index, message, ...params: any[]) {
    params = params || [];
    params.unshift(type, "positioning", index, message);
    this.scannerLog.apply(this, params);
  }

  pickingLog(type: 1|2|3, index, message, ...params: any[]) {
    params = params || [];
    params.unshift(type, "picking", index, message);
    this.scannerLog.apply(this, params);
  }

  scannerLog(type: 1|2|3, operation, index, message, ...params: any[]) {
    params = params || [];
    params.unshift("positioning log", "\t" + index + "\t" + message);
    var logFunction = type === 3 ? console.error : (type === 2 ? console.warn : console.log);
    logFunction.apply(console, params);
  }

  private clearTimeoutCleanLastCodeScanned(){
    if(this.intervalCleanLastCodeScanned){
      clearTimeout(this.intervalCleanLastCodeScanned);
      this.intervalCleanLastCodeScanned = null;
    }
  }

}
