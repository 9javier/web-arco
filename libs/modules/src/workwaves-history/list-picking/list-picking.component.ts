import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Router} from "@angular/router";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";

@Component({
  selector: 'list-picking-history',
  templateUrl: './list-picking.component.html',
  styleUrls: ['./list-picking.component.scss']
})
export class ListPickingHistoryComponent implements OnInit {

  pickingsHistory: PickingModel.Picking[];

  constructor(
    private location: Location,
    private router: Router,
    private workwavesService: WorkwavesService,
    private pickingProvider: PickingProvider
  ) {}

  ngOnInit() {
    this.pickingsHistory = this.pickingProvider.listPickingsHistory;
  }

  goPreviousPage() {
    this.location.back();
  }

  showWorkwaveDetail() {
    this.router.navigate(['workwaves-history/detail']);
  }

}
