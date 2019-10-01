import {Component, OnInit} from '@angular/core';
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";
import {ScanditProvider} from "../../../../../services/src/providers/scandit/scandit.provider";
import {IntermediaryService} from "@suite/services";
import {ProductSorterModel} from "../../../../../services/src/models/endpoints/ProductSorter";
import {SorterInputService} from "../../../../../services/src/lib/endpoint/sorter-input/sorter-input.service";
import {InputSorterModel} from "../../../../../services/src/models/endpoints/InputSorter";

@Component({
  selector: 'sorter-input-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerInputSorterComponent implements OnInit {

  messageGuide: string = 'ARTÍCULO';
  inputValue: string = null;
  lastCodeScanned: string = 'start';
  processStarted: boolean = false;
  isWaitingSorterFeedback: boolean = false;
  productToSetInSorter: string = null;

  productScanned: ProductSorterModel.ProductSorter = null;

  // Reset of scanner to scan same code multiple times
  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  // Footer buttons
  leftButtonText: string = 'CARRIL. EQUIV.';
  rightButtonText: string = 'NO CABE CAJA';
  leftButtonDanger: boolean = true;

  constructor(
    private intermediaryService: IntermediaryService,
    private sorterInputService: SorterInputService,
    public sorterProvider: SorterProvider,
    private scanditProvider: ScanditProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input').focus();
    },800); }
  
  ngOnInit() {

  }

  focusToInput() {
    if (!this.isWaitingSorterFeedback) {
      document.getElementById('input').focus();
    }
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

      if (this.isWaitingSorterFeedback && this.productToSetInSorter != dataWrote) {
        await this.intermediaryService.presentToastError(`¡El producto ${this.productToSetInSorter} escaneado antes todavía no ha pasado por el sorter!`, 2000);
      } else {
        if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PRODUCT) {
          await this.intermediaryService.presentLoading('Registrando entrada de producto...');
          this.inputProductInSorter(dataWrote);
        } else {
          await this.intermediaryService.presentToastError('Escanea un código de caja de producto.', 1500);
        }
      }
    }
  }

  private inputProductInSorter(productReference: string) {
    this.sorterInputService
      .postProductScan({ productReference })
      .subscribe(async (res: InputSorterModel.ProductScan) => {
        this.isWaitingSorterFeedback = true;
        this.productToSetInSorter = productReference;
        this.messageGuide = '¡ESPERE!';

        await this.intermediaryService.dismissLoading();
        this.processStarted = true;
        this.productScanned = {
          reference: res.reference,
          model: {
            reference: res.model.reference
          },
          size: {
            name: res.size.name
          },
          destinyWarehouse: res.destinyWarehouse ? {
            id: res.destinyWarehouse.id,
            reference: res.destinyWarehouse.reference,
            name: res.destinyWarehouse.name
          } : null
        };

        await this.intermediaryService.presentToastSuccess(`Esperando respuesta del sorter por la entrada del producto.`, 2000);
      }, async (error) => {
        await this.intermediaryService.presentToastError(`Ha ocurrido un error al intentar registrar la entrada del producto ${productReference} al sorter.`, 1500);
        await this.intermediaryService.dismissLoading();
      });
  }
}
