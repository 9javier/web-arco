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

@Component({
  selector: 'sorter-input-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerInputSorterComponent implements OnInit, OnDestroy {

  messageGuide: string = 'ARTÍCULO';
  inputValue: string = null;
  lastCodeScanned: string = 'start';
  processStarted: boolean = false;
  isWaitingSorterFeedback: boolean = false;
  productToSetInSorter: string = null;
  idLastWaySet: number = null;

  productScanned: ProductSorterModel.ProductSorter = null;

  // Reset of scanner to scan same code multiple times
  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;
  private readonly timeMillisToQuickUserFromSorterProcess: number = 10 * 60 * 1000;

  // Footer buttons
  leftButtonText: string = 'CARRIL. EQUIV.';
  rightButtonText: string = 'NO CABE CAJA';
  leftButtonDanger: boolean = true;

  private timeoutToQuickStarted = null;

  constructor(
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
    this.toolbarProvider.optionsActions.next([
      {
        icon: 'hand',
        label: 'Finalizar',
        action: async () => {
          this.timeoutToQuickUser();
          let callback = async () => {
            await this.intermediaryService.presentLoading('Finalizando proceso de entrada...');
            this.stopExecutionInput();
          };
          await this.intermediaryService.presentConfirm('Está a punto de finalizar el proceso de entrada en el sorter. ¿Está seguro?', callback);
        }
      }
    ]);
    this.timeoutToQuickUser();
  }

  ngOnDestroy() {
    if (this.timeoutToQuickStarted) {
      clearTimeout(this.timeoutToQuickStarted);
    }
    this.toolbarProvider.optionsActions.next([]);
  }

  focusToInput() {
    if (!this.isWaitingSorterFeedback) {
      setTimeout(() => document.getElementById('input').focus(), 500);
    }
  }

  async keyUpInput(event) {
    this.timeoutToQuickUser();
    let dataWrote = (this.inputValue || "").trim();

    if (event.keyCode == 13 && dataWrote) {
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

      if (this.isWaitingSorterFeedback && this.productToSetInSorter != dataWrote) {
        await this.intermediaryService.presentToastError(`¡El producto ${this.productToSetInSorter} escaneado antes todavía no ha pasado por el sorter!`, 2000);
        this.focusToInput();
      } else {
        if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PRODUCT) {
          await this.intermediaryService.presentLoading('Registrando entrada de producto...');
          this.inputProductInSorter(dataWrote);
        } else {
          await this.intermediaryService.presentToastError('Escanea un código de caja de producto.', 1500);
          this.focusToInput();
        }
      }
    }
  }

  async wrongWay() {
    this.timeoutToQuickUser();
    let setWayAsWrong = async () => {
      // Request to server to notify that las product was set in a wrong way and reset the sorter notify led
      let productRef = this.productToSetInSorter || this.productScanned ? this.productScanned.reference : null;
      if (productRef) {
        this.sorterExecutionService
          .postWrongWay({ way: this.idLastWaySet, productReference: productRef })
          .subscribe(async (res: ExecutionSorterModel.WrongWay) => {
            await this.intermediaryService.presentToastSuccess('¡Reportado el aviso de calle equivocada!', 1500);
            this.resetLastScanProcess();
            this.focusToInput();
          }, async (error) => {
            console.error('Error::Subscribe::sorterExecutionService::postWrongWay', error);
            await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar avisar del uso de calle equivocada.', 2000);
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
    let setWayAsFull = async () => {
      // Request to server to set way as full, assign in sorter a new way and return info to notify to user
      let productRef = this.productToSetInSorter || this.productScanned ? this.productScanned.reference : null;
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
          }, async (error) => {
            console.error('Error::Subscribe::sorterExecutionService::postFullWay', error);
            await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar avisar de la calle llena.', 2000);
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
        this.isWaitingSorterFeedback = true;
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
      }, async (error) => {
        await this.intermediaryService.presentToastError(`Ha ocurrido un error al intentar registrar la entrada del producto ${productReference} al sorter.`, 1500);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      });
  }

  private checkProductInWay(productReference: string) {
    let checkProductInWayLocal = (productReference: string) => {
      let wayId = this.idLastWaySet;
      this.sorterInputService
        .postCheckProductInWay({ productReference, wayId })
        .subscribe((res: InputSorterModel.CheckProductInWay) => {
          if (!res.is_in_way && this.isWaitingSorterFeedback) {
            setTimeout(() => checkProductInWayLocal(productReference), 1000);
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

    checkProductInWayLocal(productReference);
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
  }

  private stopExecutionInput() {
    this.sorterExecutionService
      .postStopExecuteColor()
      .subscribe(async (res: ExecutionSorterModel.StopExecuteColor) => {
        await this.intermediaryService.dismissLoading();
        this.location.back();
      }, async (error) => {
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar finalizar el proceso.', 2000);
        console.error('Error::Subscribe::sorterExecutionService::postStopExecuteColor', error);
      });
  }

  private timeoutToQuickUser() {
    console.debug('Test::timeoutToQuickUser');
    if (this.timeoutToQuickStarted) {
      console.debug('Test::clear > timeoutToQuickUser');
      clearTimeout(this.timeoutToQuickStarted);
    }

    this.timeoutToQuickStarted = setTimeout(async () => {
      console.debug('Test::timeout quick');
      await this.intermediaryService.presentLoading('Forzando la salida del usuario de la tarea...');
      setTimeout(() => {
        console.debug('Test::timeout hide loading');
        this.stopExecutionInput();
      }, 3 * 1000);
    }, this.timeMillisToQuickUserFromSorterProcess);
  }
}
