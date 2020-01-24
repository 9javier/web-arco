import { Component, OnInit } from '@angular/core';
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import {Router} from "@angular/router";
import {PickingService} from "../../../../services/src/lib/endpoint/picking/picking.service";
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";

@Component({
  selector: 'list-workwaves-history',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwavesHistoryComponent implements OnInit {

  public workwavesHistory: any[] = [];

  constructor(
    private router: Router,
    private workwavesService: WorkwavesService,
    private pickingService: PickingService,
    private pickingProvider: PickingProvider
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
          console.log(this.workwavesHistory);
        });
      });
  }

  showWorkwave(workwave) {
    this.workwavesService.lastWorkwaveEdited = null;
    this.workwavesService.lastWorkwaveHistoryQueried = workwave;
    this.pickingProvider.listPickingsHistory = null;

    this.pickingService
      .getShow(this.workwavesService.lastWorkwaveHistoryQueried.id)
      .subscribe((res: PickingModel.ResponseShow) => {
        if ((res.code == 200 || res.code == 201) && res.data && res.data.length > 0) {
          this.pickingProvider.listPickingsHistory = res.data;
          this.router.navigate(['workwaves-history/pickings']);
        } else {
          this.pickingProvider.listPickingsHistory = null;
          this.router.navigate(['workwaves-history/detail']);
        }
      }, error => {
        this.pickingProvider.listPickingsHistory = null;
        this.router.navigate(['workwaves-history/detail']);
      });
  }

}
