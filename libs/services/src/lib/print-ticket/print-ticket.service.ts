import { Injectable } from '@angular/core';
import { PrintModel } from "../../models/endpoints/Print";
import { SettingsService } from "../storage/settings/settings.service";
import { AppSettingsModel } from "../../models/storage/AppSettings";
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, Subject } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { PriceService } from '../endpoint/price/price.service';
import { WarehouseService } from '../endpoint/warehouse/warehouse.service';
import { ProductsService } from '../endpoint/products/products.service';
import { DefectiveManagementService } from '../endpoint/defective-management/defective-management.service';
import * as JsBarcode from 'jsbarcode';
import { IntermediaryService, ProductModel } from '@suite/services';
import { RequestsProvider } from "../../providers/requests/requests.provider";
import { HttpRequestModel } from "../../models/endpoints/HttpRequest";
import { TimesToastType } from '../../models/timesToastType';
import {DefectiveRegistryModel} from "../../models/endpoints/DefectiveRegistry";
import DefectiveRegistry = DefectiveRegistryModel.DefectiveRegistry;

declare let cordova: any;

@Injectable({
  providedIn: 'root'
})
export class PrintTicketService {

  private static readonly MAX_PRINT_ATTEMPTS = 5;

  /**urls for printer service */
  private getProductsByReferenceUrl: string = environment.apiBase + "/products/references";
  private printNotifyUrl: string = environment.apiBase + "/tariffs/printReferences";
  private printNotifyNewProductUrl: string = environment.apiBase + "/processes/receive-store/printReferences";

  public stampe$: Subject<boolean> = new Subject();

  private address: string;

  constructor(
    private http: HttpClient,
    private intermediaryService: IntermediaryService,
    private settingsService: SettingsService,
    private priceService: PriceService,
    private warehouseService: WarehouseService,
    private productsService: ProductsService,
    private defectiveManagementService: DefectiveManagementService,
    private requestsProvider: RequestsProvider
  ) { }

  public async printTicket(defective, statusType) {
    let product = await this.productsService.getInfo(defective.product.reference);

    await this.defectiveManagementService.getShow(defective.defectTypeParent).subscribe(defectType => {

      let defectTypeParent = defectType.name;
      let defectTypeChild = "";
      defectType.defectTypeChild.forEach( childType => {
        if(childType.id == defective.defectTypeChild){
          defectTypeChild = childType.name;
        }
      });
      this.warehouseService.getShow(defective.warehouse).subscribe(warehouseShow => {
        let warehouseName = warehouseShow.name;

        try {
          fetch('assets/templates/print-defect.html').then(res => res.text()).then(data => {

            let htmlToPrintA = data.replace('{{incidenceId}}', defective.id.toString());
            let htmlToPrintB = htmlToPrintA.replace('{{incidenceDate}}', defective.dateDetection);
            let htmlToPrintC = htmlToPrintB.replace('{{warehouse}}', warehouseName);
            let htmlToPrintD = htmlToPrintC.replace('{{warehouseDirection}}', "");
            let htmlToPrintE = htmlToPrintD.replace('{{warehouseTlf}}', "");
            let htmlToPrintF = htmlToPrintE.replace('{{Razón social}}', warehouseName);
            let htmlToPrintG = htmlToPrintF.replace('{{status}}', statusType);
            let htmlToPrintH = htmlToPrintG.replace('{{updatedAt}}', defective.updatedAt);
            let htmlToPrintI = htmlToPrintH.replace('{{product}}', product.data.model.name);
            let htmlToPrintJ = htmlToPrintI.replace('{{size}}', product.data.size.name);
            let htmlToPrintK = htmlToPrintJ.replace('{{barcode}}', defective.product.reference);
            let htmlToPrintL = htmlToPrintK.replace('{{defectType}}', defectTypeParent +" - "+ defectTypeChild);
            let htmlToPrintM = htmlToPrintL.replace('{{observations}}', defective.observations);

            if(cordova.plugins.printer) {
              cordova.plugins.printer.print(htmlToPrintM);
            }
          });
        }catch (e) {}

        });
      });
  }

}
