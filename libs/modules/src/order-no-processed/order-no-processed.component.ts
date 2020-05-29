import { Component, OnInit, ViewChild } from '@angular/core';
import { LabelsService,ExpeditionService } from '@suite/services';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { PrintLabelsModel } from '../../../services/src/models/endpoints/PrintLabels';
import { ToolbarProvider } from "../../../services/src/providers/toolbar/toolbar.provider";
import { IntermediaryService } from '@suite/services';
import { Router } from '@angular/router';
import {OpExpeditionType} from "./enums/OplExpeditionStatusEnums";

@Component({
  selector: 'order-no-processed',
  templateUrl: './order-no-processed.component.html',
  styleUrls: ['./order-no-processed.component.scss'],
})
export class OrderNoProcessedComponent implements OnInit {
  displayedColumns: string[]=['id','date','barcode','scanner'];
  dataSource
  init:boolean =false;

  orderId;

  constructor(
    private toolbarProvider: ToolbarProvider,
    private intermediaryService: IntermediaryService,
    private labelsService: LabelsService,
    private expeditionService: ExpeditionService,
    private router: Router
  ) { }
  
  ionViewWillEnter(){
    if(this.init == false){
      this.getListOrders();
    }
  }

  ngOnInit() {
    this.init = true;  
    this.toolbarProvider.currentPage.next("Listado de órdenes no procesadas") 
    this.getListOrders();
  }
  
  async getListOrders(){
    await this.intermediaryService.presentLoading("Cargando órdenes no procesadas");

    this.expeditionService.getListOrdersNoProcessed().subscribe(result =>{

      console.log("result=>",result)

      let data=[];
      let c=0;
      result.forEach(element => {
        // if(element.status == OpExpeditionType.LABEL_GENERATION_ERROR || element.status == OpExpeditionType.LABEL_ERROR_RESOLVED  ) {
          let data2 = {
            expedition:element.expedition,
            orderId:element.id
          }
          data.push(data2)
        // }
        c++;
      });
      this.dataSource = new MatTableDataSource<PrintLabelsModel.AlertsTable>(data); 
      this.intermediaryService.dismissLoading();
    },
    async (err) => {
      await this.intermediaryService.dismissLoading();
    });
  }


  goScanner(row){
    // if(row.status == OpExpeditionType.LABEL_ERROR_RESOLVED){
      console.log(row)
      this.ngOnDestroy();
      this.router.navigateByUrl('/order-preparation/id/'+row.expedition.id+"/"+true+"/"+row.orderId);
    // }
  }

  refresh(){
    this.getListOrders();
  }

  ngOnDestroy(){
    this.dataSource = null;
    this.init=false;
  }
  
}
