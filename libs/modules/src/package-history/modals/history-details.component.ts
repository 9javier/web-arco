import { Component, OnInit } from '@angular/core';
import { IntermediaryService, TypesService } from '@suite/services';
import { ProductsService, InventoryModel, PackageHistoryService } from '@suite/services';
import { AlertController, LoadingController, ModalController, NavParams } from "@ionic/angular";
import { Observable } from "rxjs";
import * as moment from 'moment';
import { HttpResponse } from "@angular/common/http";
import { InternOrderPackageStatus } from '../enums/status.enum';
@Component({
  selector: 'suite-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss']
})
export class HistoryDetailsComponent implements OnInit {
  
  order;
  orderHistorical;

  constructor(
    private typeService: TypesService,
    private packageService: PackageHistoryService,
    private modalController: ModalController,
    private navParams: NavParams,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private intermediaryService: IntermediaryService,
  ) {
    this.order = this.navParams.get("order");
  }

  ngOnInit() {
    this.getProductHistorical();
  }

  /**
   * Get historical of products
   */
  getProductHistorical(): void {
    this.packageService.getHistorical(this.order).subscribe(historical => {
      this.orderHistorical = historical;
    });
  }
  
  formattedDate(date) {
    return moment(date).format("DD/MM/YYYY")
  }

  close() {
    this.modalController.dismiss();
  }


  getStatus(status){
    switch (status) {
      case InternOrderPackageStatus.PENDING_COLLECTED:
        return 'Pendiente recogida';
        break;
      case InternOrderPackageStatus.COLLECTED:
        return 'Recogido';
        break;
      case InternOrderPackageStatus.SORTER_IN:
        return 'Dentro del sorter';
        break;
      case InternOrderPackageStatus.SORTER_OUT:
        return 'Salio del sorter';
        break;
      case InternOrderPackageStatus.JAIL_IN:
        return 'Dentro de la jaula';
        break;
      case InternOrderPackageStatus.PENDING_COLLECTED:
        return 'Pendiente recogida';
        break;
      case InternOrderPackageStatus.SORTER_RACK_IN :
        return 'Ingreso Estanteria anexa';
        break;
      case InternOrderPackageStatus.RECEIVED:
        return 'Recepcionado';
        break;
    
      default:
        break;
    }

  }

}
