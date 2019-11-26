import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuditsService } from '@suite/services';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditsMobileComponent } from '../../audits-mobile/audits-mobile.component';
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";

@Component({
  selector: 'suite-sccaner-product',
  templateUrl: './sccaner-product.component.html',
  styleUrls: ['./sccaner-product.component.scss']
})
export class SccanerProductComponent implements OnInit {

  public inputValueScanner: string = '';
  public jaula : string = '';
  public id : any = '';
  public back : any = ''; 
  public buttonStatus : boolean = false;

  constructor(
    private audit : AuditsService,
    private toast : ToastController,
    private activeRoute: ActivatedRoute,
    private router : Router,
    private audioProvider: AudioProvider
  ) {
    this.jaula = this.activeRoute.snapshot.params.jaula;
    this.id = this.activeRoute.snapshot.params.id;
    this.back = this.activeRoute.snapshot.params.back;
    this.focusToInput();
  }

  ngOnInit() {
  }

  private focusToInput() {
    setTimeout(() => {
      document.getElementById('input-prod').focus();
    }, 800);
  }

  userTyping(event: any){
    const codeScanned = this.inputValueScanner;
    this.inputValueScanner = null;
    this.addProduct(codeScanned);
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
      this.buttonStatus = false;
      this.focusToInput();
      this.audioProvider.playDefaultOk();
    },err => {
      this.buttonStatus = true;
      this.focusToInput();
      this.audioProvider.playDefaultError();
      this.presentToast(err.error.errors,'danger');
    })
  }

  async presentToast(message,color) {
    const toast = await this.toast.create({
      message: message,
      color: color,
      duration: 2000
    });
    toast.present();
  }

}
