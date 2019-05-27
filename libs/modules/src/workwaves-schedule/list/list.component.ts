import { Component, OnInit } from '@angular/core';
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";

@Component({
  selector: 'list-workwaves-schedule',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwavesScheduleComponent implements OnInit {

  private workwavesScheduled: any[];

  constructor(
    private workwavesService: WorkwavesService
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

}
