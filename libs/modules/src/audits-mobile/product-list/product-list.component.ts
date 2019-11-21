import { Component, OnInit } from '@angular/core';
import { AuditsService } from '@suite/services';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public Products : any = [{name:'yui'}];
  public jaula : any ;
  public id : any ;
  public back : any ;

  constructor(
    private audit : AuditsService,
    private toast : ToastController,
    private activeRoute: ActivatedRoute
  ) { 
    this.jaula = this.activeRoute.snapshot.params.jaula;
    this.id = this.activeRoute.snapshot.params.id;
    this.back = this.activeRoute.snapshot.url[0].path;
  }

  ngOnInit() {
    this.listProducts();
  }

  listProducts(){
    this.audit.getProducts({packingReference:this.jaula}).subscribe(res =>{
      this.Products = res.data;
      console.log(res);
    },err =>{
      this.presentToast(err.error.result.reason,'danger');
    })
  }

  async presentToast(message,color) {
    const toast = await this.toast.create({
      message: message,
      color: color,
      duration: 4000
    });
    toast.present();
  }

}
