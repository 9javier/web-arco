import {Component, OnInit} from '@angular/core';
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";
import {ItemReferencesProvider} from "../../../../services/src/providers/item-references/item-references.provider";
import { IntermediaryService, PriceService } from '@suite/services';
import {PackingInventoryModel} from "../../../../services/src/models/endpoints/PackingInventory";
import {PackingInventoryService} from "../../../../services/src/lib/endpoint/packing-inventory/packing-inventory.service";
import {environment as al_environment} from "../../../../../apps/al/src/environments/environment";
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {KeyboardService} from "../../../../services/src/lib/keyboard/keyboard.service";
import { PositionsToast } from '../../../../services/src/models/positionsToast.type';

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  dataToWrite: string = 'PRODUCTO';
  inputProduct: string = null;
  lastCodeScanned: string = 'start';

  public typeTagsBoolean: boolean = false;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private intermediaryService: IntermediaryService,
    private printerService: PrinterService,
    private priceService: PriceService,
    private itemReferencesProvider: ItemReferencesProvider,
    private packingInventorService: PackingInventoryService,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },800);
  }

  ngOnInit() {

  }

  keyUpInput(event) {
    let dataWrote = (this.inputProduct || "").trim();

    if (event.keyCode === 13 && dataWrote) {
      if (dataWrote === this.lastCodeScanned) {
        this.inputProduct = null;
        return;
      }
      this.lastCodeScanned = dataWrote;

      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      this.inputProduct = null;
      switch (this.itemReferencesProvider.checkCodeValue(dataWrote)) {
        case this.itemReferencesProvider.codeValue.PRODUCT:
          this.getCarrierOfProductAndPrint(dataWrote);
          break;
        default:
          this.audioProvider.playDefaultError();
          this.intermediaryService.presentToastError('El código escaneado no es válido para la operación que se espera realizar.', PositionsToast.BOTTOM).then(() => {
            setTimeout(() => {
              document.getElementById('input-ta').focus();
            },500);
          });

          break;
      }
    }
  }

  private getCarrierOfProductAndPrint(dataWrote: string) {
    this.packingInventorService
      .getCarrierOfProduct(dataWrote)
      .then((res: PackingInventoryModel.ResponseGetCarrierOfProduct) => {
        if (res.code === 200) {
          this.audioProvider.playDefaultOk();
          this.printerService.print({text: [res.data.reference], type: 0})
        } else {
          this.audioProvider.playDefaultError();
          console.error('Error::Subscribe::GetCarrierOfProduct::', res);
          let msgError = `Ha ocurrido un error al intentar comprobar el embalaje del producto ${dataWrote}.`;
          if (res.errors && typeof res.errors === 'string') {
            msgError = res.errors;
          } else if (res.message) {
            msgError = res.message;
          }

          this.intermediaryService.presentToastError(msgError, PositionsToast.BOTTOM).then(() => {
            setTimeout(() => {
              document.getElementById('input-ta').focus();
            },500);
          });
        }
      }, (error) => {
        this.audioProvider.playDefaultError();
        console.error('Error::Subscribe::GetCarrierOfProduct::', error);
        let msgError = `Ha ocurrido un error al intentar comprobar el embalaje del producto ${dataWrote}.`;
        if (error.error) {
          if (error.error.message) {
            msgError = error.error.message;
          } else if (error.error.errors) {
            msgError = error.error.errors;
          } else if (typeof error.error === 'string') {
            msgError = error.error;
          }
        }

        this.intermediaryService.presentToastError(msgError, PositionsToast.BOTTOM).then(() => {
          setTimeout(() => {
            document.getElementById('input-ta').focus();
          },500);
        });
      })
      .catch((error) => {
        this.audioProvider.playDefaultError();
        console.error('Error::Subscribe::GetCarrierOfProduct::', error);
        let msgError = `Ha ocurrido un error al intentar comprobar el embalaje del producto ${dataWrote}.`;
        if (error.error) {
          if (error.error.message) {
            msgError = error.error.message;
          } else if (error.error.errors) {
            msgError = error.error.errors;
          } else if (typeof error.error === 'string') {
            msgError = error.error;
          }
        }

        this.intermediaryService.presentToastError(msgError, PositionsToast.BOTTOM).then(() => {
          setTimeout(() => {
            document.getElementById('input-ta').focus();
          },500);
        });
      });
  }

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

}
