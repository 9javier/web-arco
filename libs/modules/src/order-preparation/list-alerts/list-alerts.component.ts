import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { PrintLabelsModel } from '../../../../services/src/models/endpoints/PrintLabels';
import { ToolbarProvider } from "../../../../services/src/providers/toolbar/toolbar.provider";
import { IntermediaryService } from '@suite/services';

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
    private intermediaryService: IntermediaryService
  ) { }

  ngOnInit() {
    this.toolbarProvider.currentPage.next("Listado de alertas") 
    this.dataSource = new MatTableDataSource<PrintLabelsModel.AlertsTable>(this.alert);    
  }
  

  
}
