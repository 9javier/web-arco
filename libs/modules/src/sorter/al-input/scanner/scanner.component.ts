import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";
import {ItemReferencesProvider} from "../../../../../services/src/providers/item-references/item-references.provider";
import {CarrierService, IntermediaryService, InventoryModel, InventoryService} from "@suite/services";
import {ProductSorterModel} from "../../../../../services/src/models/endpoints/ProductSorter";
import {PackageSorterModel} from "../../../../../services/src/models/endpoints/PackageSorter";
import {SorterInputService} from "../../../../../services/src/lib/endpoint/sorter-input/sorter-input.service";
import {InputSorterModel} from "../../../../../services/src/models/endpoints/InputSorter";
import {SorterExecutionService} from "../../../../../services/src/lib/endpoint/sorter-execution/sorter-execution.service";
import {ExecutionSorterModel} from "../../../../../services/src/models/endpoints/ExecutionSorter";
import {ToolbarProvider} from "../../../../../services/src/providers/toolbar/toolbar.provider";
import {Location} from "@angular/common";
import {HttpRequestModel} from "../../../../../services/src/models/endpoints/HttpRequest";
import {Events, ModalController} from '@ionic/angular';
import { ScannerRackComponent } from '../scanner-rack/scanner-rack.component';
import {AudioProvider} from "../../../../../services/src/providers/audio-provider/audio-provider.provider";
import {KeyboardService} from "../../../../../services/src/lib/keyboard/keyboard.service";
import {CarrierModel} from "../../../../../services/src/models/endpoints/carrier.model";
import {PickingStoreService} from "../../../../../services/src/lib/endpoint/picking-store/picking-store.service";
import {PositionsToast} from "../../../../../services/src/models/positionsToast.type";
import {TimesToastType} from "../../../../../services/src/models/timesToastType";

@Component({
  selector: 'sorter-input-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerInputSorterComponent implements OnInit, OnDestroy {

  private LOAD_DATA_INPUT_SORTER: string = 'load_data_input_sorter';

  messageGuide = 'ARTÍCULO';
  inputValue: string = null;
  lastCodeScanned = 'start';
  processStarted = false;
  isWaitingSorterFeedback = false;
  isWaitingWayWillFree: boolean = false;
  productToSetInSorter: string = null;
  idLastWaySet: number = null;
  modalScanRack = false;
  lastProductIsToBusyWay: boolean = false;

  productScanned: ProductSorterModel.ProductSorter = null;
  packageScanned: PackageSorterModel.ProductSorter = null;

  productScanWithException: boolean = false;
  destinyForProductScanWithException: boolean = false;
  needScanNewPacking: boolean = false;

  destinyCodeToGetPacking: string = null;
  destiniesWithPacking: string[] = [];

  // Reset of scanner to scan same code multiple times
  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;
  private readonly timeMillisToQuickUserFromSorterProcess: number = 10 * 60 * 1000;

  private timeoutToQuickStarted = null;

  constructor(
    private events: Events,
    private modalCtrl: ModalController,
    private location: Location,
    private intermediaryService: IntermediaryService,
    private sorterInputService: SorterInputService,
    private sorterExecutionService: SorterExecutionService,
    public sorterProvider: SorterProvider,
    private itemReferencesProvider: ItemReferencesProvider,
    private toolbarProvider: ToolbarProvider,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
    private inventoryService: InventoryService,
    private carrierService: CarrierService,
    private pickingStoreService: PickingStoreService
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    this.timeMillisToQuickUserFromSorterProcess = al_environment.time_millis_quick_user_sorter_process;
    setTimeout(() => {
      document.getElementById('input').focus();
    },800); }

  ngOnInit() {
    this.addScannerRackButton();
    this.timeoutToQuickUser();
  }

  ngOnDestroy() {
    if (this.timeoutToQuickStarted) {
      clearTimeout(this.timeoutToQuickStarted);
    }
    this.toolbarProvider.optionsActions.next([]);
  }

  private focusToInput(playSound: boolean = false, typeSound: 'ok'|'error' = 'ok') {
    setTimeout(() => {
      if (!this.isWaitingSorterFeedback && document.getElementById('input')) {
        document.getElementById('input').focus()
      }
      if (playSound) {
        if (typeSound == 'ok') {
          this.audioProvider.playDefaultOk();
        } else {
          this.audioProvider.playDefaultError();
        }
      }
    },500);
  }

  async presentScannerRackModal() {
    this.addScannerRackButton();
    this.modalScanRack = true;
    const scannerModal = await this.modalCtrl.create({
      component: ScannerRackComponent,
      componentProps: {
        'productScanned': this.productScanned != null && this.productScanned != undefined ? this.productScanned : this.packageScanned 
      }
    });

    scannerModal.onDidDismiss().then(async (data) => {
      if (data.data.close) {
        this.isWaitingSorterFeedback = false;
        this.isWaitingWayWillFree = false;
        this.modalScanRack = false;
        this.addScannerRackButton();

        if (this.lastProductIsToBusyWay) {
          this.checkWayWillFree(this.idLastWaySet, this.productToSetInSorter);
        } else {
          if(this.productScanned != undefined && this.productScanned != undefined){
            this.checkProductInWay(this.productScanned.reference);
          }else{
            this.checkProductInWay(this.packageScanned.uniqueCode);
          }
        }
      } else {
        this.isWaitingSorterFeedback = false;
        this.isWaitingWayWillFree = false;
        this.modalScanRack = false;
        this.timeoutToQuickUser();
        if (this.timeoutStarted) {
          clearTimeout(this.timeoutStarted);
        }
        this.sorterNotifyAboutProductScanned();
        this.resetLastScanProcess();
        this.focusToInput();
      }
    });

    return await scannerModal.present();
  }

  addScannerRackButton() {
    const buttons = [
      {
        icon: 'hand',
        label: 'Finalizar',
        action: async () => {
          this.timeoutToQuickUser();
          const callback = async () => {
            await this.intermediaryService.presentLoading('Finalizando proceso de entrada...');
            this.stopExecutionInput();
          };
          await this.intermediaryService.presentConfirm('Está a punto de finalizar el proceso de entrada en el sorter. ¿Está seguro?', callback);
        }
      }];
    this.toolbarProvider.optionsActions.next(buttons);
    this.timeoutToQuickUser();
  }

  async keyUpInput(event) {
    this.timeoutToQuickUser();
    const dataWrote = (this.inputValue || "").trim();

    if (event.keyCode === 13 && dataWrote) {
      await this.scanToProduct(dataWrote)
    }
  }

  async scanToProduct(dataWrote) {
    if (dataWrote === this.lastCodeScanned) {
      this.inputValue = null;
      this.focusToInput();
      return;
    }
    this.lastCodeScanned = dataWrote;

    if (this.timeoutStarted) {
      clearTimeout(this.timeoutStarted);
    }
    this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

    this.inputValue = null;

    if (this.needScanNewPacking) {
      if (this.itemReferencesProvider.checkCodeValue(dataWrote) === this.itemReferencesProvider.codeValue.PACKING) {
        this.checkPackingToUse(dataWrote);
      } else {
        await this.intermediaryService.presentToastError('El código escaneado no corresponde con el de un embalaje.', PositionsToast.BOTTOM);
        this.focusToInput(true, 'error');
      }
    } else if (this.isWaitingSorterFeedback) {
      let errorMessage = `¡Ya ha escanadeo el producto ${this.productToSetInSorter}! Introdúzcalo en el sorter para continuar.`;
      if (this.productToSetInSorter !== dataWrote) {
        errorMessage = `¡El producto ${this.productToSetInSorter} escaneado antes todavía no ha pasado por el sorter!`;
      }
      await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
      this.focusToInput(true, 'error');
    } else {
      if (true == true) {
        this.addScannerRackButton();
        await this.intermediaryService.presentLoading('Registrando entrada de producto...');
        this.inputProductInSorter(dataWrote);
      } else {
        await this.intermediaryService.presentToastError('Escanea un código de caja de producto.', PositionsToast.BOTTOM);
        this.focusToInput(true, 'error');
      }
    }
  }

  async wrongWay() {
    this.timeoutToQuickUser();
    const setWayAsWrong = async () => {
      // Request to server to notify that las product was set in a wrong way and reset the sorter notify led
      const productRef = this.productToSetInSorter || this.productScanned ? this.productScanned.reference : null;
      if (productRef) {
        this.sorterExecutionService
          .postWrongWay({ way: this.idLastWaySet, productReference: productRef })
          .subscribe(async (res: ExecutionSorterModel.WrongWay) => {
            await this.intermediaryService.presentToastSuccess('¡Reportado el aviso de calle equivocada!', 1500, PositionsToast.BOTTOM);
            this.focusToInput(true, 'ok');
            this.resetLastScanProcess();
          }, async (error: HttpRequestModel.Error) => {
            let errorMessage = 'Ha ocurrido un error al intentar avisar del uso de calle equivocada.';
            if (error.error && error.error.errors) {
              errorMessage = error.error.errors;
            }
            await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
            this.focusToInput(true, 'error');
          });
      } else {
        await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar avisar del uso de calle equivocada.', PositionsToast.BOTTOM);
        this.focusToInput(true, 'error');
      }
    };

    await this.intermediaryService.presentConfirm('Se obviará el par escaneado anteriormente y se continuará con el escaneo de productos para el sorter. ¿Continuar?', setWayAsWrong);
  }

  async fullWay() {
    this.timeoutToQuickUser();
    const setWayAsFull = async () => {
      // Request to server to set way as full, assign in sorter a new way and return info to notify to user
      const productRef = this.productToSetInSorter || this.productScanned ? this.productScanned.reference : null;
      if (productRef) {
        this.sorterExecutionService
          .postFullWay({ way: this.idLastWaySet, productReference: productRef })
          .subscribe(async (res: ExecutionSorterModel.FullWay) => {
            await this.intermediaryService.presentToastSuccess('¡Reportado el aviso de calle llena!', 1500, PositionsToast.BOTTOM);
            setTimeout(async () => {
              if (res.success) {
                this.idLastWaySet = res.idNewWay;
                await this.intermediaryService.presentToastSuccess('Se le ha asignado una nueva calle donde continuar introduciendo el artículo.', 1500, PositionsToast.BOTTOM);
                this.focusToInput(true, 'ok');
              } else {
                await this.intermediaryService.presentToastSuccess('No se le ha podido asignar una nueva calle donde introducir el artículo.', 1500, PositionsToast.BOTTOM);
                this.focusToInput(true, 'error');
                this.resetLastScanProcess();
              }
            }, 1.5 * 1000);
          }, async (error: HttpRequestModel.Error) => {
            let errorMessage = 'Ha ocurrido un error al intentar avisar de la calle llena.';
            if (error.error && error.error.errors) {
              errorMessage = error.error.errors;
            }
            await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
            this.focusToInput(true, 'error');
          });
      } else {
        await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar avisar de la calle llena.', PositionsToast.BOTTOM);
        this.focusToInput(true, 'error');
      }
    };

    await this.intermediaryService.presentConfirm('Se marcará la calle actual como llena y se le indicará una nueva calle donde ir metiendo los productos. ¿Continuar?', setWayAsFull);
  }

  private inputProductInSorter(productReference: string) {
    this.sorterInputService
      .postProductScan({ productReference, packingReference: 'P0010' })
      .then(async (res: InputSorterModel.ResponseProductScan) => {
        let resCode = res.code;
        if (resCode == 200) {
          //Respuesta
          const resData = res.data as InputSorterModel.ProductScan;
          this.productToSetInSorter = productReference;
          this.messageGuide = 'COLOQUE EL ARTÍCULO EN LA CALLE INDICADA';
          if(resData.product.reference != undefined && resData.product.reference != null){
            //Product
            this.productScanned = {
              reference: resData.product.reference,
              model: {
                reference: resData.product.model.reference
              },
              size: {
                name: resData.product.size.name
              },
              destinyWarehouse: resData.warehouse ? {
                id: resData.warehouse.id,
                reference: resData.warehouse.reference,
                name: resData.warehouse.name
              } : null
            };
          }else{
            //package
            const resData = res.data as InputSorterModel.ProductScan;

            this.packageScanned = {
              uniqueCode: resData.product.uniqueCode,
              model: {
                reference: resData.product.uniqueCode
              },
              destinyWarehouse: resData.product.order.destinationShop ? {
                id: resData.product.order.destinationShop.id,
                reference: resData.product.order.destinationShop.reference,
                name: resData.product.order.destinationShop.name
              }:null,
              product: resData.product.order.deliveryRequestId ?{
                id: resData.product.order.deliveryRequestId,
              }: null
            };
            this.messageGuide ='';
          }
          await this.intermediaryService.dismissLoading();
          this.processStarted = true;
          
          this.idLastWaySet = (<ExecutionSorterModel.ExecutionWay>resData.way).zoneWay.ways.id;

          this.lastProductIsToBusyWay = resData.wayBusyByAnotherUser;
          if (resData.wayBusyByAnotherUser) {
            this.checkWayWillFree(this.idLastWaySet, this.productToSetInSorter);
          } else {
            await this.intermediaryService.presentToastSuccess(`Esperando respuesta del sorter por la entrada del `+( this.productScanned ? 'producto.': 'paquete.'), 2000, PositionsToast.BOTTOM);
            this.checkProductInWay(productReference);
          }
          this.focusToInput(true, 'ok');
        } else if (resCode == 202) {
          this.productToSetInSorter = productReference;
          const resDataException = res.data as InputSorterModel.ProductScanException;
          await this.intermediaryService.dismissLoading();
          this.processStarted = true;
          this.productScanWithException = true;
          if (resDataException.error.type == 'no_origin_scan') {
            this.destinyForProductScanWithException = null;
          } else if (resDataException.error.type == 'no_way_for_destiny') {
            this.productScanned = {
              reference: resDataException.info.product.reference,
              model: {
                reference: resDataException.info.product.model.reference
              },
              size: {
                name: resDataException.info.product.size.name
              },
              destinyWarehouse: resDataException.info.destinyWarehouse ? {
                id: resDataException.info.destinyWarehouse.id,
                reference: resDataException.info.destinyWarehouse.reference,
                name: resDataException.info.destinyWarehouse.name
              } : null
            };
            this.destinyForProductScanWithException = null;
          }
          this.focusToInput(true, 'ok');
        } else if (res.code == 406 && res.message == 'ProductForWorkbenchException') {
          let resError = res.errors;
          await this.intermediaryService.dismissLoading();
          let errorMessage = `Ha ocurrido un error al intentar registrar la entrada del producto ${productReference} al sorter.`;
          if (resError) {
            errorMessage = resError;
          }
          await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
          this.focusToInput(true, 'error');
        } else {
          let resError = res.errors;
          await this.intermediaryService.dismissLoading();
          let errorMessage = `Ha ocurrido un error al intentar registrar la entrada del producto ${productReference} al sorter.`;
          if (resError) {
            errorMessage = resError;
          }
          await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
          this.focusToInput(true, 'error');
        }
      }, async (error: HttpRequestModel.Error) => {
        await this.intermediaryService.dismissLoading();
        let errorMessage = `Ha ocurrido un error al intentar registrar la entrada del producto ${productReference} al sorter.`;
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
        this.focusToInput(true, 'error');
      });
  }

  private checkProductInWay(productReference1: string) {
    if (!this.isWaitingSorterFeedback) {
      this.isWaitingSorterFeedback = true;

      const checkProductInWayLocal = (productReference: string) => {
        const wayId = this.idLastWaySet;
        this.sorterInputService
          .postCheckProductInWay({ productReference, wayId })
          .subscribe((res: InputSorterModel.CheckProductInWay) => {
            if (!res.is_in_way && this.isWaitingSorterFeedback) {
              if (res.newWay && res.newWay.id) {
                this.idLastWaySet = res.newWay.id;
              }
              setTimeout(() => {
                if (!this.modalScanRack) {
                  checkProductInWayLocal(productReference)
                }
              }, 0.5 * 1000);
            } else {
              this.timeoutToQuickUser();
              this.sorterNotifyAboutProductScanned();
              this.focusToInput(true, 'ok');
            }
          }, (error) => {
            console.error('Error::Subscribe::sorterInputService::postCheckProductInWay', error);
            this.focusToInput();
          });
      };

      checkProductInWayLocal(productReference1);
    }
  }

  private checkWayWillFree(wayId: number, referenceProductScanned: string) {
    let firstCheckOfWayFree = true;
    if (!this.isWaitingWayWillFree) {
      this.isWaitingWayWillFree = true;

      const checkWayWillFreeLocal = (wayIdToCheck: number) => {
        this.sorterInputService
          .postCheckWayIsFree({
            wayId: wayIdToCheck,
            productReference: referenceProductScanned
          })
          .then(async (res: InputSorterModel.ResponseCheckWayIsFree) => {
            if (res.code == 200) {
              let resData = res.data;
              if (resData.sorterFull) {
                await this.intermediaryService.presentToastError(resData.message, PositionsToast.BOTTOM);
                setTimeout(() => {
                  this.timeoutToQuickUser();
                  this.sorterNotifyAboutProductScanned();
                  this.focusToInput();
                }, 2 * 1000);
              } else {
                if (resData.wayFree) {
                  this.timeoutToQuickUser();
                  this.audioProvider.playDefaultOk();
                  if (!firstCheckOfWayFree) {
                    await this.intermediaryService.presentToastSuccess(resData.message, 2000, PositionsToast.BOTTOM);
                  }
                  this.isWaitingWayWillFree = false;

                  await this.intermediaryService.presentToastSuccess(`Esperando respuesta del sorter por la entrada del producto.`, 2000, PositionsToast.BOTTOM);
                  this.checkProductInWay(referenceProductScanned);
                } else if (resData.idNewWay && resData.idNewWay != 0) {
                  this.timeoutToQuickUser();
                  this.audioProvider.playDefaultOk();
                  if (!firstCheckOfWayFree) {
                    await this.intermediaryService.presentToastSuccess(resData.message, 2000, PositionsToast.BOTTOM);
                  }
                  this.isWaitingWayWillFree = false;
                  this.idLastWaySet = resData.idNewWay;

                  await this.intermediaryService.presentToastSuccess(`Esperando respuesta del sorter por la entrada del producto.`, 2000, PositionsToast.BOTTOM);
                  this.checkProductInWay(referenceProductScanned);
                } else {
                  if (firstCheckOfWayFree) {
                    await this.intermediaryService.presentToastError('La calle que se le asignó está ocupada por otro usuario. Espere a que acabe o se le asigne una nueva para continuar', PositionsToast.BOTTOM);
                    firstCheckOfWayFree = false;
                  }
                  if (this.isWaitingWayWillFree && !this.modalScanRack) {
                    setTimeout(() => checkWayWillFreeLocal(wayIdToCheck), 0.5 * 1000);
                  }
                }
              }
            } else {
              if (this.isWaitingWayWillFree && !this.modalScanRack) {
                setTimeout(() => checkWayWillFreeLocal(wayIdToCheck), 0.5 * 1000);
              }
            }
          }, () => {
            if (this.isWaitingWayWillFree && !this.modalScanRack) {
              setTimeout(() => checkWayWillFreeLocal(wayIdToCheck), 0.5 * 1000);
            }
          });
      };

      checkWayWillFreeLocal(wayId);
    }
  }

  private async sorterNotifyAboutProductScanned() {
    await this.intermediaryService.presentToastSuccess(`Continúe escaneando productos.`, TimesToastType.DURATION_SUCCESS_TOAST_2000, PositionsToast.BOTTOM);
    this.resetLastScanProcess();
  }

  private resetLastScanProcess() {
    this.isWaitingSorterFeedback = false;
    this.isWaitingWayWillFree = false;
    this.lastProductIsToBusyWay = false;
    this.productScanWithException = false;
    this.destinyForProductScanWithException = false;
    this.needScanNewPacking = false;
    this.productToSetInSorter = null;
    this.messageGuide = 'ESCANEE EL SIGUIENTE ARTÍCULO';
    this.productScanned = null;
    this.packageScanned = null;
    this.focusToInput();
  }

  private stopExecutionInput() {
    this.isWaitingSorterFeedback = false;
    this.isWaitingWayWillFree = false;
    this.sorterExecutionService
      .postStopExecuteColor()
      .subscribe(async (res: ExecutionSorterModel.StopExecuteColor) => {
        await this.intermediaryService.dismissLoading();
        this.sorterProvider.colorActiveForUser = null;
        this.sorterProvider.colorSelected = null;
        this.sorterProvider.idZoneSelected = null;
        this.sorterProvider.processActiveForUser = null;
        this.location.back();
        this.events.publish(this.LOAD_DATA_INPUT_SORTER);
      }, async (error: HttpRequestModel.Error) => {
        await this.intermediaryService.dismissLoading();
        let errorMessage = 'Ha ocurrido un error al intentar finalizar el proceso.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
      });
  }

  private timeoutToQuickUser() {
    if (this.timeoutToQuickStarted) {
      clearTimeout(this.timeoutToQuickStarted);
    }

    this.timeoutToQuickStarted = setTimeout(async () => {
      await this.intermediaryService.presentLoading('Forzando la salida del usuario de la tarea...');
      setTimeout(() => {
        this.stopExecutionInput();
      }, 3 * 1000);
    }, this.timeMillisToQuickUserFromSorterProcess);
  }

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

  async checkPackingToUse(packingReference: string) {
    await this.intermediaryService.presentLoading('Comprobando embalaje y asignando al artículo...');

    const params: CarrierModel.ParamsCheckPackingAvailability = {
      packingReference: packingReference
    };

    if (this.destinyCodeToGetPacking == 'incidence') {
      params.forIncidences = true;
    } else {
      params.destinyReference = this.destinyCodeToGetPacking;
    }

    this.carrierService
      .postCheckPackingAvailability(params)
      .then(async (res: CarrierModel.ResponseCheckPackingAvailability) => {
        if (res.code == 200) {
          this.assignToPacking(packingReference, false);
        } else {
          await this.intermediaryService.dismissLoading();
          let errorMessage = `Ha ocurrido un error al intentar utilizar el embalaje ${packingReference}.`;
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
          this.focusToInput(true, 'error');
        }
      })
      .catch(async (error) => {
        await this.intermediaryService.dismissLoading();
        let errorMessage = `Ha ocurrido un error al intentar utilizar el embalaje ${packingReference}.`;
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
        this.focusToInput(true, 'error');
      });
  }

  async assignToPacking(packingReferenceToSet: string, showLoading: boolean = true) {
    if (showLoading) {
      await this.intermediaryService.presentLoading('Asignando artículo al embalaje...');
    }

    const paramsCreateInventory = {
      productReference: this.productToSetInSorter,
      avoidAvelonMovement: true,
      packingReference: packingReferenceToSet,
    };

    await this.pickingStoreService
      .postVentilate({
        paramsCreateInventory: paramsCreateInventory,
        needNotifyAvelon: this.productScanned && (!this.productScanned.destinyWarehouse || (this.productScanned.destinyWarehouse && this.productScanned.destinyWarehouse.reference == '000')),
        withSorter: true
      })
      .then(async (res) => {
        if (res.code == 201) {
          this.destiniesWithPacking[this.destinyCodeToGetPacking] = packingReferenceToSet;
          await this.intermediaryService.presentToastSuccess(`El artículo se ha asignado al embalaje ${packingReferenceToSet}`, 4 * 1000, PositionsToast.BOTTOM);
          await this.intermediaryService.dismissLoading();
          this.focusToInput(true, 'ok');

          this.resetLastScanProcess();
        } else {
          let errorMessage = `Ha ocurrido un error al intentar asignar el artículo al embalaje ${packingReferenceToSet}.`;
          if (res.errors && typeof res.errors == 'string') {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
          await this.intermediaryService.dismissLoading();
          this.focusToInput(true, 'error');
        }
      })
      .catch(async (error) => {
        await this.intermediaryService.dismissLoading();
        let errorMessage = `Ha ocurrido un error al intentar asignar el artículo al embalaje ${packingReferenceToSet}.`;
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage, PositionsToast.BOTTOM);
        await this.intermediaryService.dismissLoading();
        this.focusToInput(true, 'error');
      });
  }

  scanPacking(destinyPacking: string) {
    this.destinyCodeToGetPacking = destinyPacking;
    this.inputValue = null;
    this.needScanNewPacking = true;
    this.focusToInput();
  }

  cancelScanPacking() {
    this.destinyCodeToGetPacking = null;
    this.needScanNewPacking = false;
  }

  getPackingScanned(destinyToGet: string): string {
    return this.destiniesWithPacking[destinyToGet] ? `(${this.destiniesWithPacking[destinyToGet]})` : '';
  }
}
