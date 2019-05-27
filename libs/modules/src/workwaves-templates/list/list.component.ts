import { Component, OnInit } from '@angular/core';
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'list-workwaves-templates',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwavesTemplatesComponent implements OnInit {

  private workwavesTemplates: any[];

  constructor(
    private workwavesService: WorkwavesService,
    private router: Router
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

  addWorkwave() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: 3
      }
    };

    this.router.navigate(['workwave-template'], navigationExtras);
  }

}
