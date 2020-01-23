import { Component, OnInit } from '@angular/core';
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";
import {ShoesPickingModel} from "../../../../services/src/models/endpoints/ShoesPicking";
import {ModalController} from "@ionic/angular";
import { IntermediaryService } from '@suite/services';

@Component({
  selector: 'list-products',
  templateUrl: './modal-products.component.html',
  styleUrls: ['./modal-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  public listProducts: ShoesPickingModel.ShoesPicking[];
  public title = 'Productos';

  constructor(
    private modalController: ModalController,
    private pickingProvider: PickingProvider,
    private intermediaryService: IntermediaryService,
  ) {}

  ngOnInit() {
this.loadPicking();
  }
loadPicking(){
    this.intermediaryService.presentLoading("Refrescando listado");
    return this.listProducts = this.pickingProvider.listProductsFromPickingHistory;
    this.intermediaryService.dismissLoading();
}
  goToList() {
    this.modalController.dismiss();
  }



  getProductStatusName(product: ShoesPickingModel.ShoesPicking): string {
    if (product && product.status) {
      switch (product.status) {
        case 1:
          return 'PENDIENTE';
        case 2:
          return 'ESCANEADO';
        case 4:
          return 'PREVENTILADO';
        case 7:
          return 'PREVERIFICADO';
        case 8:
          return 'DEFECTUSOSO';
        case 9:
          return 'NO APTO ONLINE';
        case 10:
          return 'VERIFICADO';
        default:
          return 'error';
      }
    }

    return '';
  }


}
