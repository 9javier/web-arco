import {Component, OnInit, EventEmitter, Output, ViewChild} from '@angular/core';
import {AuditsService, CarrierService, IntermediaryService} from '@suite/services';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditsMobileComponent } from '../../audits-mobile/audits-mobile.component';
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {ScannerManualComponent} from "../../components/scanner-manual/scanner-manual.component";
import {CarrierModel} from "../../../../services/src/models/endpoints/Carrier";
import {AuditsModel} from "../../../../services/src/models/endpoints/Audits";

@Component({
  selector: 'suite-sccaner-product',
  templateUrl: './sccaner-product.component.html',
  styleUrls: ['./sccaner-product.component.scss']
})
export class SccanerProductComponent implements OnInit {

  @ViewChild(ScannerManualComponent) scannerManual: ScannerManualComponent;

  public jaula : string = '';
  public id : any = '';
  public back : any = '';
  public packingProducts: AuditsModel.GetAuditProducts[] = [];
  public destinyPacking: string = null;

  constructor(
    private audit : AuditsService,
    private toast : ToastController,
    private activeRoute: ActivatedRoute,
    private router : Router,
    private audioProvider: AudioProvider,
    private scanditProvider: ScanditProvider,
    private carrierService: CarrierService,
    private intermediaryService: IntermediaryService
  ) {
    this.jaula = this.activeRoute.snapshot.params.jaula;
    this.id = this.activeRoute.snapshot.params.id;
    this.back = this.activeRoute.snapshot.params.back;
  }

  ngOnInit() {
    setTimeout(() => this.scannerManual.focusToInput(), 1000);
    this.getProducts();
    this.getPackingDestiny();
  }

  userTyping(codeScanned: string) {
    if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PRODUCT) {
      this.scannerManual.setValue(null);
      this.addProduct(codeScanned, false);
    } else {
      this.scannerManual.setValue(null);
      this.scannerManual.focusToInput();
      this.audioProvider.playDefaultError();
      this.presentToast('Escanea un producto para validar', 'danger');
    }
  }

  backView(){ 
    AuditsMobileComponent.returned.next(false);
    this.router.navigate(['audits']); 
  }

  finishAudit(){
    AuditsMobileComponent.returned.next(false);
    this.router.navigate(['audits']);
  }

  addProduct(codeScanned: string, forceAudit: boolean){
    let data : any = {
      auditId:this.id,
      productReference: codeScanned,
      packingReference: this.jaula,
      forceAudit
    };

    this.audit.addProduct(data).subscribe((res: AuditsModel.ResponseAuditProductInPacking) => {
      if (res.data.auditCorrect) {
        this.presentToast('Producto válido', 'success');
        this.audioProvider.playDefaultOk();
      } else {
        this.presentToast('El producto no debería estar en la jaula', 'danger');
        this.audioProvider.playDefaultError();
      }
      this.scannerManual.setValue(null);
      this.scannerManual.focusToInput();
      this.getProducts();
      this.getPackingDestiny();
    },err => {
      this.scannerManual.setValue(null);
      this.scannerManual.focusToInput();
      this.audioProvider.playDefaultError();
      if (err.error.code == 510) {
        let forceProductAudit = () => {
          this.addProduct(codeScanned, true);
        };
        this.intermediaryService.presentConfirm(err.error.errors, forceProductAudit, () => this.scannerManual.focusToInput());
      } else {
        this.presentToast(err.error.errors,'danger');
        this.getProducts();
        this.getPackingDestiny();
      }
    })
  }

  private getProducts() {
    this.audit.getProducts({ packingReference: this.jaula }).subscribe((res: AuditsModel.ResponseGetAuditProducts) =>{
      this.packingProducts = res.data;
    },err =>{
      this.presentToast(err.error.errors,'danger');
    })
  }

  private getPackingDestiny() {
    this.carrierService
      .getGetPackingDestiny(this.jaula)
      .then((res: CarrierModel.ResponseGetPackingDestiny) => {
        if (res.code == 200) {
          if (res.data) {
            this.destinyPacking = `${res.data.warehouse.reference} ${res.data.warehouse.name}`;
          }
        }
      });
  }

  private async presentToast(message,color) {
    const toast = await this.toast.create({
      message: message,
      color: color,
      duration: 2000
    });
    toast.present();
  }
}
