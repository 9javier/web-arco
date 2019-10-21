import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";
import {ScanditProvider} from "../../../../../services/src/providers/scandit/scandit.provider";
import {IntermediaryService} from "@suite/services";
import {OutputSorterModel} from "../../../../../services/src/models/endpoints/OutputSorter";
import {ProductSorterModel} from "../../../../../services/src/models/endpoints/ProductSorter";
import {AlertController} from "@ionic/angular";
import {ToolbarProvider} from "../../../../../services/src/providers/toolbar/toolbar.provider";
import {ExecutionSorterModel} from "../../../../../services/src/models/endpoints/ExecutionSorter";
import {HttpRequestModel} from "../../../../../services/src/models/endpoints/HttpRequest";
import {SorterExecutionService} from "../../../../../services/src/lib/endpoint/sorter-execution/sorter-execution.service";
import {Location} from "@angular/common";

@Component({
  selector: 'sorter-output-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerOutputSorterComponent implements OnInit, OnDestroy {

  messageGuide: string = 'ESCANEAR 1º ARTÍCULO';
  inputValue: string = null;
  lastCodeScanned: string = 'start';
  processStarted: boolean = false;
  firstProductScanned: boolean = false;
  wrongCodeScanned: boolean = false;
  lastProductScannedChecking: ProductSorterModel.ProductSorter = null;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;
  private readonly timeMillisToQuickUserFromSorterProcess: number = 10 * 60 * 1000;

  leftButtonText: string = 'JAULA LLENA.';
  rightButtonText: string = 'CALLE VACÍA';
  leftButtonDanger: boolean = true;

  infoSorterOperation: OutputSorterModel.OutputSorter = null;

  private timeoutToQuickStarted = null;

  constructor(
    private location: Location,
    private alertController: AlertController,
    private intermediaryService: IntermediaryService,
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
            await this.intermediaryService.presentLoading('Finalizando proceso de salida...');
            this.stopExecutionOutput();
          };
          await this.intermediaryService.presentConfirm('Está a punto de finalizar el proceso de salida en el sorter. ¿Está seguro?', callback);
        }
      }
    ]);
    this.infoSorterOperation = this.sorterProvider.infoSorterOutputOperation;
    this.checkWayWithIncidence();
  }

  ngOnDestroy() {
    if (this.timeoutToQuickStarted) {
      clearTimeout(this.timeoutToQuickStarted);
    }
    this.toolbarProvider.optionsActions.next([]);
  }

  focusToInput() {
    document.getElementById('input').focus();
  }

  async keyUpInput(event) {
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

      if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.JAIL
        || this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PALLET) {
        this.assignPackingToProcess(dataWrote);
      } else if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PRODUCT) {
        this.outputProductFromSorter(dataWrote);
      } else {
        if (!this.processStarted) {
          await this.intermediaryService.presentToastError('Escanea un embalaje para comenzar las operaciones.');
        }
      }
    }
  }

  async emptyWay() {
    // TODO Request to server to block the way in sorter before set way as empty
    let textCountdown = 'Revisa para confirmar que la calle está completamente vacía.<br/>';
    let countdown = 20;
    let enableSetWayAsEmpty: boolean = false;

    let alertEmptyPacking = await this.alertController.create({
      header: '¿Está vacía?',
      message: textCountdown + '<h2>' + countdown + 's</h2>',
      backdropDismiss: false,
      buttons: [
        'Cancelar',
        {
          text: 'Confirmar',
          handler: () => {
            if (enableSetWayAsEmpty) {
              this.setWayAsEmpty();
            } else {
              return false;
            }
          }
        }
      ]
    });

    await alertEmptyPacking.present();

    let intervalChangeCountdown = setInterval(() => {
      countdown--;
      if (countdown == -1) {
        clearInterval(intervalChangeCountdown);
        enableSetWayAsEmpty = true;
      } else {
        alertEmptyPacking.message = textCountdown + '<h2>' + countdown + 's</h2>';
      }
    }, 1000);
  }

  packingFull() {
    this.setPackingAsFull();
  }

  private async assignPackingToProcess(packingReference: string) {
    await this.intermediaryService.presentLoading('Asignando embalaje al proceso...');

    // TODO Request to server to assign packing to process
    this.processStarted = true;
    this.infoSorterOperation.packingReference = packingReference;
    await this.intermediaryService.dismissLoading();
    await this.intermediaryService.presentToastSuccess(`Iniciando proceso con el embalaje ${packingReference}.`);
    this.focusToInput();
  }

  private async outputProductFromSorter(productReference: string) {
    await this.intermediaryService.presentLoading('Comprobando producto escaneado...');

    // TODO Request to server to log output of product from sorter
    this.firstProductScanned = true;
    this.messageGuide = 'ESCANEAR ARTÍCULO';
    await this.intermediaryService.dismissLoading();
    await this.intermediaryService.presentToastSuccess(`Product ${productReference} añadido al embalaje seleccionado.`);
    this.focusToInput();
  }

  private async setPackingAsFull() {
    // TODO Request to server to set packing as full
    // After it, scan first product in sorter
  }

  private async setWayAsEmpty() {
    await this.intermediaryService.presentLoading('Comprobando que la calle esté vacía...');

    // TODO Request to server to set way as empty
    this.sorterProvider.colorActiveForUser = null;
    await this.intermediaryService.dismissLoading();
    await this.intermediaryService.presentToastSuccess(`Registrada la calle como vacía.`);
    this.location.back();
  }

  private checkWayWithIncidence() {
    let someCounter = 0;
    let checkWayWithIncidenceLocal = () => {
      someCounter++;
      let wayId = this.infoSorterOperation.wayId;

      //  TODO Request to check if way have any incidence
      let existIncidence = false;
      if (someCounter == 100) {
        existIncidence = true;
      }
      if (existIncidence) {
        this.timeoutToQuickUser();
        this.wrongCodeDetected();
        this.focusToInput();
      } else {
        setTimeout(() => checkWayWithIncidenceLocal(), 1000);
      }
    };

    checkWayWithIncidenceLocal();
  }

  private async wrongCodeDetected() {
    await this.intermediaryService.presentToastError('Se ha escaneado un código erróneo para la calle actual.');
    this.wrongCodeScanned = true;
    this.leftButtonDanger = false;
    this.lastProductScannedChecking = {
      reference: '001234567891234569',
      destinyWarehouse: {
        id: 1,
        name: 'MADRIDES',
        reference: '878'
      },
      model: {
        reference: '123456'
      },
      size: {
        name: '41'
      }
    }
  }

  private stopExecutionOutput() {
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
        this.stopExecutionOutput();
      }, 3 * 1000);
    }, this.timeMillisToQuickUserFromSorterProcess);
  }
}
