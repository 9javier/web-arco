import { Component, OnInit } from '@angular/core';
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";
import {ShoesPickingModel} from "../../../../services/src/models/endpoints/ShoesPicking";
import {ModalController, NavParams} from "@ionic/angular";
import { IntermediaryService } from '@suite/services';
import {ShoesPickingService} from "../../../../services/src/lib/endpoint/shoes-picking/shoes-picking.service";

@Component({
  selector: 'list-products',
  templateUrl: './modal-products.component.html',
  styleUrls: ['./modal-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  public listProducts: ShoesPickingModel.ShoesPicking[];
  public title = 'Productos';
  private pickingId;

  constructor(
    private modalController: ModalController,
    private pickingProvider: PickingProvider,
    private intermediaryService: IntermediaryService,
    private shoesPickingService: ShoesPickingService,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.pickingId = this.navParams.get('id');
    this.loadPicking();
  }

  loadPicking(){
    this.intermediaryService.presentLoading("Actualizando...");
    this.shoesPickingService
    .getListByPicking(this.pickingId)
    .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
      this.pickingProvider.listProductsFromPickingHistory = res.data;
      this.listProducts = this.pickingProvider.listProductsFromPickingHistory;
      this.intermediaryService.dismissLoading();
    }, error => {
      console.error('Error Subscribe to Query Products for Pickings of a Workwave of History -> ', error);
    });
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
        case 3:
          return 'ASIGNACION TEMP.';
        case 4:
          return 'PREVENTILADO';
        case 5:
          return 'PRECINTADO';
        case 6:
          return 'ASIGNACION TEMP.';
        case 7:
          return 'PREVERIFICADO';
        case 8:
          return 'DEFECTUSOSO';
        case 9:
          return 'NO APTO ONLINE';
        case 10:
          return 'VERIFICADO';
        case 11:
          return 'PREVERIFICADO TEMP.';
        default:
          return 'error';
      }
    }

    return '';
  }


}
