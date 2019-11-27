import {Component, OnInit, EventEmitter, Output, ViewChild} from '@angular/core';
import { AuditsService } from '@suite/services';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditsMobileComponent } from '../../audits-mobile/audits-mobile.component';
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {ScanditProvider} from "../../../../services/src/providers/scandit/scandit.provider";
import {ScannerManualComponent} from "../../components/scanner-manual/scanner-manual.component";

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
  public packingProducts: any[] = [];

  constructor(
    private audit : AuditsService,
    private toast : ToastController,
    private activeRoute: ActivatedRoute,
    private router : Router,
    private audioProvider: AudioProvider,
    private scanditProvider: ScanditProvider
  ) {
    this.jaula = this.activeRoute.snapshot.params.jaula;
    this.id = this.activeRoute.snapshot.params.id;
    this.back = this.activeRoute.snapshot.params.back;
  }

  ngOnInit() {
    setTimeout(() => this.scannerManual.focusToInput(), 1000);
    this.getProducts();
  }

  userTyping(codeScanned: string) {
    if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PRODUCT) {
      this.scannerManual.setValue(null);
      this.addProduct(codeScanned);
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

  addProduct(codeScanned: string){
    let data : any = {
      auditId:this.id,
      productReference: codeScanned,
      packingReference: this.jaula
    };

    this.audit.addProduct(data).subscribe(res=>{
      this.presentToast('Producto válido', 'success');
      this.scannerManual.setValue(null);
      this.scannerManual.focusToInput();
      this.audioProvider.playDefaultOk();
      this.getProducts();
    },err => {
      this.scannerManual.setValue(null);
      this.scannerManual.focusToInput();
      this.audioProvider.playDefaultError();
      this.presentToast(err.error.errors,'danger');
      this.getProducts();
    })
  }

  private getProducts() {
    this.audit.getProducts({ packingReference: this.jaula }).subscribe(res =>{
      this.packingProducts = res.data;
    },err =>{
      this.presentToast(err.error.errors,'danger');
    })
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
