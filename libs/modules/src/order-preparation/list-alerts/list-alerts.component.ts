import { Component, OnInit, ViewChild } from '@angular/core';
import { LabelsService } from '@suite/services';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { PrintLabelsModel } from '../../../../services/src/models/endpoints/PrintLabels';
import { ToolbarProvider } from "../../../../services/src/providers/toolbar/toolbar.provider";
import { IntermediaryService } from '@suite/services';
import { Router } from '@angular/router';
@Component({
  selector: 'list-alerts',
  templateUrl: './list-alerts.component.html',
  styleUrls: ['./list-alerts.component.scss'],
})
export class ListAlertsComponent implements OnInit {
 

  displayedColumns: string[]=['id','date','barcode','scanner'];
  dataSource
  constructor(
    private toolbarProvider: ToolbarProvider,
    private intermediaryService: IntermediaryService,
    private labelsService: LabelsService,
    private router: Router
      ) { }

  ngOnInit() {
    this.toolbarProvider.currentPage.next("Listado de alertas") 
    this.getListAlerts();   
  }
  
  async getListAlerts(){
    await this.intermediaryService.presentLoading("Cargando alertas");
    this.labelsService.getListAlertsExpedition().subscribe(result =>{
      console.log(result);
      this.dataSource = new MatTableDataSource<PrintLabelsModel.AlertsTable>(result); 
      this.intermediaryService.dismissLoading();
    },
    async (err) => {
      console.log(err);
      await this.intermediaryService.dismissLoading();
    });
  }

  goScanner(row){
    console.log(row.barcode);
    if(row.status == 6){
      this.labelsService.setScannerAlert(row.id);
      this.router.navigate(['/order-preparation']);
    }
  }

  refresh(){
    this.getListAlerts();
  }
 
  
}
