import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {PickingModel} from "../../../services/src/models/endpoints/Picking";
import {WorkwavesService} from "../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Router} from "@angular/router";
import {PickingProvider} from "../../../services/src/providers/picking/picking.provider";

@Component({
  selector: 'list-picking-rebuild',
  templateUrl: './list-picking-rebuild.component.html',
  styleUrls: ['./list-picking-rebuild.component.scss']
})
export class ListPickingRebuildComponent implements OnInit {

  public listPickings: any[] = [];
  // public listPickings: PickingModel.Picking[];
  public previousPage: string = '';
  public usersNoSelected: boolean = true;
  private listIdsPickingsSelected: Array<number> = new Array<number>();

  constructor(
    private location: Location,
    private router: Router,
    private workwavesService: WorkwavesService,
    private pickingProvider: PickingProvider
  ) {}

  ngOnInit() {
    // this.pickingsHistory = this.pickingProvider.listPickingsHistory;
    for (let i = 0; i < 48; i++) {
      this.listPickings.push({id: i, value: false});
    }

    if (this.workwavesService.lastWorkwaveEdited) {
      this.previousPage = 'Olas de Trabajo';
    } else if (this.workwavesService.lastWorkwaveHistoryQueried) {
      this.previousPage = 'Historial';
    }
  }

  goPreviousPage() {
    this.location.back();
  }

  changeUser() {

  }

  pickingSelected(data) {
    if (data.value) {
      this.listIdsPickingsSelected.push(data.id);
      this.usersNoSelected = false;
    } else {
      this.listIdsPickingsSelected = this.listIdsPickingsSelected.filter((id) => id != data.id);
      if (this.listIdsPickingsSelected.length < 1) {
        this.usersNoSelected = true;
      }
    }
  }

}
