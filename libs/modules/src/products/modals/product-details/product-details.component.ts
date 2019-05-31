import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ProductsService,InventoryModel } from '@suite/services';

@Component({
  selector: 'suite-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  /**The section that by showed in the modal */
  section='information';

  product:InventoryModel.SearchInContainer;
  productHistorical;

  constructor( 
    private productService:ProductsService,
    private modalController:ModalController,
    private navParams:NavParams) { 
      this.product = this.navParams.get("product");
  }

  ngOnInit() {
    this.getProductHistorical();
  }

  getProductHistorical():void{
    this.productService.getHistorical(this.product.id).subscribe(historical=>{
      this.productHistorical = historical;
    });
  }

  /**
   * Close the current instance of the modal
   */
  close(){
    this.modalController.dismiss();
  }

}
