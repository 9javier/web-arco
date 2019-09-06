import {Injectable} from '@angular/core';
import {InventoryService} from "../../endpoint/inventory/inventory.service";
import {WarehouseService} from "../../endpoint/warehouse/warehouse.service";
import {AuthenticationService} from "../../endpoint/authentication/authentication.service";
import {AlertController, Events} from "@ionic/angular";
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {ReceptionService} from "../../endpoint/process/reception/reception.service";
import {WarehouseModel} from "@suite/services";
import {ReceptionModel} from "../../../models/endpoints/Reception";
import {ReceptionProvider} from "../../../providers/reception/reception.provider";
import {Router} from "@angular/router";

declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class ReceptionScanditService {

  private timeoutHideText;
  private scannerPaused: boolean = false;
  private lastCodeScanned: string;
  private typeReception: number = 1;

  private isStoreUser: boolean = false;
  private storeUserObj: WarehouseModel.Warehouse = null;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private auth: AuthenticationService,
    private events: Events,
    private inventoryService: InventoryService,
    private warehouseService: WarehouseService,
    private authenticationService: AuthenticationService,
    private receptionService: ReceptionService,
    private scanditProvider: ScanditProvider,
    private receptionProvider: ReceptionProvider
  ) {}

  async reception(typeReception: number) {
    this.isStoreUser = await this.authenticationService.isStoreUser();
    if (this.isStoreUser) {
      this.storeUserObj = await this.authenticationService.getStoreCurrentUser();
    }

    this.lastCodeScanned = 'start';
    this.receptionProvider.resumeProcessStarted = false;
    this.typeReception = typeReception;

    ScanditMatrixSimple.init((response) => {
      let code = '';

      if (response) {
        if (response.barcode && response.barcode.data) {
          code = response.barcode.data;

          if (!this.scannerPaused && code != this.lastCodeScanned) {
            this.lastCodeScanned = code;
            this.scannerPaused = true;
            switch (this.scanditProvider.checkCodeValue(code)) {
              case this.scanditProvider.codeValue.JAIL:
              case this.scanditProvider.codeValue.PALLET:
                this.processPackingScanned(code);
                break;
              case this.scanditProvider.codeValue.PRODUCT:
                ScanditMatrixSimple.showFixedTextBottom(false, '');
                this.processProductScanned(code);
                break;
              default:
                ScanditMatrixSimple.setText(
                  'Necesita escanear un código de Jaula o Pallet para hacer una recepción.',
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  18);
                this.hideTextMessage(1500);
                setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
            }
          }
        } else if (response.action) {
          switch (response.action) {
            case 'matrix_simple':
              if (this.typeReception == 2) {
                ScanditMatrixSimple.showButtonFinishReception(true);
              } else {
                ScanditMatrixSimple.showButtonFinishReception(false);
              }
              break;
            case 'finish_reception':
              // Request user scan packing to set as empty
              ScanditMatrixSimple.showFixedTextBottom(true, 'Escanea la jaula que desea marcar como vacía.');
              break;
            case 'force_scanning':
              if (response.force) {
                // Force product scanning
                this.setProductAsReceived(response.barcode, true);
              } else if (response.avoid) {
                // Avoid product and don't make anything
              }
              break;
            case 'reception_incomplete':
              if (response.response) {
                // Continue scanning products and don't make anything
                this.scannerPaused = false;
              } else {
                // No more products in packing, create incidence in backend
                this.incidenceNotReceived(this.receptionProvider.referencePacking);
              }
              break;
            case 'wrong_code_msg':
              this.scannerPaused = false;
              break;
            default:
              break;
          }
        }
      }
    }, 'Recepción', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color);
  }

  private processPackingScanned(code: string) {
    if (this.scanditProvider.checkCodeValue(code) == this.scanditProvider.codeValue.JAIL) {
      this.receptionProvider.typePacking = 1;
    } else {
      this.receptionProvider.typePacking = 2;
    }

    if (this.typeReception == 1) {
      this.setPackingAsReceived(code);
    } else if (this.typeReception == 2) {
      ScanditMatrixSimple.showFixedTextBottom(false, '');
      this.receptionProvider.referencePacking = code;

      this.receptionService
        .getCheckPacking(code)
        .subscribe((res: ReceptionModel.ResponseCheckPacking) => {
          if (res.code == 200) {
            ScanditMatrixSimple.setText(
              `${this.receptionProvider.literalsJailPallet.packing_emptied}`,
              this.scanditProvider.colorsMessage.success.color,
              this.scanditProvider.colorText.color,
              16);
            this.hideTextMessage(1500);
            setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
            ScanditMatrixSimple.showFixedTextBottom(false, '');
          } else if (res.code == 428) {
            // Process custom status-code response to check packing
            ScanditMatrixSimple.showWarning(true, `¿Quedan productos sin recepcionar en ${code}?`, 'reception_incomplete', 'Sí', 'No');
          } else {
            this.lastCodeScanned = 'start';

            ScanditMatrixSimple.setText(
              res.errors,
              this.scanditProvider.colorsMessage.error.color,
              this.scanditProvider.colorText.color,
              16);
            this.hideTextMessage(2000);
            setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
          }
        }, (error) => {
          if (error.error.code == 428) {
            // Process custom status-code response to check packing
            ScanditMatrixSimple.showWarning(true, `¿Quedan productos sin recepcionar en ${code}?`, 'reception_incomplete', 'Sí', 'No');
          } else {
            this.lastCodeScanned = 'start';

            ScanditMatrixSimple.setText(
              error.error.errors,
              this.scanditProvider.colorsMessage.error.color,
              this.scanditProvider.colorText.color,
              16);
            this.hideTextMessage(2000);
            setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
          }
        });
    }
  }

  private processProductScanned(code: string) {
    if (this.typeReception == 1) {
      // Warning message notice that this method is only to scan jail or pallet, not products
      ScanditMatrixSimple.showWarning(true, `Este método es para escanear únicamente jaulas o pallets, no productos.`, 'wrong_code_msg');
    } else {
      this.setProductAsReceived(code);
    }
  }

  // Reception of packing in MGA and all products associated
  private setPackingAsReceived(packingReference: string) {
    this.receptionService
      .postReceive({
        packingReference: packingReference,
      })
      .subscribe((res: ReceptionModel.ResponseReceive) => {
        if (res.code == 200 || res.code == 201) {
          if (this.typeReception == 1) {
            ScanditMatrixSimple.showFixedTextBottom(false, '');

            ScanditMatrixSimple.setText(
              `${this.receptionProvider.literalsJailPallet.reception_finished}${res.data.quantity} productos`,
              this.scanditProvider.colorsMessage.success.color,
              this.scanditProvider.colorText.color,
              16);
            this.hideTextMessage(1500);
            setTimeout(() => this.scannerPaused = false, 1.5 * 1000);

            this.receptionProvider.referencePacking = null;
            this.receptionProvider.typePacking = 0;
            this.receptionProvider.processStarted = false;

            if (res.data.quantity > 0) {
              // Close Scandit and navigate to list of products received
              ScanditMatrixSimple.finish();
              this.router.navigate(['print', 'product', 'received', 'scandit']);
            }
          } else if (this.typeReception == 2) {

          }
        } else {
          ScanditMatrixSimple.setText(
            res.errors,
            this.scanditProvider.colorsMessage.error.color,
            this.scanditProvider.colorText.color,
            16);
          this.hideTextMessage(2000);
          setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
        }
      }, (error) => {
        ScanditMatrixSimple.setText(
          error.error.errors,
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          16);
        this.hideTextMessage(2000);
        setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
      });
  }

  // Reception of product in MGA
  private setProductAsReceived(referenceProduct: string, force: boolean = false) {
    let params: ReceptionModel.ReceptionProduct = {
      productReference: referenceProduct
    };

    if (force) {
      params.force = force;
    }

    this.receptionService
      .postReceiveProduct(params)
      .subscribe((response: ReceptionModel.ResponseReceptionProduct) => {
        if (response.code == 201) {
          ScanditMatrixSimple.setText(
            `Producto recepcionado.`,
            this.scanditProvider.colorsMessage.success.color,
            this.scanditProvider.colorText.color,
            18);
          this.hideTextMessage(1500);
        } else if (response.code == 428) {
          this.scannerPaused = true;
          ScanditMatrixSimple.showWarningToForce(true, referenceProduct);
        } else {
          ScanditMatrixSimple.setText(
            response.errors,
            this.scanditProvider.colorsMessage.error.color,
            this.scanditProvider.colorText.color,
            16);
          this.hideTextMessage(1500);
        }
      }, (error) => {
        if (error.error.code == 428) {
          this.scannerPaused = true;
          ScanditMatrixSimple.showWarningToForce(true, referenceProduct);
        } else {
          ScanditMatrixSimple.setText(
            error.error.errors,
            this.scanditProvider.colorsMessage.error.color,
            this.scanditProvider.colorText.color,
            16);
          this.hideTextMessage(1500);
        }
      });
  }

  private incidenceNotReceived(packingReference: string) {
    this.receptionService
      .getNotReceivedProducts(packingReference)
      .subscribe((res: ReceptionModel.ResponseNotReceivedProducts) => {
        if (res.code == 201) {
          ScanditMatrixSimple.setText(
            `${this.receptionProvider.literalsJailPallet.packing_emptied}`,
            this.scanditProvider.colorsMessage.success.color,
            this.scanditProvider.colorText.color,
            16);
          this.hideTextMessage(1500);
          setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
        } else {
          this.scannerPaused = false;
          console.error('Error::Subscribe::Set products as not received after empty packing::', res);
        }
      }, (error) => {
        this.scannerPaused = false;
        console.error('Error::Subscribe::Set products as not received after empty packing::', error);
      });
  }

  private hideTextMessage(delay: number) {
    if (this.timeoutHideText) {
      clearTimeout(this.timeoutHideText);
    }
    this.timeoutHideText = setTimeout(() => {
      ScanditMatrixSimple.showText(false);
    }, delay);
  }
}
