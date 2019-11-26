import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuditsService } from '@suite/services';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditsMobileComponent } from '../../audits-mobile/audits-mobile.component';

@Component({
  selector: 'suite-sccaner-product',
  templateUrl: './sccaner-product.component.html',
  styleUrls: ['./sccaner-product.component.scss']
})
export class SccanerProductComponent implements OnInit {

  public inputValueScanner: String = '';
  public jaula : string = '';
  public id : any = '';
  public back : any = ''; 
  public buttonStatus : boolean = false;

  constructor(
    private audit : AuditsService,
    private toast : ToastController,
    private activeRoute: ActivatedRoute,
    private router : Router,
  ) {
    this.jaula = this.activeRoute.snapshot.params.jaula;
    this.id = this.activeRoute.snapshot.params.id;
    this.back = this.activeRoute.snapshot.params.back;
    console.log(this.activeRoute.snapshot.params);
   }

  ngOnInit() {
  }

  userTyping(event: any){
    this.addProduct();
  }

  backView(){ 
    AuditsMobileComponent.returned.next(false);
    this.router.navigate(['audits']); 
  }

  addProduct(){
    let data : any = {
      auditId:this.id,
      productReference: this.inputValueScanner,
      packingReference: this.jaula
    }
    this.audit.addProduct(data).subscribe(res=>{
      this.presentToast('Producto agregado!!','success');
      this.inputValueScanner = '';
    },err=>{
      this.buttonStatus = true;
      this.presentToast('Ah ocurrido un error en el registro','danger');
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
