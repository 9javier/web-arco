import {Injectable} from '@angular/core';
import {InventoryService} from "../../endpoint/inventory/inventory.service";
import {WarehouseService} from "../../endpoint/warehouse/warehouse.service";
import {AuthenticationService} from "../../endpoint/authentication/authentication.service";
import {Events} from "@ionic/angular";
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {ReceptionService} from "../../endpoint/process/reception/reception.service";
import {WarehouseModel} from "@suite/services";
import {ReceptionModel} from "../../../models/endpoints/Reception";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class ReceptionScanditService {

  private timeoutHideText;
  private scannerPaused: boolean = false;
  private userWarehouse: WarehouseModel.Warehouse;

  constructor(
    private auth: AuthenticationService,
    private events: Events,
    private inventoryService: InventoryService,
    private warehouseService: WarehouseService,
    private authenticationService: AuthenticationService,
    private receptionService: ReceptionService,
    private scanditProvider: ScanditProvider
  ) {}

  async reception() {
    this.userWarehouse = await this.authenticationService.getWarehouseCurrentUser();

    ScanditMatrixSimple.init((response) => {
      let code = '';
      let typePacking = 0;

      if (response && response.barcode) {
        code = response.barcode.data;

        if (!this.scannerPaused) {
          this.scannerPaused = true;
          switch (this.scanditProvider.checkCodeValue(code)) {
            case this.scanditProvider.codeValue.JAIL:
            case this.scanditProvider.codeValue.PALLET:
              if (this.scanditProvider.checkCodeValue(code) == this.scanditProvider.codeValue.JAIL) {
                typePacking = 1;
              } else {
                typePacking = 2;
              }
              this.receptionService
                .postReceive({
                  packingReference: code
                })
                .subscribe((res: ReceptionModel.ResponseReceive) => {
                  if (res.code == 200 || res.code == 201) {
                    let msgSetText = 'Registrada la recepción de ';
                    if (typePacking == 1) {
                      msgSetText += 'la Jaula '
                    } else if (typePacking == 2) {
                      msgSetText += 'el Pallet '
                    }
                    msgSetText += code + ' con ' + res.data.quantity + ' productos.';

                    ScanditMatrixSimple.setText(msgSetText, this.scanditProvider.colorsMessage.success.color, this.scanditProvider.colorText.color, 16);
                    this.hideTextMessage(1500);
                    setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
                  } else {
                    ScanditMatrixSimple.setText(res.errors, this.scanditProvider.colorsMessage.error.color, this.scanditProvider.colorText.color, 16);
                    this.hideTextMessage(1500);
                    setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
                  }
                }, (error) => {
                  ScanditMatrixSimple.setText(error.error.errors, this.scanditProvider.colorsMessage.error.color, this.scanditProvider.colorText.color, 16);
                  this.hideTextMessage(1500);
                  setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
                });
              break;
            default:
              ScanditMatrixSimple.setText('Necesita escanear un código de Jaula o Pallet para hacer una recepción.', this.scanditProvider.colorsMessage.error.color, this.scanditProvider.colorText.color, 18);
              this.hideTextMessage(1500);
              setTimeout(() => this.scannerPaused = false, 1.5 * 1000);
          }
        }
      }
    }, 'Recepción', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color);
  }

  private hideTextMessage(delay: number){
    if(this.timeoutHideText){
      clearTimeout(this.timeoutHideText);
    }
    this.timeoutHideText = setTimeout(() => {
      ScanditMatrixSimple.showText(false);
    }, delay);
  }
}
