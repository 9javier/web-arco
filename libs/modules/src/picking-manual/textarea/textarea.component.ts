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
import {AlertController, Events, ModalController} from "@ionic/angular";
import {ShoesPickingModel} from "../../../../services/src/models/endpoints/ShoesPicking";
import {switchMap, map, filter} from "rxjs/operators";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";
import {Location} from "@angular/common";
import {ItemReferencesProvider} from "../../../../services/src/providers/item-references/item-references.provider";
import {environment as al_environment} from "../../../../../apps/al/src/environments/environment";
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {KeyboardService} from "../../../../services/src/lib/keyboard/keyboard.service";
import { TimesToastType } from '../../../../services/src/models/timesToastType';
import { PositionsToast } from '../../../../services/src/models/positionsToast.type';
import { ListasProductosComponent } from '../lista/listas-productos/listas-productos.component';
import { ListProductsCarrierComponent } from '../../components/list-products-carrier/list-products-carrier.component';

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
    private alertController: AlertController,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private pickingProvider: PickingProvider,
    private itemReferencesProvider: ItemReferencesProvider,
    private intermediaryService: IntermediaryService,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
    private carrierService: CarrierService,
    private modalCtrl: ModalController,
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    this.focusToInput();
  }

  ngOnInit() {
    console.log('passiamo di qui');
    
    this.pickingId = this.pickingProvider.pickingId;
    this.listProducts = this.pickingProvider.listProducts;
    // console.log(this.listProducts);
    
    this.typePacking = this.pickingProvider.typePacking;
    this.typePicking = this.pickingProvider.typePicking;
    this.packingReference = this.pickingProvider.packingReference;
    this.literalsJailPallet = this.pickingProvider.literalsJailPallet;

    this.clearTimeoutCleanLastCodeScanned();
    this.intervalCleanLastCodeScanned = setInterval(() => {
      if (this.itemReferencesProvider.checkCodeValue(this.lastCodeScanned) === this.itemReferencesProvider.codeValue.PACKING) {
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

  private async modalList( jaula:string){
    let modal = await this.modalCtrl.create({
      
      component: ListProductsCarrierComponent,
      componentProps: {
        carrierReference:jaula
      }
      
    })
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data === undefined && data.role === undefined){
        this.focusToInput();
        return;
      }
      
      if(data.data && data.role === undefined){
        if(this.itemReferencesProvider.checkCodeValue(data.data) === this.itemReferencesProvider.codeValue.PACKING){
          this.focusToInput();
          this.inputPicking = data.data;
          this.keyUpInput(KeyboardEvent['KeyCode'] = 13,true);
          return;
        }else if(data.role === 'navigate'){
          this.focusToInput();
        }
      }
      
    })
    modal.present();
  }

  keyUpInput(event?,prova:boolean=false) {
    // console.log(event);
    let dataWrited = (this.inputPicking || "").trim();
    // console.log(dataWrited);
    if (event.keyCode === 13 || prova && dataWrited) {
      // console.log('passa por aqui');
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

      if (this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.PACKING) {
        if(this.processInitiated && this.lastCarrierScanned == dataWrited){
          if (this.typePicking === 1) {
            this.alertSealPackingFinal(dataWrited);
          } else {
            this.endProcessPacking(dataWrited);
          }
        } else {
          this.carrierService.getSingle(this.lastCodeScanned)
            .pipe(
              // map(x => x.packingInventorys),
            )
            .subscribe(data => {
              if(data.packingInventorys.length > 0 && !prova){
                // console.log('abre modal');
                // console.log(data);
                this.modalList(data.reference);
              }else{
                console.log('no tiene lista');
                if (this.listProducts.length !== 0) {
                  let typePackingScanned = 0;
                  if (this.itemReferencesProvider.checkSpecificCodeValue(dataWrited, this.itemReferencesProvider.codeValue.JAIL)) {
                    typePackingScanned = 1;
                  } else if (this.itemReferencesProvider.checkSpecificCodeValue(dataWrited, this.itemReferencesProvider.codeValue.PALLET)) {
                    typePackingScanned = 2;
                  } else {
                    typePackingScanned = 3;
                  }
                  if ((this.packingReference && this.packingReference === dataWrited) || !this.packingReference) {
                    this.timeLastCodeScanned = new Date().getTime();
                    this.lastCarrierScanned = dataWrited;
                    if ((this.typePacking && typePackingScanned === this.typePacking) || !this.typePacking) {
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
                            if (res.code === 200 || res.code === 201) {
                              // console.log('passa di qui',res);

                              if (res.data.packingStatus === 2) {
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
                                this.intermediaryService.presentToastPrimary(`${this.literalsJailPallet[this.typePacking].process_started}${this.jailReference}.`,
                                  TimesToastType.DURATION_SUCCESS_TOAST_2000, PositionsToast.BOTTOM);

                                this.showTextStartScanPacking(false, this.typePacking, '');
                              } else if (res.data.packingStatus === 3) {
                                if (this.typePicking === 1) {
                                  this.alertSealPackingIntermediate(this.jailReference);
                                } else {
                                  this.endProcessIntermediate(this.jailReference);
                                }
                              } else {
                                this.processInitiated = false;
                                this.audioProvider.playDefaultError();
                                this.inputPicking = null;
                                this.focusToInput();
                                this.intermediaryService.presentToastError(this.literalsJailPallet[this.typePacking].not_registered, PositionsToast.BOTTOM);
                              }
                            } else {
                              this.processInitiated = false;
                              this.audioProvider.playDefaultError();
                              this.inputPicking = null;
                              this.focusToInput();
                              this.intermediaryService.presentToastError(this.literalsJailPallet[this.typePacking].not_registered, PositionsToast.BOTTOM);
                            }
                          } else {
                            this.audioProvider.playDefaultOk();
                            this.processInitiated = false;
                            this.inputPicking = null;
                            this.focusToInput();
                            this.jailReference = null;
                            this.dataToWrite = 'CONTENEDOR';
                            this.packingReference = this.jailReference;
                            this.intermediaryService.presentToastPrimary(`${this.literalsJailPallet[this.typePacking].process_packing_empty}${dataWrited}.`,
                              TimesToastType.DURATION_SUCCESS_TOAST_2000, PositionsToast.BOTTOM);
                            this.showNexProductToScan(false);
                            this.showTextStartScanPacking(true, this.typePacking, '');
                          }
                        }, (error) => {
                          this.inputPicking = null;
                          this.intermediaryService.dismissLoading();
                          this.audioProvider.playDefaultError();
                          if (error.error.code === 404) {
                            this.intermediaryService.presentToastError(this.literalsJailPallet[this.typePacking].not_registered, PositionsToast.BOTTOM);
                          } else {
                            this.intermediaryService.presentToastError(error.error.errors, PositionsToast.BOTTOM);
                          }
                          this.focusToInput();
                        }, () => {
                          this.intermediaryService.dismissLoading();
                        });
                    } else {
                      this.inputPicking = null;
                      this.audioProvider.playDefaultError();
                      this.focusToInput();
                      this.intermediaryService.presentToastError(this.literalsJailPallet[this.typePacking].wrong_packing, PositionsToast.BOTTOM);
                    }
                  } else {
                    this.inputPicking = null;
                    this.audioProvider.playDefaultError();
                    this.focusToInput();
                    this.intermediaryService.presentToastError(`${this.literalsJailPallet[this.typePacking].process_resumed}${this.packingReference}.`, PositionsToast.BOTTOM);
                  }
                } else if (this.jailReference && this.jailReference !== dataWrited) {
                  this.inputPicking = null;
                  this.audioProvider.playDefaultError();
                  this.focusToInput();
                  this.intermediaryService.presentToastError(this.literalsJailPallet[this.typePacking].wrong_process_finished, PositionsToast.BOTTOM);
                } else {
                  if (this.typePicking === 1) {
                    this.alertSealPackingFinal(dataWrited);
                  } else {
                    this.endProcessPacking(dataWrited);
                  }
                }
              }

            })
        }

        
      } else if (this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.PRODUCT) {
        if (!this.processInitiated) {
          this.audioProvider.playDefaultError();
          this.inputPicking = null;
          this.focusToInput();
          this.intermediaryService.presentToastError(this.literalsJailPallet[this.typePacking].scan_before_products, PositionsToast.BOTTOM);
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
              if (res.code === 200 || res.code === 201) {
                this.audioProvider.playDefaultOk();
                this.listProducts = res.data.shoePickingPending;
                this.productsScanned.push(dataWrited);
                this.inputPicking = null;
                this.focusToInput();
                this.intermediaryService.presentToastPrimary(`Producto ${dataWrited} escaneado y añadido ${this.literalsJailPallet[this.typePacking].toThe}.`,
                  TimesToastType.DURATION_SUCCESS_TOAST_2000, PositionsToast.BOTTOM);

                if (this.listProducts.length > 0) {
                  this.setNexProductToScan(this.listProducts[0]);
                } else {
                  this.showNexProductToScan(false);
                  setTimeout(() => {
                    this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                    this.dataToWrite = 'CONTENEDOR';
                    this.intermediaryService.presentToastSuccess(this.literalsJailPallet[this.typePacking].scan_to_end,
                      TimesToastType.DURATION_SUCCESS_TOAST_1500, PositionsToast.BOTTOM);
                  }, 2 * 1000);
                }
              } else {
                this.audioProvider.playDefaultError();
                this.inputPicking = null;
                this.focusToInput();
                this.intermediaryService.presentToastError(res.errors, PositionsToast.BOTTOM);
                this.getPendingListByPicking(this.pickingId)
                  .subscribe((res2: ShoesPickingModel.ResponseListByPicking) => {
                    if (res2.code === 200 || res2.code === 201) {
                      this.listProducts = res2.data;
                      if (this.listProducts.length > 0) {
                        this.setNexProductToScan(this.listProducts[0]);
                      } else {
                        this.showNexProductToScan(false);
                        setTimeout(() => {
                          this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                          this.dataToWrite = 'CONTENEDOR';
                          this.intermediaryService.presentToastSuccess(this.literalsJailPallet[this.typePacking].scan_to_end, TimesToastType.DURATION_SUCCESS_TOAST_1500, PositionsToast.BOTTOM);
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
              this.intermediaryService.presentToastError(error.error.errors, PositionsToast.BOTTOM);
              this.getPendingListByPicking(this.pickingId)
                .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                  if (res.code === 200 || res.code === 201) {
                    this.listProducts = res.data;
                    if (this.listProducts.length > 0) {
                      this.setNexProductToScan(this.listProducts[0]);
                    } else {
                      this.showNexProductToScan(false);
                      setTimeout(() => {
                        this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                        this.dataToWrite = 'CONTENEDOR';
                        this.intermediaryService.presentToastSuccess(this.literalsJailPallet[this.typePacking].scan_to_end, TimesToastType.DURATION_SUCCESS_TOAST_1500, PositionsToast.BOTTOM);
                      }, 2 * 1000);
                    }
                  }
                });
            };

            if (this.typePicking === 1) {
              this.inventoryService.postPickingDirect(picking).then(subscribeResponse, subscribeError).catch(subscribeError);
            } else if (this.typePicking === 2) {
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
            this.intermediaryService.presentToastSuccess(this.literalsJailPallet[this.typePacking].scan_to_end, TimesToastType.DURATION_SUCCESS_TOAST_1500, PositionsToast.BOTTOM);
          }
        }
      } else if (this.scanContainerToNotFound) {
        if (this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.CONTAINER
          || this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.CONTAINER_OLD) {
          this.intermediaryService.presentLoading();
          this.postCheckContainerProduct(dataWrited, this.nexProduct.inventory.id)
            .subscribe((res: InventoryModel.ResponseCheckContainer) => {
              this.intermediaryService.dismissLoading();
              if (res.code === 200) {
                this.audioProvider.playDefaultOk();
                let productNotFoundId = this.nexProduct.product.id;
                this.putProductNotFound(this.pickingId, productNotFoundId)
                  .subscribe((res3: ShoesPickingModel.ResponseProductNotFound) => {
                    if (res3.code === 200 || res3.code === 201) {
                      // console.log('passa di qui',res);
                      
                      this.scanContainerToNotFound = null;
                      this.dataToWrite = "PRODUCTO";
                      this.focusToInput();

                      this.intermediaryService.presentToastSuccess('El producto ha sido reportado como no encontrado', TimesToastType.DURATION_SUCCESS_TOAST_1500, PositionsToast.BOTTOM);
                      this.getPendingListByPicking(this.pickingId)
                        .subscribe((res2: ShoesPickingModel.ResponseListByPicking) => {
                          if (res2.code === 200 || res2.code === 201) {
                            this.listProducts = res2.data;
                            if (this.listProducts.length > 0) {
                              this.setNexProductToScan(this.listProducts[0]);
                            } else {
                              this.showNexProductToScan(false);
                              setTimeout(() => {
                                this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                                this.dataToWrite = 'CONTENEDOR';
                                this.intermediaryService.presentToastSuccess(this.literalsJailPallet[this.typePacking].scan_to_end, TimesToastType.DURATION_SUCCESS_TOAST_1500, PositionsToast.BOTTOM)
                              }, 2 * 1000);
                            }
                          }
                        });
                    } else {
                      this.audioProvider.playDefaultError();
                      this.focusToInput();
                      this.intermediaryService.presentToastError('Ha ocurrido un error al intentar reportar el producto como no encontrado.', PositionsToast.BOTTOM);
                    }
                  }, error => {
                    this.audioProvider.playDefaultError();
                    this.focusToInput();
                    this.intermediaryService.presentToastError('El código escaneado no corresponde a la ubicación del producto.', PositionsToast.BOTTOM);
                  });
              } else {
                this.audioProvider.playDefaultError();
                this.focusToInput();
                this.intermediaryService.presentToastError('El código escaneado no corresponde a la ubicación del producto.', PositionsToast.BOTTOM);
              }
            }, (error) => {
              this.intermediaryService.dismissLoading();
              console.error('Error::Subscribe::CheckContainerProduct -> ', error);
              this.audioProvider.playDefaultError();
              this.focusToInput();
              this.intermediaryService.presentToastError('El código escaneado no corresponde a la ubicación del producto.', PositionsToast.BOTTOM);
            }, () => {
              this.intermediaryService.dismissLoading();
            });
        } else {
          this.focusToInput();
          this.audioProvider.playDefaultError();
          this.intermediaryService.presentToastError('El código escaneado no corresponde a la ubicación del producto.', PositionsToast.BOTTOM);
        }
      } else {
        if (this.processInitiated) {
          this.inputPicking = null;
          this.focusToInput();
        } else {
          this.inputPicking = null;
          this.audioProvider.playDefaultError();
          this.focusToInput();
          this.intermediaryService.presentToastError('Referencia errónea', PositionsToast.BOTTOM);
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

  private showTextStartScanPacking(show: boolean, typePacking: number, packingReference?: string, continueProcess = false) {
    if (show) {
      if (packingReference) {
        if (typePacking === 1) {
          this.scanJail = "Escanea la Jaula " + packingReference + " para continuar con el proceso de picking ya iniciado.";
        } else {
          this.scanJail = "Escanea el Pallet " + packingReference + " para continuar con el proceso de picking ya iniciado.";
        }
      } else {
        this.scanJail = continueProcess ? "Escanea un embalaje para continuar con el proceso de picking." : "Escanea un embalaje para dar comienzo al proceso de picking.";
      }
    } else {
      this.scanJail = null;
    }
  }

  private showTextEndScanPacking(show: boolean, typePacking: number, packingReference: string) {
    if (show) {
      if(packingReference){
        if (typePacking === 1) {
          this.scanJail = "Escanea la Jaula " + packingReference + " para finalizar el proceso de picking.";
        } else {
          this.scanJail = "Escanea el Pallet " + packingReference + " para finalizar el proceso de picking.";
        }
      } else {
        if (typePacking === 1) {
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

  async alertSealPackingFinal(packingReference: string) {
    const listCarriers = [];

    this.inventoryService.getPendingSeal(this.pickingId).then(async (res: InventoryModel.ResponseGlobal) => {
      const pendingSealCarrier = Array(res.data)[0];

      pendingSealCarrier.forEach((item) => {
        listCarriers.push(item.packing[0].reference);
      });

      let listShow = "";

      listCarriers.map(x => {
        listShow += `${x}</br>`;
        return `${x}</br>`
      });

      if (listCarriers && listCarriers.length > 0) {
        const alertWarning = await this.alertController.create({
          header: 'Atención',
          message: `<b>¿Desea precintar los embalajes utilizados?</b></br></br>${listShow}</br>`,
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
                this.sealPackingFinal(listCarriers, packingReference);
              }
            }]
        });

        return await alertWarning.present();
      } else {
        this.endProcessPacking(packingReference);
      }
    });
  }

  async alertSealPackingIntermediate(packingReference: string) {
    const alertWarning = await this.alertController.create({
      header: 'Atención',
      message: `¿Desea precintar el embalaje ${packingReference}?`,
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.endProcessIntermediate(this.jailReference);
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.sealPackingIntermediate(packingReference);
          }
        }]
    });

    return await alertWarning.present();
  }

  private endProcessIntermediate(dataWrite: any) {
    this.processInitiated = false;
    this.audioProvider.playDefaultOk();
    this.inputPicking = null;
    this.focusToInput();
    this.jailReference = null;
    this.dataToWrite = 'CONTENEDOR';
    this.packingReference = this.jailReference;
    this.intermediaryService.presentToastSuccess(`${this.literalsJailPallet[this.typePacking].process_end_packing}${dataWrite}.`, TimesToastType.DURATION_SUCCESS_TOAST_2000, PositionsToast.BOTTOM);
    this.showNexProductToScan(false);
    this.showTextStartScanPacking(true, this.typePacking, '', true);
    this.intermediaryService.dismissLoading();
  }

  private sealPackingFinal(listCarriers: string[], packingReferenceLast: string) {
    this.intermediaryService.presentLoading('Finalizando proceso y precintando embalajes');
    this.postVerifyPacking({
      status: 3,
      pickingId: this.pickingId,
      packingReference: packingReferenceLast
    }).subscribe((res) => {
      if (listCarriers && listCarriers.length > 0) {
        this.carrierService.postSealList(listCarriers).subscribe(async () => {
          this.audioProvider.playDefaultOk();
          this.intermediaryService.dismissLoading();
          this.inputPicking = null;
          this.intermediaryService.presentToastSuccess('Proceso finalizado correctamente.', TimesToastType.DURATION_SUCCESS_TOAST_1500, PositionsToast.BOTTOM);
          this.showTextEndScanPacking(false, this.typePacking, this.jailReference);
          this.clearTimeoutCleanLastCodeScanned();
          setTimeout(() => {
            this.location.back();
            this.events.publish('picking:remove');
          }, 1.5 * 1000);
        });
      } else {
        this.audioProvider.playDefaultOk();
        this.intermediaryService.dismissLoading();
        this.inputPicking = null;
        this.intermediaryService.presentToastSuccess('Proceso finalizado correctamente.', TimesToastType.DURATION_SUCCESS_TOAST_1500, PositionsToast.BOTTOM);
        this.showTextEndScanPacking(false, this.typePacking, this.jailReference);
        this.clearTimeoutCleanLastCodeScanned();
        setTimeout(() => {
          this.location.back();
          this.events.publish('picking:remove');
        }, 1.5 * 1000);
      }
    }, (error) => {
      this.intermediaryService.dismissLoading();
      this.audioProvider.playDefaultError();
      this.inputPicking = null;
      this.focusToInput();
      this.clearTimeoutCleanLastCodeScanned();
      if (error.error.code === 404) {
        this.intermediaryService.presentToastError(this.literalsJailPallet[this.typePacking].not_registered, PositionsToast.BOTTOM);
      } else {
        this.intermediaryService.presentToastError(error.error.errors, PositionsToast.BOTTOM);
      }
    }, () => {
      this.intermediaryService.dismissLoading();
    });
  }

  private sealPackingIntermediate(packingReference: any) {
    if (packingReference && packingReference.length > 0) {
      this.intermediaryService.presentLoading('Precintando Jaula');
      this.carrierService.postSealList(Array(packingReference)).subscribe(async () => {
        this.endProcessIntermediate(this.jailReference);
      });
    }
  }

  private endProcessPacking(packingReference: any) {
    console.log('END PROCESS PACKING');
    console.log(packingReference);
    this.postVerifyPacking({
      status: 3,
      pickingId: this.pickingId,
      packingReference: packingReference
    })
      .subscribe((res) => {
        this.audioProvider.playDefaultOk();
        this.intermediaryService.dismissLoading();
        this.inputPicking = null;
        this.intermediaryService.presentToastSuccess('Proceso finalizado correctamente.', TimesToastType.DURATION_SUCCESS_TOAST_1500, PositionsToast.BOTTOM);
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
        if (error.error.code === 404) {
          this.intermediaryService.presentToastError(this.literalsJailPallet[this.typePacking].not_registered, PositionsToast.BOTTOM);
        } else {
          this.intermediaryService.presentToastError(error.error.errors, PositionsToast.BOTTOM);
        }
      }, () => {
        this.intermediaryService.dismissLoading();
      });
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
