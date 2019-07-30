import {Component, OnInit} from '@angular/core';
import {AlertController, ToastController} from "@ionic/angular";
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {AuthenticationService, PriceService, ProductModel, ProductsService} from "@suite/services";

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

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private printerService: PrinterService,
    private priceService: PriceService,
    private productsService: ProductsService,
    private authService: AuthenticationService,
    private scanditProvider: ScanditProvider
  ) {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },800);
  }

  ngOnInit() {

  }

  keyUpInput(event) {
    let dataWrote = (this.inputProduct || "").trim();

    if (event.keyCode == 13 && dataWrote) {
      if (dataWrote === this.lastCodeScanned) {
        this.inputProduct = null;
        return;
      }
      this.lastCodeScanned = dataWrote;

      this.inputProduct = null;
      switch (this.scanditProvider.checkCodeValue(dataWrote)) {
        case this.scanditProvider.codeValue.PRODUCT:
          this.printerService.printTagBarcode([dataWrote]);
          break;
        case this.scanditProvider.codeValue.PRODUCT_MODEL:
          this.getSizeListByReference(dataWrote);
          break;
        default:
          this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
          break;
      }
    }
  }

  private getSizeListByReference(dataWrote: string) {
    this.productsService
      .getInfo(dataWrote)
      .subscribe((res: ProductModel.ResponseInfo) => {
        if (res.code == 200) {
          let responseSizeAndModel: ProductModel.SizesAndModel = <ProductModel.SizesAndModel>res.data;
          if (responseSizeAndModel.model && responseSizeAndModel.sizes) {
            if (responseSizeAndModel.sizes.length == 1) {
              this.postRelabelProduct(responseSizeAndModel.model.id, responseSizeAndModel.sizes[0].id);
            } else {
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
        }
      }, (error) => {
        console.error('Error::Subscribe::GetInfo -> ', error);
      });
  }

  private async postRelabelProduct(modelId: number, sizeId: number) {
    let warehouseId = (await this.authService.getWarehouseCurrentUser()).id;
    this.productsService
      .postRelabel({
        modelId,
        sizeId,
        warehouseId
      })
      .subscribe((res: ProductModel.ResponseRelabel) => {
        if (res.code == 200) {
          // TODO Do product print
        }
      }, (error) => {
        console.error('Error::Subscribe::Relabel -> ', error);
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
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancelar');
          }
        }, {
          text: 'Seleccionar',
          handler: (data) => {
            console.log('Confirm Seleccionar -> ', data);
            // Avoid close alert without selection
            if (typeof data == 'undefined') {
              return false;
            }

            let modelId = listProductsSizes.model.id;
            let sizeId = listProductsSizes.sizes[data].id;
            this.postRelabelProduct(modelId, sizeId);
          }
        }
      ]
    });

    await alert.present();
  }

}
