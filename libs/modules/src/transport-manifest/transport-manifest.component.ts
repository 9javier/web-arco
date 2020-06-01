import { Component, OnInit, ViewChild } from '@angular/core';
import { LabelsService } from '@suite/services';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { PrintLabelsModel } from '../../../services/src/models/endpoints/PrintLabels';
import { ToolbarProvider } from "../../../services/src/providers/toolbar/toolbar.provider";
import { IntermediaryService } from '@suite/services';
import { Router } from '@angular/router';
import {OpExpeditionType} from "./enums/OplExpeditionStatusEnums";

@Component({
  selector: 'transport-manifest',
  templateUrl: './transport-manifest.component.html',
  styleUrls: ['./transport-manifest.component.scss'],
})
export class TransportManifestComponent implements OnInit {
  displayedColumns: string[]=['id','date','barcode','scanner'];
  dataSource
  init:boolean =false;
  constructor(
    private toolbarProvider: ToolbarProvider,
    private intermediaryService: IntermediaryService,
    private labelsService: LabelsService,
    private router: Router
  ) { }
  
  ionViewWillEnter(){
    if(this.init == false){
      this.getListAlerts();
    }
  }

  ngOnInit() {
    this.init = true;  
    this.toolbarProvider.currentPage.next("Listado de alertas") 
    this.getListAlerts();
  }
  
  async getListAlerts(){
    await this.intermediaryService.presentLoading("Cargando alertas");
    this.labelsService.getListAlertsExpedition().subscribe(result =>{
      let data=[];
      let c=0;
      result.forEach(element => {
        if(element.status == OpExpeditionType.LABEL_GENERATION_ERROR || element.status == OpExpeditionType.LABEL_ERROR_RESOLVED  ) {
          data.push(result[c])
        }
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
    if(row.status == OpExpeditionType.LABEL_ERROR_RESOLVED){
      this.ngOnDestroy();
      this.router.navigateByUrl('/order-preparation/id/'+row.id);
    }
  }

  refresh(){
    this.getListAlerts();
  }

  ngOnDestroy(){
    this.dataSource = null;
    this.init=false;
  }
  
}
