import {Component, OnInit} from '@angular/core';
import {WarehouseService} from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import {from, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  AuthenticationService,
  environment,
  InventoryModel,
  InventoryService,
  IntermediaryService,
  CarrierService
} from '@suite/services';
import {AlertController, Events, ToastController} from "@ionic/angular";
import {ShoesPickingModel} from "../../../../services/src/models/endpoints/ShoesPicking";
import {switchMap} from "rxjs/operators";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";
import {Location} from "@angular/common";
import {ItemReferencesProvider} from "../../../../services/src/providers/item-references/item-references.provider";
import {environment as al_environment} from "../../../../../apps/al/src/environments/environment";
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {KeyboardService} from "../../../../services/src/lib/keyboard/keyboard.service";
import { CarrierModel } from '../../../../services/src/models/endpoints/carrier.model';

@Component({
  selector: 'suite-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  dataToWrite: string = 'CONTENEDOR';
  containerReference: string = null;
  inputPicking: string = null;
  scanJail: string = null;
  nexProduct: ShoesPickingModel.ShoesPicking = null;

  pickingId: number;
  listProducts: ShoesPickingModel.ShoesPicking[];
  typePacking: number;
  typePicking: number;
  packingReference: string = null;
  processInitiated: boolean = false;
  jailReference: string = null;
  lastCodeScanned: string = 'start';
  lastCarrierScanned: string = '';
  timeLastCodeScanned: number = 0;
  productsScanned: string[] = [];
  literalsJailPallet: any = null;
  scanContainerToNotFound: string = null;
  intervalCleanLastCodeScanned = null;

  private postVerifyPackingUrl = environment.apiBase+"/processes/picking-main/packing";
  private getPendingListByPickingUrl = environment.apiBase+"/processes/picking-main/shoes/{{id}}/pending";
  private putProductNotFoundUrl = environment.apiBase+"/processes/picking-main/shoes/{{workWaveOrderId}}/product-not-found/{{productId}}";
  private postCheckContainerProductUrl = environment.apiBase + "/inventory/check-container";

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private location: Location,
    private events: Events,
    private toastController: ToastController,
    private alertController: AlertController,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private pickingProvider: PickingProvider,
    private itemReferencesProvider: ItemReferencesProvider,
    private intermediaryService: IntermediaryService,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
    private carrierService: CarrierService,
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    this.focusToInput();
  }

  ngOnInit() {
    this.pickingId = this.pickingProvider.pickingId;
    this.listProducts = this.pickingProvider.listProducts;
    this.typePacking = this.pickingProvider.typePacking;
    this.typePicking = this.pickingProvider.typePicking;
    this.packingReference = this.pickingProvider.packingReference;
    this.literalsJailPallet = this.pickingProvider.literalsJailPallet;

    this.clearTimeoutCleanLastCodeScanned();
    this.intervalCleanLastCodeScanned = setInterval(() => {
      if (this.itemReferencesProvider.checkCodeValue(this.lastCodeScanned) == this.itemReferencesProvider.codeValue.PACKING) {
        if(Math.abs((new Date().getTime() - this.timeLastCodeScanned) / 1000) > 4){
          this.lastCodeScanned = 'start';
        }
      }
    }, 1000);

    if (this.listProducts.length > 0) {
      this.showTextStartScanPacking(true, this.typePacking, this.packingReference || '');
    } else {
      if(this.lastCarrierScanned) this.packingReference = this.lastCarrierScanned;
      this.jailReference = this.packingReference;
      this.processInitiated = true;
      this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
    }
  }

  keyUpInput(event) {
    let dataWrited = (this.inputPicking || "").trim();

    if (event.keyCode == 13 && dataWrited) {

      if (dataWrited === this.lastCodeScanned) {
        this.inputPicking = null;
        return;
      }
      this.lastCodeScanned = dataWrited;

      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      this.inputPicking = null;
      if (this.itemReferencesProvider.checkCodeValue(dataWrited) == this.itemReferencesProvider.codeValue.PACKING) {
        if (this.listProducts.length != 0) {
          let typePackingScanned = 0;
          if (this.itemReferencesProvider.checkSpecificCodeValue(dataWrited, this.itemReferencesProvider.codeValue.JAIL)) {
            typePackingScanned = 1;
          } else if (this.itemReferencesProvider.checkSpecificCodeValue(dataWrited, this.itemReferencesProvider.codeValue.PALLET)) {
            typePackingScanned = 2;
          } else {
            typePackingScanned = 3;
          }

          if ((this.packingReference && this.packingReference == dataWrited) || !this.packingReference) {
            this.timeLastCodeScanned = new Date().getTime();
            this.lastCarrierScanned = dataWrited;
            if ((this.typePacking && typePackingScanned == this.typePacking) || !this.typePacking) {
              this.intermediaryService.presentLoading();
              this.postVerifyPacking({
                status: 2,
                pickingId: this.pickingId,
                packingReference: dataWrited
              })
                .subscribe((res) => {
                  this.intermediaryService.dismissLoading();
                  if (this.itemReferencesProvider.checkSpecificCodeValue(dataWrited, this.itemReferencesProvider.codeValue.JAIL)) {
                    this.typePacking = 1;
                  } else if (this.itemReferencesProvider.checkSpecificCodeValue(dataWrited, this.itemReferencesProvider.codeValue.PALLET)) {
                    this.typePacking = 2;
                  } else {
                    this.typePacking = 3;
                  }
                  if (res) {
                    if (res.code == 200 || res.code == 201) {
                      if (res.data.packingStatus == 2) {
                        this.processInitiated = true;
                        this.audioProvider.playDefaultOk();
                        this.inputPicking = null;
                        this.focusToInput();
                        this.jailReference = dataWrited;
                        this.dataToWrite = 'PRODUCTO';
                        if (!this.packingReference) {
                          this.packingReference = this.jailReference;
                        }
                        this.setNexProductToScan(this.listProducts[0]);
                        this.presentToast(`${this.literalsJailPallet[this.typePacking].process_started}${this.jailReference}.`, 2000, this.pickingProvider.colorsMessage.info.name);
                        this.showTextStartScanPacking(false, this.typePacking, '');
                      } else if (res.data.packingStatus == 3) {
                        this.processInitiated = false;
                        this.audioProvider.playDefaultOk();
                        this.inputPicking = null;
                        this.focusToInput();
                        this.jailReference = null;
                        this.dataToWrite = 'CONTENEDOR';
                        this.packingReference = this.jailReference;
                        this.presentToast(`${this.literalsJailPallet[this.typePacking].process_end_packing}${dataWrited}.`, 2000, this.pickingProvider.colorsMessage.info.name);
                        this.showNexProductToScan(false);
                        this.showTextStartScanPacking(true, this.typePacking, '');
                      } else {
                        this.processInitiated = false;
                        this.audioProvider.playDefaultError();
                        this.inputPicking = null;
                        this.focusToInput();
                        this.presentToast(this.literalsJailPallet[this.typePacking].not_registered, 2000, this.pickingProvider.colorsMessage.error.name);
                      }
                    } else {
                      this.processInitiated = false;
                      this.audioProvider.playDefaultError();
                      this.inputPicking = null;
                      this.focusToInput();
                      this.presentToast(this.literalsJailPallet[this.typePacking].not_registered, 2000, this.pickingProvider.colorsMessage.error.name);
                    }
                  } else {
                    this.audioProvider.playDefaultOk();
                    this.processInitiated = false;
                    this.inputPicking = null;
                    this.focusToInput();
                    this.jailReference = null;
                    this.dataToWrite = 'CONTENEDOR';
                    this.packingReference = this.jailReference;
                    this.presentToast(`${this.literalsJailPallet[this.typePacking].process_packing_empty}${dataWrited}.`, 2000, this.pickingProvider.colorsMessage.info.name);
                    this.showNexProductToScan(false);
                    this.showTextStartScanPacking(true, this.typePacking, '');
                  }
                }, (error) => {
                  this.inputPicking = null;
                  this.intermediaryService.dismissLoading();
                  this.audioProvider.playDefaultError();
                  if (error.error.code == 404) {
                    this.presentToast(this.literalsJailPallet[this.typePacking].not_registered, 2000, this.pickingProvider.colorsMessage.error.name);
                  } else {
                    this.presentToast(error.error.errors, 2000, this.pickingProvider.colorsMessage.error.name);
                  }
                  this.focusToInput();
                }, () => {
                  this.intermediaryService.dismissLoading();
                });
            } else {
              this.inputPicking = null;
              this.audioProvider.playDefaultError();
              this.focusToInput();
              this.presentToast(this.literalsJailPallet[this.typePacking].wrong_packing, 2000, this.pickingProvider.colorsMessage.error.name);
            }
          } else {
            this.inputPicking = null;
            this.audioProvider.playDefaultError();
            this.focusToInput();
            this.presentToast(`${this.literalsJailPallet[this.typePacking].process_resumed}${this.packingReference}.`, 2000, this.pickingProvider.colorsMessage.error.name);
          }
        } else if (this.jailReference && this.jailReference != dataWrited) {
          this.inputPicking = null;
          this.audioProvider.playDefaultError();
          this.focusToInput();
          this.presentToast(this.literalsJailPallet[this.typePacking].wrong_process_finished, 2000, this.pickingProvider.colorsMessage.error.name);
        } else {
          this.alertSealPacking(this.jailReference);
        }
      } else if (this.itemReferencesProvider.checkCodeValue(dataWrited) == this.itemReferencesProvider.codeValue.PRODUCT) {
        if (!this.processInitiated) {
          this.audioProvider.playDefaultError();
          this.inputPicking = null;
          this.focusToInput();
          this.presentToast(this.literalsJailPallet[this.typePacking].scan_before_products, 2000, this.pickingProvider.colorsMessage.error.name);
        } else {
          if (this.listProducts.length > 0) {
            let picking: InventoryModel.Picking = {
              packingReference: this.jailReference,
              packingType: this.typePacking,
              pikingId: this.pickingId,
              productReference: dataWrited
            };
            this.intermediaryService.presentLoading();
            let subscribeResponse = (res: InventoryModel.ResponsePicking) => {
              this.intermediaryService.dismissLoading();
              if (res.code == 200 || res.code == 201) {
                this.audioProvider.playDefaultOk();
                this.listProducts = res.data.shoePickingPending;
                this.productsScanned.push(dataWrited);
                this.inputPicking = null;
                this.focusToInput();
                this.presentToast(`Producto ${dataWrited} escaneado y añadido ${this.literalsJailPallet[this.typePacking].toThe}.`, 2000, this.pickingProvider.colorsMessage.info.name);
                if (this.listProducts.length > 0) {
                  this.setNexProductToScan(this.listProducts[0]);
                } else {
                  this.showNexProductToScan(false);
                  setTimeout(() => {
                    this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                    this.dataToWrite = 'CONTENEDOR';
                    this.presentToast(this.literalsJailPallet[this.typePacking].scan_to_end, 1500, this.pickingProvider.colorsMessage.success.name);
                  }, 2 * 1000);
                }
              } else {
                this.audioProvider.playDefaultError();
                this.inputPicking = null;
                this.focusToInput();
                this.presentToast(res.errors, 2000, this.pickingProvider.colorsMessage.error.name);
                this.getPendingListByPicking(this.pickingId)
                  .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                    if (res.code == 200 || res.code == 201) {
                      this.listProducts = res.data;
                      if (this.listProducts.length > 0) {
                        this.setNexProductToScan(this.listProducts[0]);
                      } else {
                        this.showNexProductToScan(false);
                        setTimeout(() => {
                          this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                          this.dataToWrite = 'CONTENEDOR';
                          this.presentToast(this.literalsJailPallet[this.typePacking].scan_to_end, 1500, this.pickingProvider.colorsMessage.success.name);
                        }, 2 * 1000);
                      }
                    }
                  });
              }
            };
            let subscribeError = (error) => {
              this.audioProvider.playDefaultError();
              this.intermediaryService.dismissLoading();
              this.inputPicking = null;
              this.focusToInput();
              this.presentToast(error.error.errors, 2000, this.pickingProvider.colorsMessage.error.name);
              this.getPendingListByPicking(this.pickingId)
                .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                  if (res.code == 200 || res.code == 201) {
                    this.listProducts = res.data;
                    if (this.listProducts.length > 0) {
                      this.setNexProductToScan(this.listProducts[0]);
                    } else {
                      this.showNexProductToScan(false);
                      setTimeout(() => {
                        this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                        this.dataToWrite = 'CONTENEDOR';
                        this.presentToast(this.literalsJailPallet[this.typePacking].scan_to_end, 1500, this.pickingProvider.colorsMessage.success.name);
                      }, 2 * 1000);
                    }
                  }
                });
            };

            if (this.typePicking == 1) {
              this.inventoryService.postPickingDirect(picking).then(subscribeResponse, subscribeError).catch(subscribeError);
            } else if (this.typePicking == 2) {
              this.inventoryService.postPickingConsolidated(picking).then(subscribeResponse, subscribeError).catch(subscribeError);
            } else {
              this.inventoryService.postPickingOnlineStore(picking).then(subscribeResponse, subscribeError).catch(subscribeError);
            }
          } else {
            this.inputPicking = null;
            this.audioProvider.playDefaultOk();
            this.focusToInput();
            this.showNexProductToScan(false);
            this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
            this.dataToWrite = 'CONTENEDOR';
            this.presentToast(this.literalsJailPallet[this.typePacking].scan_to_end, 1500, this.pickingProvider.colorsMessage.success.name);
          }
        }
      } else if (this.scanContainerToNotFound) {
        if (this.itemReferencesProvider.checkCodeValue(dataWrited) == this.itemReferencesProvider.codeValue.CONTAINER
          || this.itemReferencesProvider.checkCodeValue(dataWrited) == this.itemReferencesProvider.codeValue.CONTAINER_OLD) {
          this.intermediaryService.presentLoading();
          this.postCheckContainerProduct(dataWrited, this.nexProduct.inventory.id)
            .subscribe((res: InventoryModel.ResponseCheckContainer) => {
              this.intermediaryService.dismissLoading();
              if (res.code == 200) {
                this.audioProvider.playDefaultOk();
                let productNotFoundId = this.nexProduct.product.id;
                this.putProductNotFound(this.pickingId, productNotFoundId)
                  .subscribe((res: ShoesPickingModel.ResponseProductNotFound) => {
                    if (res.code == 200 || res.code == 201) {
                      this.scanContainerToNotFound = null;
                      this.dataToWrite = "PRODUCTO";
                      this.focusToInput();

                      this.presentToast('El producto ha sido reportado como no encontrado', 1500, this.pickingProvider.colorsMessage.success.name);
                      this.getPendingListByPicking(this.pickingId)
                        .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                          if (res.code == 200 || res.code == 201) {
                            this.listProducts = res.data;
                            if (this.listProducts.length > 0) {
                              this.setNexProductToScan(this.listProducts[0]);
                            } else {
                              this.showNexProductToScan(false);
                              setTimeout(() => {
                                this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                                this.dataToWrite = 'CONTENEDOR';
                                this.presentToast(this.literalsJailPallet[this.typePacking].scan_to_end, 1500, this.pickingProvider.colorsMessage.success.name);
                              }, 2 * 1000);
                            }
                          }
                        });
                    } else {
                      this.audioProvider.playDefaultError();
                      this.focusToInput();
                      this.presentToast('Ha ocurrido un error al intentar reportar el producto como no encontrado.', 2000, this.pickingProvider.colorsMessage.error.name);
                    }
                  }, error => {
                    this.audioProvider.playDefaultError();
                    this.focusToInput();
                    this.presentToast('Ha ocurrido un error al intentar reportar el producto como no encontrado.', 2000, this.pickingProvider.colorsMessage.error.name);
                  });
              } else {
                this.audioProvider.playDefaultError();
                this.focusToInput();
                this.presentToast('El código escaneado no corresponde a la ubicación del producto.', 2000, this.pickingProvider.colorsMessage.error.name);
              }
            }, (error) => {
              this.intermediaryService.dismissLoading();
              console.error('Error::Subscribe::CheckContainerProduct -> ', error);
              this.audioProvider.playDefaultError();
              this.focusToInput();
              this.presentToast('El código escaneado no corresponde a la ubicación del producto.', 2000, this.pickingProvider.colorsMessage.error.name);
            }, () => {
              this.intermediaryService.dismissLoading();
            });
        } else {
          this.focusToInput();
          this.audioProvider.playDefaultError();
          this.presentToast('El código escaneado no corresponde a la ubicación del producto.', 2000, this.pickingProvider.colorsMessage.error.name);
        }
      } else {
        if (this.processInitiated) {
          this.inputPicking = null;
          this.focusToInput();
        } else {
          this.inputPicking = null;
          this.audioProvider.playDefaultError();
          this.focusToInput();
          this.presentToast('Referencia errónea', 1500, this.pickingProvider.colorsMessage.error.name);
        }
      }
    }
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

  private setNexProductToScan(nextProduct: ShoesPickingModel.ShoesPicking) {
    this.nexProduct = nextProduct;
  }

  private showNexProductToScan(show: boolean) {
    if (show) {

    } else {
      this.nexProduct = null;
    }
  }

  private showTextStartScanPacking(show: boolean, typePacking: number, packingReference?: string) {
    if (show) {
      if (packingReference) {
        if (typePacking == 1) {
          this.scanJail = "Escanea la Jaula " + packingReference + " para continuar con el proceso de picking ya iniciado.";
        } else {
          this.scanJail = "Escanea el Pallet " + packingReference + " para continuar con el proceso de picking ya iniciado.";
        }
      } else {
        this.scanJail = "Escanea un embalaje para dar comienzo al proceso de picking.";
      }
    } else {
      this.scanJail = null;
    }
  }

  private showTextEndScanPacking(show: boolean, typePacking: number, packingReference: string) {
    if (show) {
      if(packingReference){
        if (typePacking == 1) {
          this.scanJail = "Escanea la Jaula " + packingReference + " para finalizar el proceso de picking.";
        } else {
          this.scanJail = "Escanea el Pallet " + packingReference + " para finalizar el proceso de picking.";
        }
      } else {
        if (typePacking == 1) {
          this.scanJail = "Escanea la Jaula para finalizar el proceso de picking.";
        } else {
          this.scanJail = "Escanea el Pallet para finalizar el proceso de picking.";
        }
      }

    } else {
      this.scanJail = null;
    }
  }

  oldReference(inventory: ShoesPickingModel.Inventory) {
    let alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    return 'P' + inventory.rack.hall.toString().padStart(2, '0')
      + alphabet[inventory.container.row-1]
      + inventory.container.column.toString().padStart(2, '0');
  }

  async productNotFound() {
    const alertWarning = await this.alertController.create({
      header: 'Atención',
      message: '¿Está seguro de querer reportar como no encontrado el producto <b>'+this.nexProduct.product.model.reference+'</b> en la ubicación <b>'+this.nexProduct.inventory.container.reference+'</b>?<br/>(tendrá que escanear la ubicación para confirmar el reporte).',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            this.audioProvider.playDefaultError();
            this.scanContainerToNotFound = null;
            this.dataToWrite = "PRODUCTO";
          }
        },
        {
          text: 'Reportar',
          handler: () => {
            this.audioProvider.playDefaultOk();
            this.scanContainerToNotFound = "Escanea la ubicación que estás revisando para comprobar que sea la correcta. Escanea el producto si lo encuentra.";
            this.dataToWrite = "UBICACIÓN";
          }
        }]
    });

    return await alertWarning.present();
  }

  async alertSealPacking(packingReference: string) {
    const alertWarning = await this.alertController.create({
      header: 'Atención',
      message: packingReference ? `¿Desea precintar la Jaula ${packingReference}?` : '¿Desea precintar la Jaula?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.endProcessPacking(packingReference);
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.sealPacking(packingReference);
          }
        }]
    });

    return await alertWarning.present();
  }

  private sealPacking(packingReference: any) {
    if (packingReference && packingReference.length > 0) {
      this.intermediaryService.presentLoading('Precintando Embalaje/s');
      this.carrierService.postSealList(packingReference).subscribe(async () => {
        this.endProcessPacking(packingReference);
      });
    }
  }

  private endProcessPacking(packingReference: any) {
    this.postVerifyPacking({
      status: 3,
      pickingId: this.pickingId,
      packingReference: packingReference
    })
      .subscribe((res) => {
        this.audioProvider.playDefaultOk();
        this.intermediaryService.dismissLoading();
        this.inputPicking = null;
        this.presentToast('Proceso finalizado correctamente.', 1500, this.pickingProvider.colorsMessage.success.name);
        this.showTextEndScanPacking(false, this.typePacking, this.jailReference);
        this.clearTimeoutCleanLastCodeScanned();
        setTimeout(() => {
          this.location.back();
          this.events.publish('picking:remove');
        }, 1.5 * 1000);
      }, (error) => {
        this.intermediaryService.dismissLoading();
        this.audioProvider.playDefaultError();
        this.inputPicking = null;
        this.focusToInput();
        this.clearTimeoutCleanLastCodeScanned();
        if (error.error.code == 404) {
          this.presentToast(this.literalsJailPallet[this.typePacking].not_registered, 2000, this.pickingProvider.colorsMessage.error.name);
        } else {
          this.presentToast(error.error.errors, 2000, this.pickingProvider.colorsMessage.error.name);
        }
      }, () => {
        this.intermediaryService.dismissLoading();
      });
  }

  private async presentToast(msg: string, duration: number = 2000, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: duration,
      color: color
    });

    toast.present();
  }

  private clearTimeoutCleanLastCodeScanned(){
    if(this.intervalCleanLastCodeScanned){
      clearTimeout(this.intervalCleanLastCodeScanned);
      this.intervalCleanLastCodeScanned = null;
    }
  }

  private focusToInput() {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }
}
