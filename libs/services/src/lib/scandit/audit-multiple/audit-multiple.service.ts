import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {Router} from "@angular/router";
import {AuditsService} from "@suite/services";
import {AuditsModel} from "../../../models/endpoints/Audits";

declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class AuditMultipleScanditService {

  private NOTICE_BUBBLE_ACTION: number = 1;
  private NOTICE_BUBBLE_ERROR: number = 2;

  private CUSTOM_SOUND_OK: number = 1;
  private CUSTOM_SOUND_ERROR: number = 2;

  private packingReference: string;
  private packingAuditsCreated: {} = {};

  constructor(
    private router: Router,
    private auditsService: AuditsService,
    private scanditProvider: ScanditProvider
  ) {}

  public init() {
    this.packingReference = null;
    this.packingAuditsCreated = {};
    ScanditMatrixSimple.initAuditMultiple((response: ScanditModel.ResponseAuthMultiple) => {
      if (response.result && response.barcode) {
        let codeScanned = response.barcode.data;
        if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PRODUCT) {
          if (this.packingReference) {
            this.checkProductInPacking(this.packingReference, codeScanned);
          } else {
            ScanditMatrixSimple.sound(this.CUSTOM_SOUND_ERROR);
            this.changeNotice("Escanea un embalaje para comenzar la verificación", this.NOTICE_BUBBLE_ERROR);
            setTimeout(() => {
              this.changeNotice("Escanea el embalaje a revisar", this.NOTICE_BUBBLE_ACTION);
            }, 2 * 1000);
          }
        } else if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PALLET
          || this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.JAIL) {
          if (!this.packingAuditsCreated[codeScanned]) {
            this.createAudit(codeScanned);
          } else {
            this.packingOkScanProducts(codeScanned);
          }
        }
      } else {
        if (response.exit) {
          if (response.manual) {
            this.router.navigate(['audits/add']);
          } else {
            this.router.navigate(['audits']);
          }
        }
      }
    }, 'Auditoría', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color);
  }

  private changeNotice(message: string, type: number) {
    ScanditMatrixSimple.changeNoticeAuditMultiple(message, type);
  }

  private packingOkScanProducts(packingReference: string) {
    this.packingReference = packingReference;
    ScanditMatrixSimple.sound(this.CUSTOM_SOUND_OK);
    this.changeNotice("Escanea los productos del embalaje", this.NOTICE_BUBBLE_ACTION);
  }

  private productKO() {
    ScanditMatrixSimple.sound(this.CUSTOM_SOUND_ERROR);
    ScanditMatrixSimple.wrongCodeAuditMultiple();
  }

  //region API connection
  private createAudit(packingReference: string) {
    this.auditsService
      .postCreateAudit({
        packingReference,
        status: 1,
        type: 2
      })
      .then((res: AuditsModel.ResponseCreateAudit) => {
        if (res.code == 201) {
          ScanditMatrixSimple.sound(this.CUSTOM_SOUND_OK);
          this.packingAuditsCreated[packingReference] = true;
          this.packingOkScanProducts(packingReference);
        } else if (res.code == 422) {
          ScanditMatrixSimple.sound(this.CUSTOM_SOUND_ERROR);
          this.changeNotice(res.errors, this.NOTICE_BUBBLE_ERROR);

          setTimeout(() => {
            this.changeNotice("Escanea el embalaje a revisar", this.NOTICE_BUBBLE_ACTION);
          }, 2 * 1000);
        } else {
          let msgError = `Ha ocurrido un error al intentar iniciar una auditoría para ${packingReference}.`;
          if (res.errors) {
            msgError = res.errors;
          } else if (res.message) {
            msgError = res.message;
          }
          ScanditMatrixSimple.sound(this.CUSTOM_SOUND_ERROR);
          this.changeNotice(msgError, this.NOTICE_BUBBLE_ERROR);

          setTimeout(() => {
            this.changeNotice("Escanea el embalaje a revisar", this.NOTICE_BUBBLE_ACTION);
          }, 2 * 1000);
        }
      }, (error) => {
        let msgError = `Ha ocurrido un error al intentar iniciar una auditoría para ${packingReference}.`;
        if (error.error) {
          if (error.error.message) {
            msgError = error.error.message;
          } else if (error.error.errors) {
            msgError = error.error.errors;
          } else if (typeof error.error == 'string') {
            msgError = error.error;
          }
        }
        ScanditMatrixSimple.sound(this.CUSTOM_SOUND_ERROR);
        this.changeNotice(msgError, this.NOTICE_BUBBLE_ERROR);
        setTimeout(() => {
          this.changeNotice("Escanea el embalaje a revisar", this.NOTICE_BUBBLE_ACTION);
        }, 2 * 1000);
      })
      .catch((error) => {
        let msgError = `Ha ocurrido un error al intentar iniciar una auditoría para ${packingReference}.`;
        if (error.error) {
          if (error.error.message) {
            msgError = error.error.message;
          } else if (error.error.errors) {
            msgError = error.error.errors;
          } else if (typeof error.error == 'string') {
            msgError = error.error;
          }
        }
        ScanditMatrixSimple.sound(this.CUSTOM_SOUND_ERROR);
        this.changeNotice(msgError, this.NOTICE_BUBBLE_ERROR);
        setTimeout(() => {
          this.changeNotice("Escanea el embalaje a revisar", this.NOTICE_BUBBLE_ACTION);
        }, 2 * 1000);
      });
  }

  private checkProductInPacking(packingReference: string, productReference: string) {
    this.auditsService
      .postCheckProductInPacking({
        packingReference,
        productReference
      })
      .then((res: AuditsModel.ResponseCheckProductInPacking) => {
        if (res.code == 201) {
          ScanditMatrixSimple.sound(this.CUSTOM_SOUND_OK);
        } else {
          this.productKO();
        }
      }, (error) => this.productKO())
      .catch((error) => this.productKO());
  }
  //endregion
}
