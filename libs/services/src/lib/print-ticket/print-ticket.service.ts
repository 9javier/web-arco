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
  constructor(
  ) { }

  public async printTicket(defective) {

    const modelName = defective && defective.product && defective.product.model ? defective.product.model.name : '';
    const sizeName = defective && defective.product && defective.product.size ? defective.product.size.name : '';
    const productReference = defective && defective.product ? defective.product.reference : '';
    const defectType = defective && defective.defectTypeParent && defective.defectTypeChild ? defective.defectTypeParent.name + ' - ' + defective.defectTypeChild.name : '';
    const observations = defective ? defective.observations : '';
    const updatedAt = defective ? defective.updatedAt : '';
    const incidenceDate = defective ? defective.dateDetection : '';
    const incidenceId = defective ? defective.id.toString() : '';
    const warehouseName = defective && defective.warehouse ? defective.warehouse.name : '';
    const statusName = defective && defective.statusManagementDefect ? defective.statusManagementDefect.name : '';
    try {
      fetch('assets/templates/print-defect.html').then(res => res.text()).then(data => {

        let htmlToPrintA = data.replace('{{incidenceId}}', incidenceId);
        let htmlToPrintB = htmlToPrintA.replace('{{incidenceDate}}', incidenceDate);
        let htmlToPrintC = htmlToPrintB.replace('{{warehouse}}', warehouseName);
        let htmlToPrintD = htmlToPrintC.replace('{{warehouseDirection}}', "");
        let htmlToPrintE = htmlToPrintD.replace('{{warehouseTlf}}', "");
        let htmlToPrintF = htmlToPrintE.replace('{{Razón social}}', warehouseName);
        let htmlToPrintG = htmlToPrintF.replace('{{status}}', statusName);
        let htmlToPrintH = htmlToPrintG.replace('{{updatedAt}}', updatedAt);
        let htmlToPrintI = htmlToPrintH.replace('{{product}}', modelName);
        let htmlToPrintJ = htmlToPrintI.replace('{{size}}', sizeName);
        let htmlToPrintK = htmlToPrintJ.replace('{{barcode}}', productReference);
        let htmlToPrintL = htmlToPrintK.replace('{{defectType}}', defectType);
        let htmlToPrintM = htmlToPrintL.replace('{{observations}}', observations);

        if(cordova.plugins.printer) {
          cordova.plugins.printer.print(htmlToPrintM);
        }
      });
    }catch (e) {
      console.error("Error get template", e)
    }
  }

}
