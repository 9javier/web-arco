import { Component, OnInit } from '@angular/core';
import {PickingProvider} from "../../../../../services/src/providers/picking/picking.provider";
import {ShoesPickingModel} from "../../../../../services/src/models/endpoints/ShoesPicking";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'list-products-history',
  templateUrl: './modal-products.component.html',
  styleUrls: ['./modal-products.component.scss']
})
export class ListProductsHistoryComponent implements OnInit {

  public listProducts: ShoesPickingModel.ShoesPicking[];
  public title = 'Productos';

  constructor(
    private modalController: ModalController,
    private pickingProvider: PickingProvider
  ) {}

  ngOnInit() {
    this.listProducts = this.pickingProvider.listProductsFromPickingHistory;
  }

  goToList() {
    this.modalController.dismiss();
  }

}
