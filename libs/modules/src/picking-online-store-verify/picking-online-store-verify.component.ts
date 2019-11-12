import {Component, OnInit, ViewChild} from '@angular/core';
import {ScannerManualComponent} from "../components/scanner-manual/scanner-manual.component";
import {ScanditProvider} from "../../../services/src/providers/scandit/scandit.provider";
import {environment as al_environment} from "../../../../apps/al/src/environments/environment";
import {IntermediaryService, ProductModel, ProductsService} from "@suite/services";
import {WorkwaveModel} from "../../../services/src/models/endpoints/Workwaves";
import {WorkwavesService} from "../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {ShoesPickingModel} from "../../../services/src/models/endpoints/ShoesPicking";

@Component({
  selector: 'app-picking-online-store-verify',
  templateUrl: './picking-online-store-verify.component.html',
  styleUrls: ['./picking-online-store-verify.component.scss']
})

export class PickingOnlineStoreVerifyComponent implements OnInit {

  @ViewChild(ScannerManualComponent) scannerManual: ScannerManualComponent;

  private lastCodeScanned: string = 'start';
  public showProductInfo: boolean = false;
  public showAlternativeProductInfo: boolean = false;
  public productInfo: ProductInfo = null;
  public alternativeProductInfo: ShoesPickingModel.ShoesPicking = null;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private intermediaryService: IntermediaryService,
    private productsService: ProductsService,
    private workwavesService: WorkwavesService,
    private scanditProvider: ScanditProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
  }

  ngOnInit() {

  }

  public async newValueScanner(data) {
    if (this.scanditProvider.checkCodeValue(data) != this.scanditProvider.codeValue.PRODUCT) {
      // if code scanned not correspond to product reference, throw error
      this.scannerManual.setValue(null);
      await this.intermediaryService.presentToastError('El código escaneado no corresponde a un producto.');
    } else {
      if (data == this.lastCodeScanned) {
        // if code scanned is the same that last code scanned, do not anything
        this.scannerManual.setValue(null);
      } else {
        this.lastCodeScanned = data;

        // reset last code scanned after X time to allow scan same code multiple times
        if (this.timeoutStarted) {
          clearTimeout(this.timeoutStarted);
        }
        this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

        this.scannerManual.setValue(null);

        this.processProductScanned(data);
      }
    }
  }

  public async setAsDefective() {
    await this.intermediaryService.presentConfirm(`Al marcar el par como DEFECTUOSO se le buscará un par equivalente que se encuentre disponible. ¿Está seguro de que quiere marcar como defectuoso el par ${this.productInfo.model.reference}?`, () => this.requestSetProductAsDefective(), () => this.scannerManual.focusToInput());
  }

  public async setAsOk() {
    await this.intermediaryService.presentConfirm(`Al marcar el par como APTO se notificará a Avelon del movimiento. ¿Está seguro de que quiere marcar como apto el par ${this.productInfo.model.reference}?`, () => this.requestSetProductAsOk(), () => this.scannerManual.focusToInput());
  }

  public oldReference(inventory: ShoesPickingModel.Inventory) {
    let alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    return 'P' + inventory.rack.hall.toString().padStart(2, '0')
      + alphabet[inventory.container.row-1]
      + inventory.container.column.toString().padStart(2, '0');
  }

  private async processProductScanned(productReference: string) {
    await this.intermediaryService.presentLoading();
    this.productsService
      .getInfo(productReference)
      .then(async (res: ProductModel.ResponseInfoVerificationOnlineStore) => {
        await this.intermediaryService.dismissLoading();
        this.scannerManual.focusToInput();
        if (res.code == 200) {
          this.showProductInfo = true;
          this.productInfo = {
            reference: res.data.reference,
            size: typeof res.data.size.number == 'string' ? parseInt(res.data.size.number) : res.data.size.number,
            model: {
              color: res.data.model.color.name,
              reference: res.data.model.reference
            }
          };
        } else {
          await this.showErrorMessage(res, 'No se ha podido consultar la información del producto escaneado.');
        }
      }, async (error) => {
        await this.intermediaryService.dismissLoading();
        await this.showErrorMessage(error, 'No se ha podido consultar la información del producto escaneado.');
        this.scannerManual.focusToInput();
      })
      .catch(async (error) => {
        await this.intermediaryService.dismissLoading();
        await this.showErrorMessage(error, 'No se ha podido consultar la información del producto escaneado.');
        this.scannerManual.focusToInput();
      });
  }

  private async requestSetProductAsDefective() {
    await this.intermediaryService.presentLoading('Marcado como defectuoso...');
    this.workwavesService
      .postChangeStatusProductOnlineStore({
        productReference: this.productInfo.reference,
        defective: true
      })
      .then(async (res: WorkwaveModel.ResponseChangeStatusProductOnlineStore) => {
        await this.intermediaryService.dismissLoading();
        if (res.code == 201) {
          // TODO search new product equivalent
          await this.intermediaryService.presentToastSuccess('Producto marcado como defectuoso.', 2000);
          this.showProductInfo = false;
          this.productInfo = null;
        } else {
          await this.showErrorMessage(res, 'Ha ocurrido un error al intentar marcar el producto como defectuoso.');
          this.scannerManual.focusToInput();
        }
      }, async (error) => {
        await this.intermediaryService.dismissLoading();
        await this.showErrorMessage(error, 'Ha ocurrido un error al intentar marcar el producto como defectuoso.');
        this.scannerManual.focusToInput();
      })
      .catch(async (error) => {
        await this.intermediaryService.dismissLoading();
        await this.showErrorMessage(error, 'Ha ocurrido un error al intentar marcar el producto como defectuoso.');
        this.scannerManual.focusToInput();
      })
  }

  private async requestSetProductAsOk() {
    await this.intermediaryService.presentLoading('Marcado como apto...');
    this.workwavesService
      .postChangeStatusProductOnlineStore({
        productReference: this.productInfo.reference,
        defective: false
      })
      .then(async (res: WorkwaveModel.ResponseChangeStatusProductOnlineStore) => {
        await this.intermediaryService.dismissLoading();
        this.scannerManual.focusToInput();
        if (res.code == 201) {
          await this.intermediaryService.presentToastSuccess('Producto marcado como apto.', 2000);
          this.showProductInfo = false;
          this.productInfo = null;
        } else {
          await this.showErrorMessage(res, 'Ha ocurrido un error al intentar marcar el producto como apto.');
        }
      }, async (error) => {
        await this.intermediaryService.dismissLoading();
        await this.showErrorMessage(error, 'Ha ocurrido un error al intentar marcar el producto como apto.')
        this.scannerManual.focusToInput();
      })
      .catch(async (error) => {
        await this.intermediaryService.dismissLoading();
        await this.showErrorMessage(error, 'Ha ocurrido un error al intentar marcar el producto como apto.')
        this.scannerManual.focusToInput();
      })
  }

  private async showErrorMessage(error, defaultErrorMessage: string) {
    let errorMessage = defaultErrorMessage;
    if (error.errors) {
      errorMessage = error.errors;
    } else {
      errorMessage = error.message;
    }
    await this.intermediaryService.presentToastError(errorMessage, 1500)
  }
}

interface ProductInfo {
  size: number,
  model: {
    reference: string,
    color: string
  },
  reference: string
}
