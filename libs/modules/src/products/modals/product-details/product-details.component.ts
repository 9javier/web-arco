import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TypesService } from '@suite/services';
import { ProductsService,InventoryModel } from '@suite/services';
import {PrinterService} from "../../../../../services/src/lib/printer/printer.service";
import {PrintModel} from "../../../../../services/src/models/endpoints/Print";

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

  /**Dictionary for fast access */
  actionTypes = {};


  constructor( 
    private typeService:TypesService,
    private productService:ProductsService,
    private modalController:ModalController,
    private navParams:NavParams,
    private printerService: PrinterService
    ) {
      this.product = this.navParams.get("product");
  }

  ngOnInit() {
    this.getProductHistorical();
    this.getActionTypes();
  }

  /**
   * Get action types
   */
  getActionTypes():void{
    this.typeService.getTypeActions().subscribe(ActionTypes=>{
      /**fill the actionTypes dictionary */
      ActionTypes.forEach(actionType=>{
        this.actionTypes[actionType.id] = actionType.name
      })
    })
  }

  /**
   * Get historical of products
   */
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

  /**
   * Print a Simple Product Tag
   */
  printProductTag() {
    this.printerService.printProductBoxTag(this.printerService.buildString([{product: <PrintModel.Product>this.product}]));
  }

}
