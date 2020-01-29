import {Component, Input, OnInit} from '@angular/core';
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";
import {ShoesPickingService} from "../../../../services/src/lib/endpoint/shoes-picking/shoes-picking.service";
import {ShoesPickingModel} from "../../../../services/src/models/endpoints/ShoesPicking";
import {ModalController} from "@ionic/angular";
import {ListProductsComponent} from "../modal-products/modal-products.component";
import {JailModel} from "@suite/services";

@Component({
  selector: 'picking',
  templateUrl: './picking.component.html',
  styleUrls: ['./picking.component.scss']
})
export class PickingComponent implements OnInit {

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
      component: ListProductsComponent,
      cssClass: "picking-product-list",
      componentProps: { id: this.pickingHistory.id }
    });

    return await modalProducts.present();
  }

  processPickingPackings(): string {
    if (this.pickingHistory.packingRef) {
      return this.pickingHistory.packingRef;
    } else {
      return this.pickingHistory.listPackings.map((packing: JailModel.Jail) => {
        return packing.reference;
      }).join(', ');
    }
  }

}
