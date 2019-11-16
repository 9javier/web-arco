import { Component, OnInit } from '@angular/core';
import { AuditsService } from '@suite/services';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-sccaner-product',
  templateUrl: './sccaner-product.component.html',
  styleUrls: ['./sccaner-product.component.scss']
})
export class SccanerProductComponent implements OnInit {

  public inputValueScanner: String = '';
  public jaula : string = '';
  public id : any = '';

  constructor(
    private audit : AuditsService,
    private toast : ToastController,
    private activeRoute: ActivatedRoute,
  ) {
    this.jaula = this.activeRoute.snapshot.params.jaula;
    this.id = this.activeRoute.snapshot.params.id;
    console.log(this.activeRoute.snapshot.params);
   }

  ngOnInit() {
  }

  userTyping(event: any){
    this.addProduct();
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
