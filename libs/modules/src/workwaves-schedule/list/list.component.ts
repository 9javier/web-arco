import { Component, OnInit } from '@angular/core';
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import {Event as NavigationEvent, NavigationExtras, NavigationStart, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'list-workwaves-schedule',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwavesScheduleComponent implements OnInit {

  public workWaves: any[];

  constructor(
    private alertController: AlertController,
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
          if (event.url == '/workwaves-scheduled') {
            this.loadWorkWaves();
          }
        }
      );
  }

  ngOnInit() {
    this.loadWorkWaves();
  }

  loadWorkWaves() {
    this.workwavesService
      .getListScheduled()
      .then((data: Observable<HttpResponse<WorkwaveModel.ResponseListScheduled>>) => {
        data.subscribe((res: HttpResponse<WorkwaveModel.ResponseListScheduled>) => {
          this.workWaves = res.body.data;
        });
      });
  }

  addWorkWave() {
    this.workwavesService.lastWorkwaveEdited = null;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: 2
      }
    };

    this.router.navigate(['workwave-template-rebuild'], navigationExtras);
  }

}
