import {Component, OnInit, ViewChild} from '@angular/core';
import {ScannerManualComponent} from "../../../components/scanner-manual/scanner-manual.component";
import {LoadingMessageComponent} from "../../../components/loading-message/loading-message.component";
import {IntermediaryService} from "../../../../../services/src/lib/endpoint/intermediary/intermediary.service";
import {ReceptionsAvelonService} from "../../../../../services/src/lib/endpoint/receptions-avelon/receptions-avelon.service";
import {ReceptionAvelonProvider} from "../../../../../services/src/providers/reception-avelon/reception-avelon.provider";
import {AudioProvider} from "../../../../../services/src/providers/audio-provider/audio-provider.provider";
import {TimesToastType} from "../../../../../services/src/models/timesToastType";
import {PositionsToast} from "../../../../../services/src/models/positionsToast.type";
import {PrinterService} from "../../../../../services/src/lib/printer/printer.service";

@Component({
  selector: 'suite-ean-scanner',
  templateUrl: './ean-scanner.component.html',
  styleUrls: ['./ean-scanner.component.scss']
})
export class EanScannerComponent implements OnInit {

  @ViewChild(ScannerManualComponent) scannerManual: ScannerManualComponent;
  @ViewChild(LoadingMessageComponent) loadingMessageComponent: LoadingMessageComponent;

  private expeditionDataToQuery = null;

  constructor(
    private intermediaryService: IntermediaryService,
    private receptionsAvelonService: ReceptionsAvelonService,
    private printerService: PrinterService,
    private receptionAvelonProvider: ReceptionAvelonProvider,
    private audioProvider: AudioProvider
  ) { }

  ngOnInit() {
    this.expeditionDataToQuery = this.receptionAvelonProvider.expeditionData;
  }

  eanScanned(response: string) {
    const eanScanned = response;
    this.loadingMessageComponent.show(true, 'Comprobando EAN');
    this.scannerManual.setValue(null);
    this.scannerManual.blockScan(true);

    if (this.expeditionDataToQuery != null) {
      this.receptionsAvelonService
        .eanProductPrint(eanScanned, this.expeditionDataToQuery.reference, this.expeditionDataToQuery.providerId)
        .subscribe((resultCheck) => {
          if(resultCheck && resultCheck.resultToPrint && resultCheck.resultToPrint.length > 0 && resultCheck.resultToPrint[0].reference){
            this.processFinishOk({
              hideLoading: true,
              unlockScan: true,
              focusInput: {
                playSound: true
              },
              toast: {
                message: 'Código EAN '+eanScanned+' comprobado, imprimiendo etiqueta de producto ' + resultCheck.resultToPrint[0].reference,
                position: PositionsToast.BOTTOM,
                duration: TimesToastType.DURATION_SUCCESS_TOAST_2000
              }
            });
            this.loadingMessageComponent.show(true, 'Imprimiendo... ' + resultCheck.resultToPrint[0].reference);
            this.printerService.printTagBarcode([resultCheck.resultToPrint[0].reference])
              .subscribe((resPrint) => {
                this.loadingMessageComponent.show(false);
                console.log('Print reference of reception successful');
                if (typeof resPrint == 'boolean') {
                  console.log(resPrint);
                } else {
                  resPrint.subscribe((resPrintTwo) => {
                    console.log('Print reference of reception successful two', resPrintTwo);
                  })
                }
              }, (error) => {
                console.error('Some error success to print reference of reception', error);
              });
          } else {
            this.processFinishError({
              hideLoading: true,
              unlockScan: true,
              focusInput: {
                playSound: true
              },
              toast: {
                message: 'Ha ocurrido un error al intentar comprobar el código EAN '+eanScanned+' escaneado.',
                position: PositionsToast.BOTTOM
              }
            });
          }
        }, (error) =>  {
          this.processFinishError({
            hideLoading: true,
            unlockScan: true,
            focusInput: {
              playSound: true
            },
            toast: {
              message: error && error.error && error.error.errors ? error && error.error && error.error.errors : 'Ha ocurrido un error al intentar comprobar el código EAN escaneado.',
              position: PositionsToast.BOTTOM
            }
          });
        });
    } else {
      this.processFinishError({
        hideLoading: true,
        unlockScan: true,
        focusInput: {
          playSound: true
        },
        toast: {
          message: 'Ha ocurrido un error al intentar comprobar el código EAN escaneado en la expedición.',
          position: PositionsToast.BOTTOM
        }
      });
    }
  }

  private processFinishOk(options: {hideLoading?: boolean, toast?: {message: string, duration: number, position: string}, focusInput?: {playSound?: boolean}, playSound?: boolean, unlockScan?: boolean} = null) {
    if (options.hideLoading) {
      this.loadingMessageComponent.show(false);
    }

    if (options.toast != null) {
      this.intermediaryService.presentToastPrimary(options.toast.message, options.toast.duration, options.toast.position);
    }

    if (options.unlockScan) {
      this.scannerManual.blockScan(false);
    }

    if (options.focusInput != null) {
      this.scannerManual.focusToInput();
      if (options.focusInput.playSound) {
        setTimeout(() => this.audioProvider.playDefaultOk(), 500);
      }
    }

    if (options.playSound != null) {
      this.audioProvider.playDefaultOk();
    }
  }

  private processFinishError(options: {hideLoading?: boolean, toast?: {message: string, duration?: number, position: string}, focusInput?: {playSound?: boolean}, playSound?: boolean, unlockScan?: boolean} = null) {
    if (options.hideLoading) {
      this.loadingMessageComponent.show(false);
    }

    if (options.toast != null) {
      this.intermediaryService.presentToastError(options.toast.message, options.toast.position, options.toast.duration || TimesToastType.DURATION_ERROR_TOAST);
    }

    if (options.unlockScan) {
      this.scannerManual.blockScan(false);
    }

    if (options.focusInput != null) {
      this.scannerManual.focusToInput();
      if (options.focusInput.playSound) {
        setTimeout(() => this.audioProvider.playDefaultError(), 500);
      }
    }

    if (options.playSound != null) {
      this.audioProvider.playDefaultError();
    }
  }
}
