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
import * as moment from 'moment';

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
    const defectType = defective && defective.defectTypeParent && defective.defectTypeChild && defective.defectTypeChild.includeInIncidenceTicket==true ? defective.defectTypeParent.name + ' - ' + defective.defectTypeChild.name : '';
    const defectZone = defective && defective.defectZoneParent && defective.defectZoneChild && defective.defectZoneChild.includeInIncidenceTicket==true ? defective.defectZoneParent.name + ' - ' + defective.defectZoneChild.name : '';
    const observations = defective ? defective.observations : '';
    const updatedAt = defective ? moment(defective.updatedAt).format('DD/MM/YYYY  HH:mm') : '';
    const incidenceDate = defective ? moment(defective.dateDetection).format('DD/MM/YYYY  HH:mm') : '';
    let warehouseIdentifier = defective && defective.warehouseDefectIdentifier ? defective.warehouseDefectIdentifier : '';
    warehouseIdentifier = warehouseIdentifier.toString();
    warehouseIdentifier = warehouseIdentifier.padStart(10,0);
    const incidenceId = defective && defective.warehouse ? defective.warehouse.reference + ' / ' + warehouseIdentifier: '';
    const warehouseName = defective && defective.warehouse ? defective.warehouse.name : '';
    const warehouseDirection = defective && defective.warehouse && defective.warehouse.direction && defective.warehouse.phone ? defective.warehouse.direction+ ' / ' +defective.warehouse.phone : '';
    const warehousePhone = defective && defective.warehouse && defective.warehouse.phone ? defective.warehouse.phone : '';
    const statusName = defective && defective.statusManagementDefect ? defective.statusManagementDefect.name : '';
    const userAl = defective && defective.user ? defective.user.name : '';
    const displayNone = 'style="display: none"';

    try {
      fetch('assets/templates/print-defect.html').then(res => res.text()).then(data => {

        let htmlToPrintA = data.replace('{{incidenceId}}', incidenceId);
        let htmlToPrintB = htmlToPrintA.replace('{{incidenceDate}}', incidenceDate);
        let htmlToPrintC = htmlToPrintB.replace('{{warehouse}}', warehouseName);
        let htmlToPrintD = htmlToPrintC.replace('{{warehouseDirection}}', warehouseDirection);
        let htmlToPrintE = htmlToPrintD.replace('{{warehousePhone}}', warehousePhone);
        let htmlToPrintF = htmlToPrintE.replace('{{Razón social}}', warehouseName);
        let htmlToPrintG = htmlToPrintF.replace('{{status}}', statusName);
        let htmlToPrintH = htmlToPrintG.replace('{{updatedAt}}', updatedAt);
        let htmlToPrintI = htmlToPrintH.replace('{{product}}', modelName);
        let htmlToPrintJ = htmlToPrintI.replace('{{size}}', sizeName);
        let htmlToPrintK = htmlToPrintJ.replace('{{barcode}}', productReference);
        let htmlToPrintL = htmlToPrintK.replace('{{defectType}}', defectType);
        let htmlToPrintM = htmlToPrintL.replace('{{defectZone}}', defectZone);
        let htmlToPrintN = htmlToPrintM.replace('{{observations}}', observations);
        let htmlToPrintO = htmlToPrintN.replace('{{userAl}}', userAl);
        if(defective.defectTypeChild.includeInIncidenceTicket==true && defective.defectZoneChild.includeInIncidenceTicket==true){
          if(cordova.plugins.printer) {
            cordova.plugins.printer.print(htmlToPrintO);
          }
        }else{
          if(defective.defectTypeChild.includeInIncidenceTicket==true){
            let htmlToPrintP = htmlToPrintO.replace('class="zone"', displayNone);
            if(cordova.plugins.printer) {
              cordova.plugins.printer.print(htmlToPrintP);
            }
          }else{
            if(defective.defectZoneChild.includeInIncidenceTicket==true){
              let htmlToPrintP = htmlToPrintO.replace('class="type"', displayNone);
              if(cordova.plugins.printer) {
                cordova.plugins.printer.print(htmlToPrintP);
              }
            }else{
              let htmlToPrintP = htmlToPrintO.replace('class="type"', displayNone);
              let htmlToPrintQ = htmlToPrintP.replace('class="zone"', displayNone);
              if(cordova.plugins.printer) {
                cordova.plugins.printer.print(htmlToPrintQ);
              }
            }
          }
        }
      });
    }catch (e) {
      console.error("Error get template", e)
    }
  }

}
