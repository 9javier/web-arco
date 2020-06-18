import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ExpeditionService,
  IntermediaryService,
  LabelsService,
  OplTransportsService,
  TypesService
} from '@suite/services';
import { PackageHistoryService } from '@suite/services';
import { AlertController, LoadingController, ModalController, NavParams } from "@ionic/angular";
import { Observable } from "rxjs";
import * as moment from 'moment';
import { HttpResponse } from "@angular/common/http";
import { InternOrderPackageStatus } from '../enums/status.enum';
import {MatAccordion} from '@angular/material/expansion';
import {switchMap} from 'rxjs/operators';
import {HttpRequestModel} from "../../../../services/src/models/endpoints/HttpRequest";
import { saveAs } from "file-saver";
import {environment} from "../../../../services/src/environments/environment";

@Component({
  selector: 'suite-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss']
})
export class HistoryDetailsComponent implements OnInit {

  data;
  order;
  location;
  package;
  orderHistorical;
  orderHistoricalLast;
  list;
  delivery;
  section = 'information';
 @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private typeService: TypesService,
    private packageService: PackageHistoryService,
    private modalController: ModalController,
    private navParams: NavParams,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private intermediaryService: IntermediaryService,
    private labelsService: LabelsService,
  ) {
    this.data = this.navParams.get("data");
    this.order = this.navParams.get("order");
    this.package = this.navParams.get("package");
    this.delivery = this.navParams.get("delivery");
  }

  ngOnInit() {
    this.getProductHistorical();
    this.getProductHistoricalLast();
    this.getList();
  }

  /**
   * Get historical of products
   */
  getProductHistorical(): void {
    this.packageService.getHistorical(this.order).subscribe(historical => {
      this.orderHistorical = historical;
    });
  }

  getProductHistoricalLast(): void {
    this.packageService.getHistoricalLast(this.package).subscribe(historical => {
      this.orderHistoricalLast = historical;
    });
  }

  getList(): void {
    this.packageService.getList(this.order).subscribe(historical => {
      this.list = historical;
    });
  }

  formattedDate(date) {
    return moment(date).format("DD/MM/YYYY")
  }

  formattedDateTime(date) {
    return moment(date).format("DD/MM/YYYY HH:mm")
  }

  close() {
    this.modalController.dismiss();
  }


  getStatus(status){
    switch (status) {
      case InternOrderPackageStatus.PENDING_COLLECTED:
        return 'Etiqueta generada';
        break;
      case InternOrderPackageStatus.COLLECTED:
        return 'Recogido';
        break;
      case InternOrderPackageStatus.SORTER_IN:
        return 'Entrada Sorter';
        break;
      case InternOrderPackageStatus.SORTER_OUT:
        return 'Salida Sorter';
        break;
      case InternOrderPackageStatus.JAIL_IN:
        return 'Ubicado embalaje';
        break;
      case InternOrderPackageStatus.SORTER_RACK_IN :
        return 'Estantería anexa Sorter';
        break;
      case InternOrderPackageStatus.RECEIVED:
        return 'Recepcionado';
        break;
      case InternOrderPackageStatus.WAREHOUSE_OUTPUT:
        return 'Salida Almacén';
        break;

      default:
        break;
    }

  }

  async printOrderTag() {

    let body = {expeditionId: this.data.order.expedition.id };
    await this.labelsService.postServicePrintPack(body).subscribe(result =>{
          for(let i=0;i < result.length;i++){
            let urlDownload = environment.downloadPdf+'/'+result[i];
            this.download_file(urlDownload, urlDownload);
          }

      },
      async (err) => {
        console.log(err);
        this.intermediaryService.presentToastError("No se pudo descargar el archivo");
      });
/*    this.printerService.printProductBoxTag(this.printerService.buildString([{text: textToPrint, order: <PrintModel.Order>this.data.order }]));*/
  }

  download_file(fileURL, fileName) {
      var save = document.createElement('a');
      save.href = fileURL;
      save.target = '_blank';
      var filename = fileURL.substring(fileURL.lastIndexOf('/')+1);
      save.download = fileName || filename;
      var evt = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': false
      });
      save.dispatchEvent(evt);
      (window.URL).revokeObjectURL(save.href);
  }

}
