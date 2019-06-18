import {Component, Input, OnInit} from '@angular/core';
import {PickingModel} from "../../../../../services/src/models/endpoints/Picking";
import {PickingProvider} from "../../../../../services/src/providers/picking/picking.provider";
import {ShoesPickingService} from "../../../../../services/src/lib/endpoint/shoes-picking/shoes-picking.service";
import {ShoesPickingModel} from "../../../../../services/src/models/endpoints/ShoesPicking";
import {ModalController} from "@ionic/angular";
import {ListProductsHistoryComponent} from "../modal-products/modal-products.component";

@Component({
  selector: 'picking-history',
  templateUrl: './picking.component.html',
  styleUrls: ['./picking.component.scss']
})
export class PickingHistoryComponent implements OnInit {

  @Input() pickingHistory: PickingModel.Picking;

  constructor(
    private modalController: ModalController,
    private shoesPickingService: ShoesPickingService,
    public pickingProvider: PickingProvider
  ) {}

  ngOnInit() {}

  showProducts() {
    this.shoesPickingService
      .getListByPicking(this.pickingHistory.id)
      .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
        this.pickingProvider.listProductsFromPickingHistory = res.data;
        this.createModalProducts();
      }, error => {
        console.error('Error Subscribe to Query Products for Pickings of a Workwave of History -> ', error);
      });
  }

  async createModalProducts() {
    let modalProducts = await this.modalController.create({
      component: ListProductsHistoryComponent
    });

    return await modalProducts.present();
  }

}
