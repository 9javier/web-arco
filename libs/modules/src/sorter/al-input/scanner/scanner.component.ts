import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";
import {ScanditProvider} from "../../../../../services/src/providers/scandit/scandit.provider";
import {IntermediaryService} from "@suite/services";
import {ProductSorterModel} from "../../../../../services/src/models/endpoints/ProductSorter";
import {SorterInputService} from "../../../../../services/src/lib/endpoint/sorter-input/sorter-input.service";
import {InputSorterModel} from "../../../../../services/src/models/endpoints/InputSorter";
import {SorterExecutionService} from "../../../../../services/src/lib/endpoint/sorter-execution/sorter-execution.service";
import {ExecutionSorterModel} from "../../../../../services/src/models/endpoints/ExecutionSorter";
import {ToolbarProvider} from "../../../../../services/src/providers/toolbar/toolbar.provider";
import {Location} from "@angular/common";
import {HttpRequestModel} from "../../../../../services/src/models/endpoints/HttpRequest";
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ScannerRackComponent } from '../scanner-rack/scanner-rack.component';

@Component({
  selector: 'sorter-input-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerInputSorterComponent implements OnInit, OnDestroy {

  messageGuide = 'ARTÍCULO';
  inputValue: string = null;
  lastCodeScanned = 'start';
  processStarted = false;
  isWaitingSorterFeedback = false;
  productToSetInSorter: string = null;
  idLastWaySet: number = null;
  modalScannRack = false;

  productScanned: ProductSorterModel.ProductSorter = null;

  // Reset of scanner to scan same code multiple times
  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;
  private readonly timeMillisToQuickUserFromSorterProcess: number = 10 * 60 * 1000;

  // Footer buttons
  leftButtonText = 'CARRIL. EQUIV.';
  rightButtonText = 'NO CABE CAJA';
  leftButtonDanger = true;

  private timeoutToQuickStarted = null;

  constructor(
    private modalCtrl: ModalController,
    private location: Location,
    private intermediaryService: IntermediaryService,
    private sorterInputService: SorterInputService,
    private sorterExecutionService: SorterExecutionService,
    public sorterProvider: SorterProvider,
    private scanditProvider: ScanditProvider,
    private toolbarProvider: ToolbarProvider
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

  focusToInput() {
    setTimeout(() => {
        if (!this.isWaitingSorterFeedback && document.getElementById('input')) {
          document.getElementById('input').focus()
        }
      }, 500);
  }

  async presentScannerRackModal() {
    console.log(this.productScanned);
    this.addScannerRackButton();
    this.modalScannRack = true;
    const scannerModal = await this.modalCtrl.create({
      component: ScannerRackComponent,
      componentProps: {
        'productScanned': this.productScanned
      }
    });

    scannerModal.onDidDismiss().then(async (data) => {
      if (data.data.close) {
        this.isWaitingSorterFeedback = false;
        this.modalScannRack = false;
        this.addScannerRackButton();
        this.checkProductInWay(this.productScanned.reference);
      } else {
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
        icon: 'keypad',
        label: 'Teclado',
        action: async () => {
          // TODO: Functions keyboard
        }
      },
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
      console.log('STEP: 1');
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

    if (this.isWaitingSorterFeedback) {
      if (this.productToSetInSorter !== dataWrote) {
        await this.intermediaryService.presentToastError(`¡El producto ${this.productToSetInSorter} escaneado antes todavía no ha pasado por el sorter!`, 2000);
      } else {
        await this.intermediaryService.presentToastError(`¡Ya ha escanadeo el producto ${this.productToSetInSorter}! Introdúzcalo en el sorter para continuar.`, 2000);
      }
      this.focusToInput();
    } else {
      if (this.scanditProvider.checkCodeValue(dataWrote) === this.scanditProvider.codeValue.PRODUCT) {
        this.addScannerRackButton();
        await this.intermediaryService.presentLoading('Registrando entrada de producto...');
        this.inputProductInSorter(dataWrote);
      } else {
        await this.intermediaryService.presentToastError('Escanea un código de caja de producto.', 1500);
        this.focusToInput();
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
            await this.intermediaryService.presentToastSuccess('¡Reportado el aviso de calle equivocada!', 1500);
            this.resetLastScanProcess();
            this.focusToInput();
          }, async (error: HttpRequestModel.Error) => {
            let errorMessage = 'Ha ocurrido un error al intentar avisar del uso de calle equivocada.';
            if (error.error && error.error.errors) {
              errorMessage = error.error.errors;
            }
            await this.intermediaryService.presentToastError(errorMessage, 2000);
            this.focusToInput();
          });
      } else {
        await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar avisar del uso de calle equivocada.', 2000);
        this.focusToInput();
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
            await this.intermediaryService.presentToastSuccess('¡Reportado el aviso de calle llena!', 1500);
            setTimeout(async () => {
              if (res.success) {
                this.idLastWaySet = res.idNewWay;
                await this.intermediaryService.presentToastSuccess('Se le ha asignado una nueva calle donde continuar introduciendo el artículo.', 1500);
              } else {
                this.resetLastScanProcess();
                await this.intermediaryService.presentToastSuccess('No se le ha podido asignar una nueva calle donde introducir el artículo.', 1500);
              }
            }, 1.5 * 1000);
            this.focusToInput();
          }, async (error: HttpRequestModel.Error) => {
            let errorMessage = 'Ha ocurrido un error al intentar avisar de la calle llena.';
            if (error.error && error.error.errors) {
              errorMessage = error.error.errors;
            }
            await this.intermediaryService.presentToastError(errorMessage, 2000);
            this.focusToInput();
          });
      } else {
        await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar avisar de la calle llena.', 2000);
        this.focusToInput();
      }
    };

    await this.intermediaryService.presentConfirm('Se marcará la calle actual como llena y se le indicará una nueva calle donde ir metiendo los productos. ¿Continuar?', setWayAsFull);
  }

  private inputProductInSorter(productReference: string) {
    this.sorterInputService
      .postProductScan({ productReference, packingReference: 'P0010' })
      .subscribe(async (res: InputSorterModel.ProductScan) => {
        this.productToSetInSorter = productReference;
        this.messageGuide = 'COLOQUE EL ARTÍCULO EN LA CALLE INDICADA';

        await this.intermediaryService.dismissLoading();
        this.processStarted = true;
        this.productScanned = {
          reference: res.product.reference,
          model: {
            reference: res.product.model.reference
          },
          size: {
            name: res.product.size.name
          },
          destinyWarehouse: res.warehouse ? {
            id: res.warehouse.id,
            reference: res.warehouse.reference,
            name: res.warehouse.name
          } : null
        };
        this.idLastWaySet = (<ExecutionSorterModel.ExecutionWay>res.way).zoneWay.ways.id;

        await this.intermediaryService.presentToastSuccess(`Esperando respuesta del sorter por la entrada del producto.`, 2000);

        this.focusToInput();

        this.checkProductInWay(productReference);
      }, async (error: HttpRequestModel.Error) => {
        let errorMessage = `Ha ocurrido un error al intentar registrar la entrada del producto ${productReference} al sorter.`;
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage, 1500);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
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
              setTimeout(() => {
                if (!this.modalScannRack) {
                  checkProductInWayLocal(productReference)
                }
              }, 0.5 * 1000);
            } else {
              this.timeoutToQuickUser();
              this.sorterNotifyAboutProductScanned();
              this.focusToInput();
            }
          }, (error) => {
            console.error('Error::Subscribe::sorterInputService::postCheckProductInWay', error);
            this.focusToInput();
          });
      };

      checkProductInWayLocal(productReference1);
    }
  }

  private async sorterNotifyAboutProductScanned() {
    await this.intermediaryService.presentToastSuccess(`Continúe escaneando productos.`);
    this.resetLastScanProcess();
  }

  private resetLastScanProcess() {
    this.isWaitingSorterFeedback = false;
    this.productToSetInSorter = null;
    this.messageGuide = 'ESCANEE EL SIGUIENTE ARTÍCULO';
    this.productScanned = null;
    this.focusToInput();
  }

  private stopExecutionInput() {
    this.isWaitingSorterFeedback = false;
    this.sorterExecutionService
      .postStopExecuteColor()
      .subscribe(async (res: ExecutionSorterModel.StopExecuteColor) => {
        await this.intermediaryService.dismissLoading();
        this.sorterProvider.colorActiveForUser = null;
        this.location.back();
      }, async (error: HttpRequestModel.Error) => {
        await this.intermediaryService.dismissLoading();
        let errorMessage = 'Ha ocurrido un error al intentar finalizar el proceso.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage, 2000);
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
}
