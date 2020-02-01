import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";
import * as moment from 'moment';
import {ModalController} from "@ionic/angular";
import {ListProductsComponent} from "../modal-products/modal-products.component";
import {ShoesPickingModel} from "../../../../services/src/models/endpoints/ShoesPicking";
import {ShoesPickingService} from "../../../../services/src/lib/endpoint/shoes-picking/shoes-picking.service";
import { IntermediaryService } from '@suite/services';

@Component({
  selector: 'picking',
  templateUrl: './picking.component.html',
  styleUrls: ['./picking.component.scss']
})
export class PickingComponent implements OnInit {

  @Input() picking: PickingModel.PendingPickingsSelected;
  @Output() pickingSelection = new EventEmitter();

  public STATUS_PICKING_INITIATED: number = 2;

  constructor(
    private modalController: ModalController,
    private intermediaryService: IntermediaryService,
    private shoesPickingService: ShoesPickingService,
    public pickingProvider: PickingProvider
  ) {}

  ngOnInit() {}

  selectPicking() {
    this.pickingSelection.next({id: this.picking.id, value: this.picking.selected, delete: this.picking.status != this.STATUS_PICKING_INITIATED});
  }

  dateCreatedParsed() : string {
    moment.locale('es');
    return moment(this.picking.createdAt).format('ddd, DD/MM/YYYY');
  }

  timeCreatedParsed() : string {
    moment.locale('es');
    return moment(this.picking.createdAt).format('LT');
  }

  showProducts() {
    this.shoesPickingService
      .getListByPicking(this.picking.id)
      .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
        this.pickingProvider.listProductsFromPickingHistory = res.data;
        this.createModalProducts();
      }, error => {
        console.error('Error::Subscribe:shoesPickingService::getListByPicking::', error);
        this.intermediaryService.presentToastError('Ha ocurrido un error al intentar cargar los productos del picking.');
      });
  }

  private async createModalProducts() {
    let modal = await this.modalController.create({
      component: ListProductsComponent,
      cssClass: 'picking-product-list',
      componentProps: {id: this.picking.id}
    });

    return await modal.present();
  }
}
