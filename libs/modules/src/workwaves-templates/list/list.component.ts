import { Component, OnInit } from '@angular/core';
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";

@Component({
  selector: 'list-workwaves-templates',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwavesTemplatesComponent implements OnInit {

  private workwavesTemplates: any[];

  constructor(
    private workwavesService: WorkwavesService
  ) {}

  ngOnInit() {
    this.workwavesService
      .getListTemplates()
      .then((data: Observable<HttpResponse<WorkwaveModel.ResponseListTemplates>>) => {
        data.subscribe((res: HttpResponse<WorkwaveModel.ResponseListTemplates>) => {
          this.workwavesTemplates = res.body.data;
        });
      });
  }

}
