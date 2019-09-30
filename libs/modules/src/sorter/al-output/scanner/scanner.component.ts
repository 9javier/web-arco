import {Component, OnInit} from '@angular/core';
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";
import {ScanditProvider} from "../../../../../services/src/providers/scandit/scandit.provider";
import {IntermediaryService} from "@suite/services";
import {OutputSorterModel} from "../../../../../services/src/models/endpoints/OutputSorter";
import {ProductSorterModel} from "../../../../../services/src/models/endpoints/ProductSorter";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'sorter-output-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerOutputSorterComponent implements OnInit {

  messageGuide: string = 'ESCANEAR 1º ARTÍCULO';
  inputValue: string = null;
  lastCodeScanned: string = 'start';
  processStarted: boolean = false;
  firstProductScanned: boolean = false;
  wrongCodeScanned: boolean = false;
  lastProductScannedChecking: ProductSorterModel.ProductSorter = null;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  leftButtonText: string = 'JAULA LLENA.';
  rightButtonText: string = 'CALLE VACÍA';
  leftButtonDanger: boolean = true;

  infoSorterOperation: OutputSorterModel.OutputSorter = null;

  constructor(
    private alertController: AlertController,
    private intermediaryService: IntermediaryService,
    public sorterProvider: SorterProvider,
    private scanditProvider: ScanditProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input').focus();
    },800); }
  
  ngOnInit() {
    this.infoSorterOperation = {
      destinyWarehouse: {
        name: 'Store Destiny',
        reference: 'REF',
        id: 1
      }
    };
  }

  focusToInput() {
    document.getElementById('input').focus();
  }

  async keyUpInput(event) {
    let dataWrote = (this.inputValue || "").trim();

    if (event.keyCode == 13 && dataWrote) {
      if (dataWrote === this.lastCodeScanned) {
        this.inputValue = null;
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
        this.processStarted = true;
        this.infoSorterOperation.packingReference = dataWrote;
        await this.intermediaryService.presentToastSuccess(`Iniciando proceso con el embalaje ${dataWrote}.`);
      } else if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PRODUCT) {
        this.firstProductScanned = true;
        this.messageGuide = 'ESCANEAR ARTÍCULO';
        await this.intermediaryService.presentToastSuccess(`Product ${dataWrote} añadido al embalaje seleccionado.`);
      } else {
        if (!this.processStarted) {
          await this.intermediaryService.presentToastError('Escanea un embalaje para comenzar las operaciones.');
        }
      }
    }
  }

  async emptyPacking() {
    let textCountdown = 'Revisa para confirmar que la calle está completamente vacía.<br/>';
    let countdown = 20;

    let alertEmptyPacking = await this.alertController.create({
      header: '¿Está vacía?',
      message: textCountdown + '<h2>' + countdown + 's</h2>',
      backdropDismiss: false,
      buttons: [
        'Cancelar',
        {
          text: 'Confirmar',
          handler: async () => {
            await this.intermediaryService.presentToastSuccess(`Registrada la calle como vacía.`);
          }
        }
      ]
    });

    await alertEmptyPacking.present();

    let intervalChangeCountdown = setInterval(() => {
      countdown--;
      if (countdown == -1) {
        clearInterval(intervalChangeCountdown);
        alertEmptyPacking.dismiss();
      } else {
        alertEmptyPacking.message = textCountdown + '<h2>' + countdown + 's</h2>';
      }
    }, 1000);
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
}
