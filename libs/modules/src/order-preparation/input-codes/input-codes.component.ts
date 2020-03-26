import { Component, OnInit,Input } from '@angular/core';
import { AlertController } from "@ionic/angular";
import { PrinterService } from "../../../../services/src/lib/printer/printer.service";
import {ItemReferencesProvider} from "../../../../services/src/providers/item-references/item-references.provider";
import {
  AuthenticationService,
  IntermediaryService,
  PriceService,
  ProductModel,
  ProductsService,
  WarehouseModel
} from '@suite/services';
import { environment as al_environment } from "../../../../../apps/al/src/environments/environment";
import { AudioProvider } from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import { KeyboardService } from "../../../../services/src/lib/keyboard/keyboard.service";
import { PositionsToast } from '../../../../services/src/models/positionsToast.type';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LabelsService } from '@suite/services';

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {
  numAllSann:number =0;
  dataToWrite: string = 'PRODUCTO';
  inputProduct: string = null;
  lastCodeScanned: string = 'start';
  private lastProductReferenceScanned: string = 'start';
  numScanner:number = 0;
  private isStoreUser: boolean = false;
  private storeUserObj: WarehouseModel.Warehouse = null;

  public typeTagsBoolean: boolean = false;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private intermediaryService: IntermediaryService,
    private alertController: AlertController,
    private printerService: PrinterService,
    private priceService: PriceService,
    private productsService: ProductsService,
    private authService: AuthenticationService,
    private itemReferencesProvider: ItemReferencesProvider,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
    private router: Router,
    private location: Location,
    private labelService: LabelsService
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    this.focusToInput();
  }

  async ngOnInit() {

    this.isStoreUser = await this.authService.isStoreUser();
    if (this.isStoreUser) {
      this.storeUserObj = await this.authService.getStoreCurrentUser();
    }

    this.getNumScann();
    this.getNumAllScann();
  }

  private focusToInput() {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    }, 800);
  }

  keyUpInput(event) {
    let dataWrote = (this.inputProduct || "").trim();

    if (event.keyCode === 13 && dataWrote) {
      if (dataWrote === this.lastCodeScanned) {
        this.inputProduct = null;
        this.focusToInput();
        return;
      }
      this.lastCodeScanned = dataWrote;
      this.lastProductReferenceScanned = dataWrote;

      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      this.inputProduct = null;
      switch (this.itemReferencesProvider.checkCodeValue(dataWrote)) {
        case this.itemReferencesProvider.codeValue.PRODUCT:
          if (this.isStoreUser) {
            this.postRelabelProduct(dataWrote);
          } else {
            this.audioProvider.playDefaultOk();
            this.printerService.printTagBarcode([dataWrote]);
            this.focusToInput();
          }
          break;
        case this.itemReferencesProvider.codeValue.PRODUCT_MODEL:
          //this.getSizeListByReference(dataWrote);
          this.printLabels(dataWrote);
          break;
        default:
          this.audioProvider.playDefaultError();
          this.intermediaryService.presentToastError('El código escaneado no es válido para la operación que se espera realizar.', PositionsToast.BOTTOM).then(() => {
            this.focusInputTa();
          });
          this.focusToInput();
          break;
      }
    }
  }

  private getSizeListByReference(dataWrote: string) {
    this.productsService
      .getInfo(dataWrote)
      .then(async (res: ProductModel.ResponseInfo) => {
        if (res.code === 200) {
          let responseSizeAndModel: ProductModel.SizesAndModel = <ProductModel.SizesAndModel>res.data;
          if (responseSizeAndModel.model && responseSizeAndModel.sizes) {
            if (responseSizeAndModel.sizes.length === 1) {
              if (this.isStoreUser) {
                this.focusToInput();
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
                  name: 'radio' + iSize,
                  type: 'radio',
                  label: size.name,
                  value: iSize
                }
              });
              this.presentAlertSelect(listItems, responseSizeAndModel);
            }
          }
        } else if (res.code === 0) {
          this.audioProvider.playDefaultError();
          this.intermediaryService.presentToastError('Ha ocurrido un problema al intentar conectarse con el servidor. Revise su conexión y pruebe de nuevo a realizar la operación.', PositionsToast.BOTTOM).then(() => {
            this.focusInputTa();
          });
          this.focusToInput();
        } else {
          this.audioProvider.playDefaultError();
          this.intermediaryService.presentToastError('No se ha podido consultar la información del producto escaneado.', PositionsToast.BOTTOM).then(() => {
            this.focusInputTa();
          });
          this.focusToInput();
        }
      }, (error) => {
        console.error('Error::Subscribe::GetInfo -> ', error);
        this.audioProvider.playDefaultError();
        this.intermediaryService.presentToastError('No se ha podido consultar la información del producto escaneado.', PositionsToast.BOTTOM).then(() => {
          this.focusInputTa();
        });
        this.focusToInput();
      })
      .catch((error) => {
        console.error('Error::Subscribe::GetInfo -> ', error);
        this.audioProvider.playDefaultError();
        this.intermediaryService.presentToastError('No se ha podido consultar la información del producto escaneado.', PositionsToast.BOTTOM).then(() => {
          this.focusInputTa();
        });
        this.focusToInput();
      });
  }

  private async postRelabelProduct(productReference: string, modelId?: number, sizeId?: number, locationReference?: string) {
    let paramsRelabel: ProductModel.ParamsRelabel = {
      productReference
    };

    if (this.isStoreUser) {
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
        if (res.code === 200) {
          // Do product print
          this.audioProvider.playDefaultOk();
          this.printerService.printTagBarcodeUsingProduct(res.data);
          this.focusToInput();
        } else if (res.code === 0) {
          this.audioProvider.playDefaultError();
          this.intermediaryService.presentToastError('Ha ocurrido un problema al intentar conectarse con el servidor. Revise su conexión y pruebe de nuevo a realizar la operación.', PositionsToast.BOTTOM).then(() => {
            this.focusInputTa();
          });
          this.focusToInput();
        } else {
          this.audioProvider.playDefaultError();
          this.intermediaryService.presentToastError('Ha ocurrido un error al intentar consultar la información de la talla.', PositionsToast.BOTTOM).then(() => {
            this.focusInputTa();
          });
          this.focusToInput();
        }
      }, (error) => {
        console.error('Error::Subscribe::Relabel -> ', error);
        this.audioProvider.playDefaultError();
        this.intermediaryService.presentToastError('Ha ocurrido un error al intentar consultar la información de la talla.', PositionsToast.BOTTOM).then(() => {
          this.focusInputTa();
        });

        this.focusToInput();
      });
  }

  private focusInputTa() {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    }, 500);
  }

  private async presentAlertSelect(listItems: any[], listProductsSizes: ProductModel.SizesAndModel) {
    const alert = await this.alertController.create({
      header: 'Selecciona talla a usar',
      inputs: listItems,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => this.focusToInput()
        }, {
          text: 'Seleccionar',
          handler: async (data) => {
            // Avoid close alert without selection
            if (typeof data === 'undefined') {
              return false;
            }

            this.focusToInput();
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

  public onFocus(event) {
    if (event && event.target && event.target.id) {
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

  public printLabels(barcode){
    if(this.numScanner > 0){
        this.printLabelStore(barcode);
    }else{
      this.router.navigate(['/order-preparation']);
    }

  }

  async getNumScann() {
    this.labelService.getData().subscribe((resp: any) => {
      this.numScanner = resp;
    });
    
  }

  async getNumAllScann() {
    this.labelService.getNumAllScanner().subscribe((resp: any) => {
      this.numAllSann = resp;
    });
    
  }

  async printLabelStore(barcode_){
    let body ={
      barcode : barcode_
    }
    this.intermediaryService.presentLoading();
    this.labelService.postPrintLabels(body).subscribe( result =>{
      console.log("resultado");
      console.log(result);
      this.labelService.numScanner(this.numScanner= (this.numScanner-1));
      this.router.navigate(['/order-preparation']);
      this.intermediaryService.dismissLoading();
    }, error => {
      console.log(error);
      this.intermediaryService.dismissLoading();
    });

   
  }

}
