import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {PickingModel} from "../../../services/src/models/endpoints/Picking";
import {WorkwavesService} from "../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Router} from "@angular/router";
import {PickingProvider} from "../../../services/src/providers/picking/picking.provider";

@Component({
  selector: 'list-picking',
  templateUrl: './list-picking.component.html',
  styleUrls: ['./list-picking.component.scss']
})
export class ListPickingComponent implements OnInit {

  public pickingsHistory: PickingModel.Picking[];
  public previousPage: string = '';
  public showButtonDetails: boolean = false;

  constructor(
    private location: Location,
    private router: Router,
    private workwavesService: WorkwavesService,
    private pickingProvider: PickingProvider
  ) {}

  ngOnInit() {
    this.pickingsHistory = this.pickingProvider.listPickingsHistory;

    if (this.workwavesService.lastWorkwaveEdited) {
      this.previousPage = 'Olas de Trabajo Programadas';
      this.showButtonDetails = false;
    } else if (this.workwavesService.lastWorkwaveHistoryQueried) {
      this.previousPage = 'Historial';
      this.showButtonDetails = true;
    }
  }

  goPreviousPage() {
    this.location.back();
  }

  // Only to show details of a workwave from history
  showWorkwaveHistoryDetail() {
    this.router.navigate(['workwaves-history/detail']);
  }

}
