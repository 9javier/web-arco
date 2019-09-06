import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PickingProvider} from "../../../services/src/providers/picking/picking.provider";
import {AuthenticationService} from "@suite/services";

@Component({
  selector: 'suite-picking-tasks',
  templateUrl: './picking-tasks.component.html',
  styleUrls: ['./picking-tasks.component.scss']
})
export class PickingTasksComponent implements OnInit {

  public isStore: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private pickingProvider: PickingProvider
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params: any )=> {
      let paramsReceived = params.params;
      if (typeof paramsReceived.method == 'string' && paramsReceived.method == 'manual') {
        this.pickingProvider.method = 'manual';
      } else {
        this.pickingProvider.method = 'scanner';
      }
    });

    this.isStore = await this.authenticationService.isStoreUser();
  }

}
