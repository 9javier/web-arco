import {Component, OnInit, ViewChild} from '@angular/core';
import {ScannerManualComponent} from "../components/scanner-manual/scanner-manual.component";
import {ScanditProvider} from "../../../services/src/providers/scandit/scandit.provider";
import {environment as al_environment} from "../../../../apps/al/src/environments/environment";
import {IntermediaryService, ProductModel, ProductsService} from "@suite/services";
import {WorkwaveModel} from "../../../services/src/models/endpoints/Workwaves";
import {WorkwavesService} from "../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {ShoesPickingModel} from "../../../services/src/models/endpoints/ShoesPicking";
import {AudioProvider} from "../../../services/src/providers/audio-provider/audio-provider.provider";

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
    private scanditProvider: ScanditProvider,
    private audioProvider: AudioProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
  }

  ngOnInit() {
    setTimeout(() => this.scannerManual.focusToInput(), 1000);
  }

  public async newValueScanner(data) {
    if (this.scanditProvider.checkCodeValue(data) != this.scanditProvider.codeValue.PRODUCT) {
      // if code scanned not correspond to product reference, throw error
      this.scannerManual.setValue(null);
      this.audioProvider.playDefaultError();
      await this.intermediaryService.presentToastError('El código escaneado no corresponde a un producto.');
      this.scannerManual.focusToInput();
    } else {
      if (data == this.lastCodeScanned) {
        // if code scanned is the same that last code scanned, do not anything
        this.scannerManual.setValue(null);
        this.scannerManual.focusToInput();
      } else {
        this.lastCodeScanned = data;

        // reset last code scanned after X time to allow scan same code multiple times
        if (this.timeoutStarted) {
          clearTimeout(this.timeoutStarted);
        }
        this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

        this.scannerManual.setValue(null);

        if (this.showAlternativeProductInfo) {
          if (data == this.alternativeProductInfo.product.reference) {
            this.processProductScanned(data);
          } else {
            this.audioProvider.playDefaultError();
            await this.intermediaryService.presentToastError('El producto escaneado no corresponde con el que se le solicitó escanear.');
            this.scannerManual.focusToInput();
          }
        } else {
          this.processProductScanned(data);
        }
      }
    }
  }

  public async setAsDefective() {
    await this.intermediaryService.presentConfirm(`Al marcar el par como DEFECTUOSO se le buscará un par equivalente que se encuentre disponible. ¿Está seguro de que quiere marcar como defectuoso el par ${this.productInfo.model.reference}?`, () => this.requestSetProductAsDefective(), () => this.scannerManual.focusToInput());
  }

  public async setAsOk() {
    await this.intermediaryService.presentConfirm(`Al marcar el par como APTO se notificará a Avelon del movimiento. ¿Está seguro de que quiere marcar como apto el par ${this.productInfo.model.reference}?`, () => this.requestSetProductAsOk(), () => this.scannerManual.focusToInput());
  }

  private async processProductScanned(productReference: string) {
    await this.intermediaryService.presentLoading();
    this.productsService
      .getInfo(productReference)
      .then(async (res: ProductModel.ResponseInfoVerificationOnlineStore) => {
        await this.intermediaryService.dismissLoading();
        this.scannerManual.focusToInput();
        if (res.code == 200) {
          this.audioProvider.playDefaultOk();
          this.showAlternativeProductInfo = false;
          this.alternativeProductInfo = null;
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
          this.audioProvider.playDefaultError();
          await this.showErrorMessage(res, 'No se ha podido consultar la información del producto escaneado.');
        }
      }, async (error) => {
        await this.intermediaryService.dismissLoading();
        this.audioProvider.playDefaultError();
        await this.showErrorMessage(error, 'No se ha podido consultar la información del producto escaneado.');
        this.scannerManual.focusToInput();
      })
      .catch(async (error) => {
        await this.intermediaryService.dismissLoading();
        this.audioProvider.playDefaultError();
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
          const resData = res.data;
          await this.intermediaryService.presentToastSuccess('Producto marcado como defectuoso.', 2000);
          this.showProductInfo = false;
          this.productInfo = null;
          if (resData.newProduct) {
            this.audioProvider.playDefaultOk();
            setTimeout(async () => {
              await this.intermediaryService.presentToastSuccess('Cargando producto alternativo a recoger.', 2000);
              this.showAlternativeProductInfo = true;
              this.alternativeProductInfo = {
                inventory: {
                  container: {
                    reference: resData.containerReference,
                    column: null,
                    enabled: null,
                    id: null,
                    items: null,
                    lock: null,
                    on_right_side: null,
                    row: null
                  },
                  id: null,
                  createdAt: null,
                  packingId: null,
                  packingType: null,
                  rack: null,
                  status: null,
                  updatedAt: null
                },
                product: {
                  model: {
                    reference: resData.newProduct.model.reference,
                    color: null,
                    createdAt: null,
                    datasetHash: null,
                    hash: null,
                    id: null,
                    name: null,
                    updatedAt: null,
                    brand: {
                      name: resData.newProduct.model.brand.name
                    }
                  },
                  size: {
                    name: resData.newProduct.size.name,
                    createdAt: null,
                    datasetHash: null,
                    description: null,
                    id: null,
                    number: null,
                    reference: null,
                    updatedAt: null
                  },
                  id: null,
                  reference: resData.newProduct.reference,
                  initialWarehouseReference: null
                },
                createdAt: null,
                updatedAt: null,
                id: null,
                status: null,
                typeSelectionCriteria: null,
                typeGeneration: null,
                typePreparationLine: null,
                workWaveOrder: null
              };
              this.scannerManual.focusToInput();
            }, 2 * 1000);
            this.scannerManual.focusToInput();
          }
        } else if (res.code == 404) {
          await this.showErrorMessage(res, 'Ha ocurrido un error al intentar marcar el producto como defectuoso.');
          this.audioProvider.playDefaultError();
          this.scannerManual.focusToInput();
          this.showProductInfo = false;
          this.productInfo = null;
        } else {
          await this.showErrorMessage(res, 'Ha ocurrido un error al intentar marcar el producto como defectuoso.');
          this.audioProvider.playDefaultError();
          this.scannerManual.focusToInput();
        }
      }, async (error) => {
        await this.intermediaryService.dismissLoading();
        this.audioProvider.playDefaultError();
        await this.showErrorMessage(error, 'Ha ocurrido un error al intentar marcar el producto como defectuoso.');
        this.scannerManual.focusToInput();
      })
      .catch(async (error) => {
        await this.intermediaryService.dismissLoading();
        this.audioProvider.playDefaultError();
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
          this.audioProvider.playDefaultOk();
          this.showProductInfo = false;
          this.productInfo = null;
        } else if (res.code == 404) {
          await this.showErrorMessage(res, 'Ha ocurrido un error al intentar marcar el producto como defectuoso.');
          this.audioProvider.playDefaultError();
          this.scannerManual.focusToInput();
          this.showProductInfo = false;
          this.productInfo = null;
        } else {
          this.audioProvider.playDefaultError();
          await this.showErrorMessage(res, 'Ha ocurrido un error al intentar marcar el producto como apto.');
        }
      }, async (error) => {
        await this.intermediaryService.dismissLoading();
        this.audioProvider.playDefaultError();
        await this.showErrorMessage(error, 'Ha ocurrido un error al intentar marcar el producto como apto.');
        this.scannerManual.focusToInput();
      })
      .catch(async (error) => {
        await this.intermediaryService.dismissLoading();
        this.audioProvider.playDefaultError();
        await this.showErrorMessage(error, 'Ha ocurrido un error al intentar marcar el producto como apto.');
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
