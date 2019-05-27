import { Component, OnInit } from '@angular/core';
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import {NavigationExtras, NavigationStart, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import { Event as NavigationEvent } from "@angular/router";

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
  ) {
    this.router.events
      .pipe(
        filter((event: NavigationEvent) => {
          return (event instanceof NavigationStart);
        })
      )
      .subscribe((event: NavigationStart) => {
          if (event.url == '/workwaves-templates') {
            this.loadWorkwavesTemplates();
          }
        }
      );
  }

  ngOnInit() {
    this.loadWorkwavesTemplates();
  }

  loadWorkwavesTemplates() {
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
