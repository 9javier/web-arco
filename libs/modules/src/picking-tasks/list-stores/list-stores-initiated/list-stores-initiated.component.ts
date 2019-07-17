import {Component, Input, OnInit} from '@angular/core';
import {StoresLineRequestsModel} from "../../../../../services/src/models/endpoints/StoresLineRequests";
import {WarehouseModel} from "@suite/services";

@Component({
  selector: 'stores-picking-task-initiated-template',
  templateUrl: './list-stores-initiated.component.html',
  styleUrls: ['./list-stores-initiated.component.scss']
})
export class StoresPickingTaskInitiatedTemplateComponent implements OnInit {

  @Input() stores: WarehouseModel.Warehouse[] = [];
  @Input() lineRequests: StoresLineRequestsModel.LineRequests[] = [];

  constructor() {}

  ngOnInit() {

  }

}
