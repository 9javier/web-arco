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
 

  displayedColumns: string[]=['id','name','barcode','scanner']
 alert=[ 
   {
    id:1,
    name: "FEDEX",
    code:"7545646456",
    type:1
  },
  {
    id:2,
    name: "DHL",
    code:"96545646456",
    type:2
  },
  {
    id:3,
    name: "UPS",
    code:"6545646456",
    type:1
  },
  {
    id:4,
    name: "FEDEX",
    code:"6545646456",
    type:2
  },
  {
    id:5,
    name: "DHL",
    code:"1545646456",
    type:2
  },
  {
    id:6,
    name: "DHL",
    code:"6547846456",
    type:1
  },
  {
    id:7,
    name: "FEDEX",
    code:"6537646456",
    type:1
  },
  {
    id:8,
    name: "DHL",
    code:"6544564645",
    type:2
  }
  ]
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
    this.labelsService.getListAlerts().subscribe(result =>{
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
    console.log(row);
    if(row.typeError == 2){
      this.labelsService.setScannerAlert({ id: row.id, status:true});
      this.router.navigate(['/order-preparation']);
    }
  }
  
}
