import {Component, OnInit} from '@angular/core';
import {AlertController, ToastController} from "@ionic/angular";
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {AuthenticationService, PriceService, ProductModel, ProductsService, WarehouseModel} from "@suite/services";
import {environment as al_environment} from "../../../../../apps/al/src/environments/environment";
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {KeyboardService} from "../../../../services/src/lib/keyboard/keyboard.service";

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  dataToWrite: string = 'PRODUCTO';
  inputProduct: string = null;
  lastCodeScanned: string = 'start';
  private lastProductReferenceScanned: string = 'start';

  private isStoreUser: boolean = false;
  private storeUserObj: WarehouseModel.Warehouse = null;

  public typeTagsBoolean: boolean = false;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private printerService: PrinterService,
    private priceService: PriceService,
    private productsService: ProductsService,
    private authService: AuthenticationService,
    private scanditProvider: ScanditProvider,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },800);
  }

  async ngOnInit() {
    this.isStoreUser = await this.authService.isStoreUser();
    if (this.isStoreUser) {
      this.storeUserObj = await this.authService.getStoreCurrentUser();
    }
  }

  keyUpInput(event) {
    let dataWrote = (this.inputProduct || "").trim();

    if (event.keyCode == 13 && dataWrote) {
      if (dataWrote === this.lastCodeScanned) {
        this.inputProduct = null;
        return;
      }
      this.lastCodeScanned = dataWrote;
      this.lastProductReferenceScanned = dataWrote;

      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      this.inputProduct = null;
      switch (this.scanditProvider.checkCodeValue(dataWrote)) {
        case this.scanditProvider.codeValue.PRODUCT:
          if (this.isStoreUser) {
            this.postRelabelProduct(dataWrote);
          } else {
            this.audioProvider.playDefaultOk();
            this.printerService.printTagBarcode([dataWrote]);
          }
          break;
        case this.scanditProvider.codeValue.PRODUCT_MODEL:
          this.getSizeListByReference(dataWrote);
          break;
        default:
          this.audioProvider.playDefaultError();
          this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
          break;
      }
    }
  }

  private getSizeListByReference(dataWrote: string) {
    this.productsService
      .getInfo(dataWrote)
      .then(async (res: ProductModel.ResponseInfo) => {
        if (res.code == 200) {
          let responseSizeAndModel: ProductModel.SizesAndModel = <ProductModel.SizesAndModel>res.data;
          if (responseSizeAndModel.model && responseSizeAndModel.sizes) {
            if (responseSizeAndModel.sizes.length == 1) {
              if (this.isStoreUser) {
                this.postRelabelProduct(this.lastProductReferenceScanned, responseSizeAndModel.model.id, responseSizeAndModel.sizes[0].id);
              } else {
                this.audioProvider.playDefaultOk();
                this.presentAlertInput(responseSizeAndModel.model.id, responseSizeAndModel.sizes[0].id);
              }
            } else {
              this.audioProvider.playDefaultOk();
              let responseSizeAndModel: ProductModel.SizesAndModel = <ProductModel.SizesAndModel>res.data;

              let listItems = responseSizeAndModel.sizes.map((size, iSize) => {
                return {
                  name: 'radio'+iSize,
                  type: 'radio',
                  label: size.name,
                  value: iSize
                }
              });
              this.presentAlertSelect(listItems, responseSizeAndModel);
            }
          }
        } else {
          this.audioProvider.playDefaultError();
          this.presentToast('No se ha podido consultar la información del producto escaneado.', 'danger');
        }
      }, (error) => {
        console.error('Error::Subscribe::GetInfo -> ', error);
        this.audioProvider.playDefaultError();
        this.presentToast('No se ha podido consultar la información del producto escaneado.', 'danger');
      })
      .catch((error) => {
        console.error('Error::Subscribe::GetInfo -> ', error);
        this.audioProvider.playDefaultError();
        this.presentToast('No se ha podido consultar la información del producto escaneado.', 'danger');
      });
  }

  private async postRelabelProduct(productReference: string, modelId?: number, sizeId?: number, locationReference?: string) {
    let paramsRelabel: ProductModel.ParamsRelabel = {
      productReference
    };

    if (this.isStoreUser){
      paramsRelabel.warehouseId = this.storeUserObj.id;
    }

    if (modelId) {
      paramsRelabel.modelId = modelId;
    }

    if (sizeId) {
      paramsRelabel.sizeId = sizeId;
    }

    if (locationReference) {
      paramsRelabel.locationReference = locationReference;
    }

    this.productsService
      .postRelabel(paramsRelabel)
      .then((res: ProductModel.ResponseRelabel) => {
        if (res.code == 200) {
          // Do product print
          this.audioProvider.playDefaultOk();
          this.printerService.printTagBarcodeUsingProduct(res.data);
        } else {
          this.audioProvider.playDefaultError();
          this.presentToast('Ha ocurrido un error al intentar consultar la información de la talla.', 'danger');
        }
      }, (error) => {
        console.error('Error::Subscribe::Relabel -> ', error);
        this.audioProvider.playDefaultError();
        this.presentToast('Ha ocurrido un error al intentar consultar la información de la talla.', 'danger');
      });
  }

  private async presentToast(msg: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 1500,
      color: color
    });

    toast.present()
      .then(() => {
        setTimeout(() => {
          document.getElementById('input-ta').focus();
        },500);
      });
  }

  private async presentAlertSelect(listItems: any[], listProductsSizes: ProductModel.SizesAndModel) {
    const alert = await this.alertController.create({
      header: 'Selecciona talla a usar',
      inputs: listItems,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Seleccionar',
          handler: async (data) => {
            // Avoid close alert without selection
            if (typeof data == 'undefined') {
              return false;
            }

            let modelId = listProductsSizes.model.id;
            let sizeId = listProductsSizes.sizes[data].id;
            if (this.isStoreUser) {
              this.postRelabelProduct(this.lastProductReferenceScanned, modelId, sizeId);
            } else {
              this.presentAlertInput(modelId, sizeId);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async presentAlertInput(modelId: number, sizeId: number) {
    const alert = await this.alertController.create({
      header: 'Ubicación del producto',
      message: 'Introduce la referencia de la ubicación o el embalaje en que está el producto. Si no está en ninguno de estos sitios continúa sin rellenar este campo.',
      inputs: [{
        name: 'reference',
        type: 'text',
        placeholder: 'Referencia '
      }],
      backdropDismiss: false,
      buttons: [
        {
          text: 'Continuar',
          handler: (data) => {
            let reference = data.reference.trim();
            this.postRelabelProduct(this.lastProductReferenceScanned, modelId, sizeId, reference);
          }
        }
      ]
    });

    await alert.present();
  }

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }
}
