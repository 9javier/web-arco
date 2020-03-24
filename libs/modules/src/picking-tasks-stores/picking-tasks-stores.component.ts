import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PickingProvider} from "../../../services/src/providers/picking/picking.provider";

@Component({
  selector: 'suite-picking-tasks-stores',
  templateUrl: './picking-tasks-stores.component.html',
  styleUrls: ['./picking-tasks-stores.component.scss']
})
export class PickingTasksStoresComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private pickingProvider: PickingProvider
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params: any ) => {
      let paramsReceived = params.params;
      if (typeof paramsReceived.method === 'string' && paramsReceived.method === 'manual') {
        this.pickingProvider.method = 'manual';
      } else {
        this.pickingProvider.method = 'scanner';
      }
    });
  }

}
