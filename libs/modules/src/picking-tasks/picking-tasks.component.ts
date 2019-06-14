import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'suite-picking-tasks',
  templateUrl: './picking-tasks.component.html',
  styleUrls: ['./picking-tasks.component.scss']
})
export class PickingTasksComponent implements OnInit {

  method: string = 'scanner';

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: any )=> {
      let paramsReceived = params.params;
      if (typeof paramsReceived.method == 'string' && paramsReceived.method == 'manual') {
        this.method = 'manual';
      }
    });
  }

}
