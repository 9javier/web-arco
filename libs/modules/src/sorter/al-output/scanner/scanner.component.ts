import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";
import {ScanditProvider} from "../../../../../services/src/providers/scandit/scandit.provider";
import {IntermediaryService} from "@suite/services";
import {OutputSorterModel} from "../../../../../services/src/models/endpoints/OutputSorter";
import {ProductSorterModel} from "../../../../../services/src/models/endpoints/ProductSorter";
import {AlertController} from "@ionic/angular";
import {ExecutionSorterModel} from "../../../../../services/src/models/endpoints/ExecutionSorter";
import {HttpRequestModel} from "../../../../../services/src/models/endpoints/HttpRequest";
import {SorterExecutionService} from "../../../../../services/src/lib/endpoint/sorter-execution/sorter-execution.service";
import {Location} from "@angular/common";
import {SorterOutputService} from "../../../../../services/src/lib/endpoint/sorter-output/sorter-output.service";
import {SorterOutputModel} from "../../../../../services/src/models/endpoints/SorterOutput";

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
  isFirstProductScanned: boolean = false;
  wrongCodeScanned: boolean = false;
  lastProductScannedChecking: ProductSorterModel.ProductSorter = null;
  packingIsFull: boolean = false;
  lastProductScanned: boolean = false;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;
  private readonly timeMillisToQuickUserFromSorterProcess: number = 10 * 60 * 1000;

  leftButtonText: string = 'JAULA LLENA.';
  rightButtonText: string = 'CALLE VACÍA';
  leftButtonDanger: boolean = true;

  infoSorterOperation: OutputSorterModel.OutputSorter = null;

  private timeoutToQuickStarted = null;
  private checkByWrongCode: boolean = true;

  constructor(
    private location: Location,
    private alertController: AlertController,
    private intermediaryService: IntermediaryService,
    private sorterExecutionService: SorterExecutionService,
    public sorterProvider: SorterProvider,
    private sorterOutputService: SorterOutputService,
    private scanditProvider: ScanditProvider,
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    this.timeMillisToQuickUserFromSorterProcess = al_environment.time_millis_quick_user_sorter_process;
    setTimeout(() => {
      document.getElementById('input').focus();
    },800); }
  
  ngOnInit() {
    this.infoSorterOperation = this.sorterProvider.infoSorterOutputOperation;
  }

  ngOnDestroy() {
    this.checkByWrongCode = false;
    if (this.timeoutToQuickStarted) {
      clearTimeout(this.timeoutToQuickStarted);
    }
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
        if (this.processStarted && this.infoSorterOperation.packingReference) {
          await this.intermediaryService.presentToastError('Código de producto erróneo.', 2000);
          this.focusToInput();
        } else {
          this.assignPackingToProcess(dataWrote);
        }
      } else if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PRODUCT) {
        if (this.processStarted && this.infoSorterOperation.packingReference) {
          this.outputProductFromSorter(dataWrote);
        } else if (this.packingIsFull) {
          await this.intermediaryService.presentToastError('Escanea el nuevo embalaje a utilizar antes de continuar con los productos.', 2000);
          this.focusToInput();
        } else {
          await this.intermediaryService.presentToastError('Escanea el embalaje a utilizar antes de comenzar con los productos.', 2000);
          this.focusToInput();
        }
      } else {
        if (!this.processStarted) {
          await this.intermediaryService.presentToastError('Escanea un embalaje para comenzar las operaciones.');
          this.focusToInput();
        }
      }
    }
  }

  async emptyWay() {
    let showModalWithCount = async () => {
      let textCountdown = 'Revisa para confirmar que la calle está completamente vacía.<br/>';
      let countdown = 10;
      let enableSetWayAsEmpty: boolean = false;

      let alertEmptyPacking = await this.alertController.create({
        header: '¿Está vacía?',
        message: textCountdown + '<h2>' + countdown + 's</h2>',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Cancelar',
            handler: () => this.unlockCurrentWay()
          },
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
    };

    await this.intermediaryService.presentLoading('Bloqueando procesos en calle...');

    this.sorterOutputService
      .postBlockSorterWay({
        block: true,
        wayId: this.infoSorterOperation.wayId.toString()
      })
      .then(async (res: SorterOutputModel.ResponseBlockSorterWay) => {
        if (res.code == 200) {
          await this.intermediaryService.dismissLoading();
          showModalWithCount();
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar bloquear los procesos en la calle actual.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        }
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar bloquear los procesos en la calle actual.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
      .catch(async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar bloquear los procesos en la calle actual.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      });
  }

  async packingFull() {
    let callback = () => {
      this.packingIsFull = true;
      this.messageGuide = 'Escanea el primer artículo de la calle.';
    };
    await this.intermediaryService.presentConfirm(`¿Quiere marcar el embalaje ${this.infoSorterOperation.packingReference} como lleno y continuar trabajando con otro embalaje?`, callback);
  }

  private async assignPackingToProcess(packingReference: string) {
    await this.intermediaryService.presentLoading('Asignando embalaje al proceso...');

    this.sorterOutputService
      .postAssignPackingToWay({
        packingReference,
        wayId: this.infoSorterOperation.wayId.toString()
      })
      .then(async (res: SorterOutputModel.ResponseAssignPackingToWay) => {
        if (res.code == 200) {
          // If output process is not started yet (first packing scanned) start here to check if current way have incidences
          if (!this.processStarted) {
            this.checkWayWithIncidence();
          }

          this.messageGuide = 'ESCANEAR 1º ARTÍCULO';
          this.processStarted = true;
          this.packingIsFull = false;
          this.lastProductScanned = false;
          this.infoSorterOperation.packingReference = packingReference;
          await this.intermediaryService.dismissLoading();
          await this.intermediaryService.presentToastSuccess(`Iniciando proceso con el embalaje ${packingReference}.`);
          this.focusToInput();
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar asignar el embalaje escaneado al proceso.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        }
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar asignar el embalaje escaneado al proceso.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
      .catch(async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar asignar el embalaje escaneado al proceso.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      });
  }

  private async outputProductFromSorter(productReference: string) {
    await this.intermediaryService.presentLoading('Comprobando producto escaneado...');

    this.sorterOutputService
      .postScanProductPutInPacking({
        productReference,
        packingReference: this.infoSorterOperation.packingReference,
        wayId: this.infoSorterOperation.wayId,
        fullPacking: this.packingIsFull
      })
      .then(async (res: SorterOutputModel.ResponseScanProductPutInPacking) => {
        if (res.code == 201) {
          await this.intermediaryService.dismissLoading();

          if (res.data.processStopped) {
            await this.intermediaryService.presentToastSuccess('Proceso de salida finalizado.', 2000);
            this.stopExecutionOutput();
          } else {
            if (this.wrongCodeScanned) {
              await this.intermediaryService.presentToastSuccess(`Producto ${productReference} comprobado y válido. Puede añadirlo al embalaje.`);
            } else {
              await this.intermediaryService.presentToastSuccess(`Producto ${productReference} comprobado y válido.`);
              if (this.packingIsFull) {
                this.lastProductScanned = true;
                this.setPackingAsFull();
              } else {
                this.isFirstProductScanned = true;
                this.messageGuide = 'ESCANEAR ARTÍCULO';
                this.focusToInput();
              }
            }
          }
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar comprobar el producto escaneado.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        }
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar comprobar el producto escaneado.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
      .catch(async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar comprobar el producto escaneado.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      });
  }

  private async setPackingAsFull() {
    await this.intermediaryService.presentLoading('Registrado embalaje como lleno...');

    this.sorterOutputService
      .postPackingFull({
        packingReference: this.infoSorterOperation.packingReference,
        wayId: this.infoSorterOperation.wayId.toString()
      })
      .then(async (res: SorterOutputModel.ResponsePackingFull) => {
        if (res.code == 200) {
          this.infoSorterOperation.packingReference = null;
          this.messageGuide = 'Escanea una jaula nueva para continuar';
          await this.intermediaryService.presentToastSuccess('Embalaje registrado como lleno en el sistema. Escanea un nuevo embalaje para continuar con el proceso.');
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar registrar el embalaje como lleno.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        }
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar registrar el embalaje como lleno.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
      .catch(async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar registrar el embalaje como lleno.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      });
  }

  private async setWayAsEmpty() {
    await this.intermediaryService.presentLoading('Comprobando que la calle esté vacía...');

    this.sorterOutputService
      .postEmptyWay({
        wayId: this.infoSorterOperation.wayId.toString()
      })
      .then(async (res: SorterOutputModel.ResponseEmptyWay) => {
        if (res.code == 200) {
          this.sorterProvider.colorActiveForUser = null;
          await this.intermediaryService.dismissLoading();
          await this.intermediaryService.presentToastSuccess(`Registrada la calle como vacía.`);
          this.stopExecutionOutput();
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar marcar como vacía la calle.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        }
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar marcar como vacía la calle.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
      .catch(async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar marcar como vacía la calle.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      });
  }

  private async unlockCurrentWay() {
    await this.intermediaryService.presentLoading('Desblloqueando procesos en calle...');

    this.sorterOutputService
      .postBlockSorterWay({
        wayId: this.infoSorterOperation.wayId.toString(),
        block: false
      })
      .then(async (res: SorterOutputModel.ResponseBlockSorterWay) => {
        if (res.code == 200) {
          await this.intermediaryService.presentToastSuccess('Calle desbloqueada para continuar con su uso.');
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar desbloquear los procesos en la calle actual.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        }
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar desbloquear los procesos en la calle actual.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
      .catch(async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar desbloquear los procesos en la calle actual.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
  }

  private checkWayWithIncidence() {
    let someCounter = 0;
    let checkWayWithIncidenceLocal = () => {
      someCounter++;
      let wayId = this.infoSorterOperation.wayId;

      this.sorterOutputService
        .postGetIncidenceWay({
          way: wayId
        })
        .then(async (res: SorterOutputModel.ResponseGetIncidenceWay) => {
          if (res.code == 201 && res.data) {
            this.timeoutToQuickUser();
            this.wrongCodeDetected();
            this.focusToInput();
          } else if (this.checkByWrongCode) {
            setTimeout(() => checkWayWithIncidenceLocal(), 1000);
          }
        }, (error) => {
          console.error('Error::onrejected::sorterOutputService::postGetIncidenceWay', error)
        })
        .catch((error) => {
          console.error('Error::catch::sorterOutputService::postGetIncidenceWay', error)
        });
    };

    checkWayWithIncidenceLocal();
  }

  private async wrongCodeDetected() {
    await this.intermediaryService.presentToastError('Se ha escaneado un código erróneo para la calle actual.');
    this.wrongCodeScanned = true;
    this.leftButtonDanger = false;
    this.checkByWrongCode = false;
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
        this.checkByWrongCode = false;
        this.location.back();
      }, async (error: HttpRequestModel.Error) => {
        await this.intermediaryService.dismissLoading();
        let errorMessage = 'Ha ocurrido un error al intentar finalizar el proceso.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage, 2000);
        this.focusToInput();
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
