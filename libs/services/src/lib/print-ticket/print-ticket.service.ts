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
    const defectType = defective && defective.defectTypeParent && defective.defectTypeParent.includeInIncidenceTicket==true ? defective.defectTypeParent.name : '';
    const defectZone = defective && defective.defectZoneParent && defective.defectZoneParent.includeInIncidenceTicket==true ? defective.defectZoneParent.name : '';
    const defectTypeChild = defective && defective.defectTypeChild && defective.defectTypeChild.includeInIncidenceTicket==true ? defective.defectTypeChild.name : '';
    const defectZoneChild = defective && defective.defectZoneChild && defective.defectZoneChild.includeInIncidenceTicket==true ? defective.defectZoneChild.name : '';
    const observations = defective ? defective.observations : '';
    const updatedAt = defective ? moment(defective.updatedAt).format('DD/MM/YYYY  HH:mm') : '';
    const incidenceDate = defective ? moment(defective.dateDetection).format('DD/MM/YYYY  HH:mm') : '';
    const incidenceId = defective && defective.warehouse ? ''+ defective.warehouse.reference +'/'+ defective.warehouseDefectIdentifier +'' : '';
    const warehouseName = defective && defective.warehouse ? defective.warehouse.name : '';
    const warehouseSocialName = defective && defective.warehouse && defective.warehouse.companyName ? defective.warehouse.companyName : '';
    let warehouseDirection = '';
    if(defective && defective.warehouse){
      if(defective.warehouse.address1){
        warehouseDirection += defective.warehouse.address1;
      }
      if(defective.warehouse.address2){
        warehouseDirection += ' ' + defective.warehouse.address2;
      }
      if(defective.warehouse.zipCode){
        warehouseDirection += ' ' + defective.warehouse.zipCode;
      }
      if(defective.warehouse.city){
        warehouseDirection += ' ' + defective.warehouse.city;
      }
    }
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
        let htmlToPrintF = htmlToPrintE.replace('{{Razón social}}', warehouseSocialName);
        let htmlToPrintG = htmlToPrintF.replace('{{status}}', statusName);
        let htmlToPrintH = htmlToPrintG.replace('{{updatedAt}}', updatedAt);
        let htmlToPrintI = htmlToPrintH.replace('{{product}}', modelName);
        let htmlToPrintJ = htmlToPrintI.replace('{{size}}', sizeName);
        let htmlToPrintK = htmlToPrintJ.replace('{{barcode}}', productReference);
        let htmlToPrintL = htmlToPrintK.replace('{{observations}}', observations);
        let htmlToPrintM = htmlToPrintL.replace('{{userAl}}', userAl);
        let htmlToPrintN = htmlToPrintM.replace('{{defectType}}', defectType);
        let htmlToPrintO = htmlToPrintN.replace('{{defectTypeChild}}', defectTypeChild);
        let htmlToPrintP = htmlToPrintO.replace('{{defectZone}}', defectZone);
        let htmlToPrintQ = htmlToPrintP.replace('{{defectZoneChild}}', defectZoneChild);

        if( ((defective.defectTypeChild && defective.defectTypeChild.includeInIncidenceTicket==true)
          || (defective.defectTypeParent && defective.defectTypeParent.includeInIncidenceTicket==true))
          && ((defective.defectZoneChild && defective.defectZoneChild.includeInIncidenceTicket==true)
          || (defective.defectZoneParent && defective.defectZoneParent.includeInIncidenceTicket==true))
        ){
          if(cordova.plugins.printer) {
            cordova.plugins.printer.print(htmlToPrintQ);
          }
        }else{
          if( defective.defectTypeChild && defective.defectTypeChild.includeInIncidenceTicket==false
            && defective.defectTypeParent && defective.defectTypeParent.includeInIncidenceTicket==false
            && defective.defectZoneChild && defective.defectZoneChild.includeInIncidenceTicket==false
            && defective.defectZoneParent && defective.defectZoneParent.includeInIncidenceTicket==false
          ){
            let htmlToPrintR = htmlToPrintQ.replace('class="type"', displayNone);
            let htmlToPrintS = htmlToPrintR.replace('class="zone"', displayNone);
            if(cordova.plugins.printer) {
              cordova.plugins.printer.print(htmlToPrintS);
            }
          }else{
            if( defective.defectTypeChild && defective.defectTypeChild.includeInIncidenceTicket==false
              && defective.defectTypeParent && defective.defectTypeParent.includeInIncidenceTicket==false
          ){
              let htmlToPrintR = htmlToPrintQ.replace('class="type"', displayNone);
              if(cordova.plugins.printer) {
                cordova.plugins.printer.print(htmlToPrintR);
              }
            }else{
              let htmlToPrintR = htmlToPrintQ.replace('class="zone"', displayNone);
              if(cordova.plugins.printer) {
                cordova.plugins.printer.print(htmlToPrintR);
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
