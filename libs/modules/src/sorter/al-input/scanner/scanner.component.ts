import {Component, OnInit} from '@angular/core';
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";
import {ScanditProvider} from "../../../../../services/src/providers/scandit/scandit.provider";
import {IntermediaryService} from "@suite/services";
import {ProductSorterModel} from "../../../../../services/src/models/endpoints/ProductSorter";

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

  productScanned: ProductSorterModel.ProductSorter = null;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  leftButtonText: string = 'CARRIL. EQUIV.';
  rightButtonText: string = 'NO CABE CAJA';
  leftButtonDanger: boolean = true;

  constructor(
    private intermediaryService: IntermediaryService,
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

      if (this.scanditProvider.checkCodeValue(dataWrote) == this.scanditProvider.codeValue.PRODUCT) {
        this.processStarted = true;
        this.productScanned = {
          reference: dataWrote,
          model: {
            reference: dataWrote.substr(2, 6)
          },
          size: {
            name: '41'
          },
          destinyWarehouse: {
            reference: 'REF',
            name: 'Store Destiny',
            id: 1
          }
        };
        await this.intermediaryService.presentToastSuccess(`Artículo ${dataWrote} añadido al sorter.`);
      } else {
        await this.intermediaryService.presentToastError('Escanea un código de caja.');
      }
    }
  }
}
