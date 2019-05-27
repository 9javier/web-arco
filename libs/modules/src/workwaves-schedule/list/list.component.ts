import { Component, OnInit } from '@angular/core';
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'list-workwaves-schedule',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwavesScheduleComponent implements OnInit {

  private workwavesScheduled: any[];

  constructor(
    private workwavesService: WorkwavesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.workwavesService
      .getListScheduled()
      .then((data: Observable<HttpResponse<WorkwaveModel.ResponseListScheduled>>) => {
        data.subscribe((res: HttpResponse<WorkwaveModel.ResponseListScheduled>) => {
          this.workwavesScheduled = res.body.data;
        });
      });
  }

  addWorkwave() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: 2
      }
    };

    this.router.navigate(['workwave-template'], navigationExtras);
  }

}
