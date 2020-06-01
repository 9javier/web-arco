import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import { from, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  AuthenticationService,
  environment,
  InventoryModel,
  InventoryService,
  IntermediaryService,
  CarrierService
} from '@suite/services';
import { AlertController, Events, ModalController } from "@ionic/angular";
import { ShoesPickingModel } from "../../../../services/src/models/endpoints/ShoesPicking";
import { switchMap } from "rxjs/operators";
import { PickingProvider } from "../../../../services/src/providers/picking/picking.provider";
import { Location } from "@angular/common";
import { ItemReferencesProvider } from "../../../../services/src/providers/item-references/item-references.provider";
import { environment as al_environment } from "../../../../../apps/al/src/environments/environment";
import { AudioProvider } from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import { KeyboardService } from "../../../../services/src/lib/keyboard/keyboard.service";
import { TimesToastType } from '../../../../services/src/models/timesToastType';
import { PositionsToast } from '../../../../services/src/models/positionsToast.type';
import { ListProductsCarrierComponent } from '../../components/list-products-carrier/list-products-carrier.component';
import { LoadingMessageComponent } from "../../components/loading-message/loading-message.component";
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import * as toolbarProvider from "../../../../services/src/providers/toolbar/toolbar.provider";
import {ScanditService} from "../../../../services/src/lib/scandit/scandit.service";

@Component({
  selector: 'suite-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  @ViewChild(LoadingMessageComponent) loadingMessageComponent: LoadingMessageComponent;

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
  pickingSelected: PickingModel.Picking;

  private postVerifyPackingUrl = environment.apiBase + "/processes/picking-main/packing";
  private getPendingListByPickingUrl = environment.apiBase + "/processes/picking-main/shoes/{{id}}/pending";
  private putProductNotFoundUrl = environment.apiBase + "/processes/picking-main/shoes/{{workWaveOrderId}}/product-not-found/{{productId}}";
  private postCheckContainerProductUrl = environment.apiBase + "/inventory/check-container";

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  public isScannerBlocked: boolean = false;

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
    private scanditService: ScanditService,
    private toolbarProvider: toolbarProvider.ToolbarProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    this.focusToInput();
  }

  ngOnInit() {
    this.addCameraButton();
    this.pickingSelected = this.pickingProvider.pickingSelectedToStart;
    this.pickingId = this.pickingProvider.pickingId;
    this.listProducts = this.pickingProvider.listProducts;

    this.typePacking = this.pickingProvider.typePacking;
    this.typePicking = this.pickingProvider.typePicking;
    this.packingReference = this.pickingProvider.packingReference;
    this.literalsJailPallet = this.pickingProvider.literalsJailPallet;

    this.clearTimeoutCleanLastCodeScanned();
    this.intervalCleanLastCodeScanned = setInterval(() => {
      if (this.itemReferencesProvider.checkCodeValue(this.lastCodeScanned) === this.itemReferencesProvider.codeValue.PACKING) {
        if (Math.abs((new Date().getTime() - this.timeLastCodeScanned) / 1000) > 4) {
          this.lastCodeScanned = 'start';
        }
      }
    }, 1000);

    if (this.listProducts.length > 0) {
      this.showTextStartScanPacking(true, this.typePacking, this.packingReference || '');
    } else {
      if (this.lastCarrierScanned) this.packingReference = this.lastCarrierScanned;
      this.jailReference = this.packingReference;
      this.processInitiated = true;
      this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
    }

    this.scanditService.laserMode.subscribe(pacRef => {
      if(pacRef == ''){
        this.processInitiated = false;
        this.inputPicking = null;
        this.jailReference = null;
        this.dataToWrite = 'CONTENEDOR';
        this.packingReference = this.jailReference;
        this.isScannerBlocked = false;
        this.showNexProductToScan(false);
        this.showTextStartScanPacking(true, this.typePacking, '', true);
      }else{
        this.listProducts = this.pickingProvider.listProducts;
        this.isScannerBlocked = true;
        document.getElementById('input-ta').blur();
        this.lastCodeScanned = pacRef;
        if (this.timeoutStarted) {
          clearTimeout(this.timeoutStarted);
        }
        this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);
        this.inputPicking = null;
        this.timeLastCodeScanned = new Date().getTime();
        this.lastCarrierScanned = pacRef;
        this.loadingMessageComponent.show(true);
        if (this.itemReferencesProvider.checkSpecificCodeValue(pacRef, this.itemReferencesProvider.codeValue.JAIL)) {
          this.typePacking = 1;
        } else if (this.itemReferencesProvider.checkSpecificCodeValue(pacRef, this.itemReferencesProvider.codeValue.PALLET)) {
          this.typePacking = 2;
        } else {
          this.typePacking = 3;
        }
        this.processInitiated = true;
        this.jailReference = pacRef;
        this.dataToWrite = 'PRODUCTO';
        if (!this.packingReference) {
          this.packingReference = this.jailReference;
        }
        this.isScannerBlocked = false;
        this.processFinishOk({
          focusInput: {
            playSound: true
          },
          toast: {
            duration: TimesToastType.DURATION_SUCCESS_TOAST_2000,
            position: PositionsToast.BOTTOM,
            message: `${this.literalsJailPallet[this.typePacking].process_started}${this.jailReference}.`
          }
        });
        this.setNexProductToScan(this.listProducts[0]);
        this.showTextStartScanPacking(false, this.typePacking, '');
      }
    });
  }

  addCameraButton(){
    const buttons = [{
      icon: 'camera',
      label: 'Cámara',
      action: () => {
        this.scanditService.picking(this.pickingProvider.pickingSelectedToStart.id, this.listProducts, this.pickingProvider.pickingSelectedToStart.packingType, this.pickingProvider.typePicking, this.packingReference);
      }
    }];
    this.toolbarProvider.optionsActions.next(buttons);
  }

  private async modalList(jaula: string) {
    let modal = await this.modalCtrl.create({
      component: ListProductsCarrierComponent,
      componentProps: {
        carrierReference: jaula,
        process: 'picking'
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === undefined && data.role === undefined) {
        this.isScannerBlocked = false;
        this.focusToInput();
        return;
      }

      if (data.data && data.role === undefined) {
        if (this.itemReferencesProvider.checkCodeValue(data.data) === this.itemReferencesProvider.codeValue.PACKING) {
          this.isScannerBlocked = false;
          this.focusToInput();
          this.inputPicking = data.data;
          this.keyUpInput(KeyboardEvent['KeyCode'] = 13, true);
          return;
        } else if (data.role === 'navigate') {
          this.isScannerBlocked = false;
          this.focusToInput();
        }
      }
    });

    modal.present();
  }

  async keyUpInput(event?, prova: boolean = false) {
    let dataWrited = (this.inputPicking || "").trim();
    if ((event.keyCode === 13 || prova && dataWrited) && !this.isScannerBlocked) {
      this.isScannerBlocked = true;
      document.getElementById('input-ta').blur();

      if (dataWrited === this.lastCodeScanned) {
        this.inputPicking = null;
        this.isScannerBlocked = false;
        this.focusToInput();
        return;
      }
      this.lastCodeScanned = dataWrited;


      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      this.inputPicking = null;
      if (this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.PACKING) {
        if (this.processInitiated && this.lastCarrierScanned == dataWrited) {
          if (this.listProducts && this.listProducts.length > 0) {
            if (this.typePicking === 1) {
              this.alertSealPackingIntermediate(dataWrited);
            } else {
              this.endProcessIntermediate(dataWrited);
            }
          } else {
            if (this.typePicking === 1) {
              this.alertSealPackingFinal(dataWrited);
            } else {
              this.endProcessPacking(dataWrited);
            }
          }
        } else {
          this.carrierService.getSingle(this.lastCodeScanned)
            .pipe(
              // map(x => x.packingInventorys),
            )
            .subscribe(data => {
              if (data) {
                if (data.packingInventorys.length > 0 && !prova) {
                  this.modalList(data.reference);
                } else {
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
                        this.loadingMessageComponent.show(true);
                        this.postVerifyPacking({
                          status: 2,
                          pickingId: this.pickingId,
                          packingReference: dataWrited
                        })
                          .subscribe((res) => {
                            if (this.itemReferencesProvider.checkSpecificCodeValue(dataWrited, this.itemReferencesProvider.codeValue.JAIL)) {
                              this.typePacking = 1;
                            } else if (this.itemReferencesProvider.checkSpecificCodeValue(dataWrited, this.itemReferencesProvider.codeValue.PALLET)) {
                              this.typePacking = 2;
                            } else {
                              this.typePacking = 3;
                            }
                            if (res) {
                              if (res.code === 200 || res.code === 201) {
                                if (res.data.packingStatus === 2) {
                                  this.processInitiated = true;
                                  this.inputPicking = null;
                                  this.jailReference = dataWrited;
                                  this.dataToWrite = 'PRODUCTO';
                                  if (!this.packingReference) {
                                    this.packingReference = this.jailReference;
                                  }

                                  this.isScannerBlocked = false;
                                  this.processFinishOk({
                                    focusInput: {
                                      playSound: true
                                    },
                                    toast: {
                                      duration: TimesToastType.DURATION_SUCCESS_TOAST_2000,
                                      position: PositionsToast.BOTTOM,
                                      message: `${this.literalsJailPallet[this.typePacking].process_started}${this.jailReference}.`
                                    }
                                  });

                                  this.setNexProductToScan(this.listProducts[0]);
                                  this.showTextStartScanPacking(false, this.typePacking, '');
                                } else if (res.data.packingStatus === 3) {
                                  if (this.typePicking === 1) {
                                    this.loadingMessageComponent.show(false);
                                    this.alertSealPackingIntermediate(this.jailReference);
                                  } else {
                                    this.loadingMessageComponent.show(false);
                                    this.endProcessIntermediate(this.jailReference);
                                  }
                                } else {
                                  this.processInitiated = false;
                                  this.inputPicking = null;

                                  this.isScannerBlocked = false;
                                  this.processFinishError({
                                    focusInput: {
                                      playSound: true
                                    },
                                    toast: {
                                      position: PositionsToast.BOTTOM,
                                      message: this.literalsJailPallet[this.typePacking].not_registered
                                    }
                                  });
                                }
                              } else {
                                this.processInitiated = false;
                                this.inputPicking = null;

                                this.isScannerBlocked = false;
                                this.processFinishError({
                                  focusInput: {
                                    playSound: true
                                  },
                                  toast: {
                                    position: PositionsToast.BOTTOM,
                                    message: this.literalsJailPallet[this.typePacking].not_registered
                                  }
                                });
                              }
                            } else {
                              this.processInitiated = false;
                              this.inputPicking = null;
                              this.jailReference = null;
                              this.dataToWrite = 'CONTENEDOR';
                              this.packingReference = this.jailReference;

                              this.isScannerBlocked = false;
                              this.processFinishOk({
                                focusInput: {
                                  playSound: true
                                },
                                toast: {
                                  duration: TimesToastType.DURATION_SUCCESS_TOAST_2000,
                                  position: PositionsToast.BOTTOM,
                                  message: `${this.literalsJailPallet[this.typePacking].process_packing_empty}${dataWrited}.`
                                }
                              });

                              this.showNexProductToScan(false);
                              this.showTextStartScanPacking(true, this.typePacking, '');
                            }
                          }, (error) => {
                            this.inputPicking = null;

                            let errorMessage = error.error.errors;
                            if (error.error.code === 404) {
                              errorMessage = this.literalsJailPallet[this.typePacking].not_registered;
                            }
                            this.isScannerBlocked = false;
                            this.processFinishError({
                              focusInput: {
                                playSound: true
                              },
                              toast: {
                                position: PositionsToast.BOTTOM,
                                message: errorMessage
                              }
                            });
                          });
                      } else {
                        this.inputPicking = null;

                        this.isScannerBlocked = false;
                        this.processFinishError({
                          focusInput: {
                            playSound: true
                          },
                          toast: {
                            position: PositionsToast.BOTTOM,
                            message: this.literalsJailPallet[this.typePacking].wrong_packing
                          }
                        });
                      }
                    } else {
                      this.inputPicking = null;

                      this.isScannerBlocked = false;
                      this.processFinishError({
                        focusInput: {
                          playSound: true
                        },
                        toast: {
                          position: PositionsToast.BOTTOM,
                          message: `${this.literalsJailPallet[this.typePacking].process_resumed}${this.packingReference}.`
                        }
                      });
                    }
                  } else if (this.jailReference && this.jailReference !== dataWrited) {
                    this.inputPicking = null;

                    this.isScannerBlocked = false;
                    this.processFinishError({
                      focusInput: {
                        playSound: true
                      },
                      toast: {
                        position: PositionsToast.BOTTOM,
                        message: this.literalsJailPallet[this.typePacking].wrong_process_finished
                      }
                    });
                  } else {
                    if (this.typePicking === 1) {
                      this.alertSealPackingFinal(dataWrited);
                    } else {
                      this.endProcessPacking(dataWrited);
                    }
                  }
                }
              } else {
                this.inputPicking = null;

                this.isScannerBlocked = false;
                this.processFinishError({
                  focusInput: {
                    playSound: true
                  },
                  toast: {
                    position: PositionsToast.BOTTOM,
                    message: 'Referencia errónea'
                  }
                });
              }
            })
        }
      } else if (this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.PRODUCT) {
        if (!this.processInitiated) {
          this.inputPicking = null;

          this.isScannerBlocked = false;
          this.processFinishError({
            focusInput: {
              playSound: true
            },
            toast: {
              position: PositionsToast.BOTTOM,
              message: this.literalsJailPallet[this.typePacking].scan_before_products
            }
          });
        } else {
          if (this.listProducts.length > 0) {
            let picking: InventoryModel.Picking = {
              packingReference: this.jailReference,
              packingType: this.typePacking,
              pikingId: this.pickingId,
              productReference: dataWrited
            };
            this.loadingMessageComponent.show(true, `Procesando ${picking.productReference || ''}`);
            let subscribeResponse = await (async (res: InventoryModel.ResponsePicking) => {
              if (res.code === 200 || res.code === 201) {
                this.listProducts = res.data.shoePickingPending;
                this.productsScanned.push(dataWrited);
                this.inputPicking = null;

                this.isScannerBlocked = false;
                this.processFinishOk({
                  focusInput: {
                    playSound: true
                  },
                  toast: {
                    position: PositionsToast.BOTTOM,
                    message: `Producto ${dataWrited} escaneado y añadido el embalaje.`,
                    duration: TimesToastType.DURATION_SUCCESS_TOAST_2000
                  }
                });

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
                this.inputPicking = null;

                this.isScannerBlocked = false;
                this.processFinishError({
                  focusInput: {
                    playSound: true
                  },
                  toast: {
                    position: PositionsToast.BOTTOM,
                    message: res.errors
                  }
                });

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
            });
            let subscribeError = (error) => {
              this.inputPicking = null;

              this.isScannerBlocked = false;
              this.processFinishError({
                focusInput: {
                  playSound: true
                },
                toast: {
                  position: PositionsToast.BOTTOM,
                  message: error.error.errors
                }
              });

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
            this.dataToWrite = 'CONTENEDOR';

            this.isScannerBlocked = false;
            this.processFinishOk({
              focusInput: {
                playSound: true
              },
              toast: {
                position: PositionsToast.BOTTOM,
                message: this.literalsJailPallet[this.typePacking].scan_to_end,
                duration: TimesToastType.DURATION_SUCCESS_TOAST_2000
              }
            });

            this.showNexProductToScan(false);
            this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
          }
        }
      } else if (this.scanContainerToNotFound) {
        if (this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.CONTAINER
          || this.itemReferencesProvider.checkCodeValue(dataWrited) === this.itemReferencesProvider.codeValue.CONTAINER_OLD) {
          this.loadingMessageComponent.show(true, `Comprobando ${dataWrited}`);
          this.postCheckContainerProduct(dataWrited, this.nexProduct.inventory.id)
            .subscribe((res: InventoryModel.ResponseCheckContainer) => {
              if (res.code === 200) {
                let productNotFoundId = this.nexProduct.product.id;
                this.putProductNotFound(this.pickingId, productNotFoundId)
                  .subscribe((res3: ShoesPickingModel.ResponseProductNotFound) => {
                    if (res3.code === 200 || res3.code === 201) {
                      this.scanContainerToNotFound = null;
                      this.dataToWrite = "PRODUCTO";

                      this.isScannerBlocked = false;
                      this.processFinishOk({
                        focusInput: {
                          playSound: true
                        },
                        toast: {
                          position: PositionsToast.BOTTOM,
                          message: 'El producto ha sido reportado como no encontrado',
                          duration: TimesToastType.DURATION_SUCCESS_TOAST_1500
                        }
                      });

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
                      this.isScannerBlocked = false;
                      this.processFinishError({
                        focusInput: {
                          playSound: true
                        },
                        toast: {
                          position: PositionsToast.BOTTOM,
                          message: 'Ha ocurrido un error al intentar reportar el producto como no encontrado.'
                        }
                      });
                    }
                  }, error => {
                    this.isScannerBlocked = false;
                    this.processFinishError({
                      focusInput: {
                        playSound: true
                      },
                      toast: {
                        position: PositionsToast.BOTTOM,
                        message: 'El código escaneado no corresponde a la ubicación del producto.'
                      }
                    });
                  });
              } else {
                this.isScannerBlocked = false;
                this.processFinishError({
                  focusInput: {
                    playSound: true
                  },
                  toast: {
                    position: PositionsToast.BOTTOM,
                    message: 'El código escaneado no corresponde a la ubicación del producto'
                  }
                });
              }
            }, (error) => {
              this.isScannerBlocked = false;
              this.processFinishError({
                focusInput: {
                  playSound: true
                },
                toast: {
                  position: PositionsToast.BOTTOM,
                  message: 'El código escaneado no corresponde a la ubicación del producto.'
                }
              });
            });
        } else {
          this.isScannerBlocked = false;
          this.processFinishError({
            focusInput: {
              playSound: true
            },
            toast: {
              position: PositionsToast.BOTTOM,
              message: 'El código escaneado no corresponde a la ubicación del producto.'
            }
          });
        }
      } else {
        if (this.processInitiated) {
          this.inputPicking = null;
          this.isScannerBlocked = false;
          this.focusToInput();
        } else {
          this.inputPicking = null;

          this.isScannerBlocked = false;
          this.processFinishError({
            focusInput: {
              playSound: true
            },
            toast: {
              position: PositionsToast.BOTTOM,
              message: 'Referencia errónea'
            }
          });
        }
      }
    } else if (event.keyCode === 13 && this.isScannerBlocked) {
      this.inputPicking = null;
      this.focusToInput();
    }
  }

  private fullPacking(){
    if (this.listProducts && this.listProducts.length > 0) {
      if (this.typePicking === 1) {
        this.alertSealPackingIntermediate(this.lastCarrierScanned);
      } else {
        this.endProcessIntermediate(this.lastCarrierScanned);
      }
    } else {
      if (this.typePicking === 1) {
        this.alertSealPackingFinal(this.lastCarrierScanned);
      } else {
        this.endProcessPacking(this.lastCarrierScanned);
      }
    }
  }

  private postVerifyPacking(packing): Observable<any> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<any>(this.postVerifyPackingUrl, packing, { headers });
    }));
  }

  private getPendingListByPicking(pickingId: number): Observable<ShoesPickingModel.ResponseListByPicking> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.get<ShoesPickingModel.ResponseListByPicking>(this.getPendingListByPickingUrl.replace('{{id}}', pickingId.toString()), { headers });
    }));
  }

  private putProductNotFound(pickingId: number, productId: number): Observable<ShoesPickingModel.ResponseProductNotFound> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      let putProductNotFoundUrl = this.putProductNotFoundUrl.replace('{{workWaveOrderId}}', pickingId.toString());
      putProductNotFoundUrl = putProductNotFoundUrl.replace('{{productId}}', productId.toString());
      return this.http.put<ShoesPickingModel.ResponseProductNotFound>(putProductNotFoundUrl, { headers });
    }));
  }

  private postCheckContainerProduct(containerReference: string, inventoryId: number): Observable<InventoryModel.ResponseCheckContainer> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
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
      if (packingReference) {
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
      + alphabet[inventory.container.row - 1]
      + inventory.container.column.toString().padStart(2, '0');
  }

  async productNotFound() {
    const alertWarning = await this.alertController.create({
      header: 'Atención',
      message: '¿Está seguro de querer reportar como no encontrado el producto <b>' + this.nexProduct.product.model.reference + '</b> en la ubicación <b>' + this.nexProduct.inventory.container.reference + '</b>?<br/>(tendrá que escanear la ubicación para confirmar el reporte).',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            this.isScannerBlocked = false;
            this.processFinishError({
              focusInput: {
                playSound: true
              }
            });

            this.scanContainerToNotFound = null;
            this.dataToWrite = "PRODUCTO";
          }
        },
        {
          text: 'Reportar',
          handler: () => {
            this.isScannerBlocked = false;
            this.processFinishOk({
              focusInput: {
                playSound: true
              }
            });

            this.scanContainerToNotFound = "Escanea la ubicación que estás revisando para comprobar que sea la correcta. Escanea el producto si lo encuentra.";
            this.dataToWrite = "UBICACIÓN";
          }
        }]
    });

    return await alertWarning.present();
  }

  async alertSealPackingFinal(packingReference: string) {
    this.inventoryService.getPendingSeal(this.pickingId).then(async (res: InventoryModel.ResponseGlobal) => {
      const pendingSealCarrier = res.data;
      const listPackingReferences = pendingSealCarrier.filter(c => { return c != null && c.packing != null && c.packing[0] != null }).map(c => c.packing[0].reference);

      if (listPackingReferences && listPackingReferences.length > 0) {
        const listPackingReferencesToShow = listPackingReferences.join('<br/>');

        const alertWarning = await this.alertController.create({
          header: 'Atención',
          message: `<b>¿Desea precintar los embalajes utilizados?</b></br></br>${listPackingReferencesToShow}`,
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
                this.sealPackingFinal(listPackingReferences, packingReference);
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
    this.inputPicking = null;
    this.jailReference = null;
    this.dataToWrite = 'CONTENEDOR';
    this.packingReference = this.jailReference;

    this.isScannerBlocked = false;
    this.processFinishOk({
      focusInput: {
        playSound: true
      },
      toast: {
        message: `${this.literalsJailPallet[this.typePacking].process_end_packing}${dataWrite}.`,
        duration: TimesToastType.DURATION_SUCCESS_TOAST_2000,
        position: PositionsToast.BOTTOM
      }
    });

    this.showNexProductToScan(false);
    this.showTextStartScanPacking(true, this.typePacking, '', true);
  }

  private sealPackingFinal(listCarriers: string[], packingReferenceLast: string) {
    this.loadingMessageComponent.show(true, 'Finalizando proceso y precintando embalajes');
    this.postVerifyPacking({
      status: 3,
      pickingId: this.pickingId,
      packingReference: packingReferenceLast
    }).subscribe((res) => {
      if (listCarriers && listCarriers.length > 0) {
        this.carrierService.postSealList(listCarriers).subscribe(async () => {
          this.inputPicking = null;

          this.isScannerBlocked = false;
          this.processFinishOk({
            toast: {
              message: 'Proceso finalizado correctamente.',
              duration: TimesToastType.DURATION_SUCCESS_TOAST_1500,
              position: PositionsToast.BOTTOM
            },
            playSound: true
          });

          this.showTextEndScanPacking(false, this.typePacking, this.jailReference);
          this.clearTimeoutCleanLastCodeScanned();

          setTimeout(() => {
            this.location.back();
            this.events.publish('picking:remove');
          }, 1.5 * 1000);
        });
      } else {
        this.inputPicking = null;

        this.isScannerBlocked = false;
        this.processFinishOk({
          toast: {
            message: 'Proceso finalizado correctamente.',
            duration: TimesToastType.DURATION_SUCCESS_TOAST_1500,
            position: PositionsToast.BOTTOM
          },
          playSound: true
        });

        this.showTextEndScanPacking(false, this.typePacking, this.jailReference);
        this.clearTimeoutCleanLastCodeScanned();

        setTimeout(() => {
          this.location.back();
          this.events.publish('picking:remove');
        }, 1.5 * 1000);
      }
    }, (error) => {
      this.inputPicking = null;

      let errorMessage = error.error.errors;
      if (error.error.code === 404) {
        errorMessage = this.literalsJailPallet[this.typePacking].not_registered;
      }
      this.isScannerBlocked = false;
      this.processFinishError({
        toast: {
          message: errorMessage,
          position: PositionsToast.BOTTOM
        },
        focusInput: {
          playSound: true
        }
      });

      this.clearTimeoutCleanLastCodeScanned();
    });
  }

  private sealPackingIntermediate(packingReference: any) {
    if (packingReference && packingReference.length > 0) {
      this.loadingMessageComponent.show(true, 'Precintando embalaje');
      this.carrierService.postSealList(Array(packingReference)).subscribe(async () => {
        this.endProcessIntermediate(this.jailReference);
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
        this.inputPicking = null;

        this.isScannerBlocked = false;
        this.processFinishOk({
          toast: {
            message: 'Proceso finalizado correctamente.',
            duration: TimesToastType.DURATION_SUCCESS_TOAST_1500,
            position: PositionsToast.BOTTOM
          },
          playSound: true
        });

        this.showTextEndScanPacking(false, this.typePacking, this.jailReference);
        this.clearTimeoutCleanLastCodeScanned();

        setTimeout(() => {
          this.location.back();
          this.events.publish('picking:remove');
        }, 1.5 * 1000);
      }, (error) => {
        this.inputPicking = null;

        let errorMessage = error.error.errors;
        if (error.error.code === 404) {
          errorMessage = this.literalsJailPallet[this.typePacking].not_registered;
        }
        this.isScannerBlocked = false;
        this.processFinishError({
          toast: {
            message: errorMessage,
            position: PositionsToast.BOTTOM
          },
          focusInput: {
            playSound: true
          }
        });

        this.clearTimeoutCleanLastCodeScanned();
      });
  }

  private clearTimeoutCleanLastCodeScanned() {
    if (this.intervalCleanLastCodeScanned) {
      clearTimeout(this.intervalCleanLastCodeScanned);
      this.intervalCleanLastCodeScanned = null;
    }
  }

  private focusToInput(playSound: boolean = false, typeSound: 'ok' | 'error' = 'ok') {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
      if (playSound) {
        if (typeSound == 'ok') {
          this.audioProvider.playDefaultOk();
        } else {
          this.audioProvider.playDefaultError();
        }
      }
    }, 500);
  }

  public onFocus(event) {
    if (event && event.target && event.target.id) {
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

  private processFinishOk(options: { toast?: { message: string, duration: number, position: string }, focusInput?: { playSound?: boolean }, playSound?: boolean } = null) {
    this.loadingMessageComponent.show(false);

    if (options.toast != null) {
      this.intermediaryService.presentToastPrimary(options.toast.message, options.toast.duration, options.toast.position);
    }

    if (options.focusInput != null) {
      if (options.focusInput.playSound) {
        this.focusToInput(true, 'ok');
      } else {
        this.focusToInput();
      }
    }

    if (options.playSound != null) {
      this.audioProvider.playDefaultOk();
    }
  }

  private processFinishError(options: { toast?: { message: string, duration?: number, position: string }, focusInput?: { playSound?: boolean }, playSound?: boolean } = null) {
    this.loadingMessageComponent.show(false);

    if (options.toast != null) {
      this.intermediaryService.presentToastError(options.toast.message, options.toast.position, options.toast.duration || TimesToastType.DURATION_ERROR_TOAST);
    }

    if (options.focusInput != null) {
      if (options.focusInput.playSound) {
        this.focusToInput(true, 'error');
      } else {
        this.focusToInput();
      }
    }

    if (options.playSound != null) {
      this.audioProvider.playDefaultOk();
    }
  }
}
