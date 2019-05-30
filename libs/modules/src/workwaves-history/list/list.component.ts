import { Component, OnInit } from '@angular/core';
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import {Router} from "@angular/router";

@Component({
  selector: 'list-workwaves-history',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwavesHistoryComponent implements OnInit {

  public workwavesHistory: any[] = [];

  constructor(
    private workwavesService: WorkwavesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadWorkwavesTemplates();
  }

  loadWorkwavesTemplates() {
    this.workwavesService
      .getListExecuted()
      .then((data: Observable<HttpResponse<WorkwaveModel.ResponseListExecuted>>) => {
        data.subscribe((res: HttpResponse<WorkwaveModel.ResponseListExecuted>) => {
          this.workwavesHistory = res.body.data;
        });
      });
  }

  showWorkwaveDetail(workwave) {
    this.workwavesService.lastWorkwaveHistoryQueried = workwave;

    this.router.navigate(['workwaves-history/detail']);
  }

}
