import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {PickingModel} from "../../../../../services/src/models/endpoints/Picking";
import {PickingProvider} from "../../../../../services/src/providers/picking/picking.provider";
import {PickingService} from "../../../../../services/src/lib/endpoint/picking/picking.service";
import {WorkwavesService} from "../../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Router} from "@angular/router";

@Component({
  selector: 'workwave-list-workwaves-schedule',
  templateUrl: './list-workwave.component.html',
  styleUrls: ['./list-workwave.component.scss']
})
export class WorkwaveListWorkwavesScheduleComponent implements OnInit {

  @Input() workWave: any;

  constructor(
    private router: Router,
    private pickingProvider: PickingProvider,
    private pickingService: PickingService,
    private workwavesService: WorkwavesService
  ) {}

  ngOnInit() {}

  processTitleWorkwave() : string {
    return this.workWave.warehouses.map((warehouse) => {
      return warehouse.warehouse.reference+' '+warehouse.warehouse.name;
    }).join(', ');
  }

  getTypeShippingOrderString(line: number) : string {
    let type = this.workWave.typeShippingOrder;
    if (line == 1) {
      if (type == 1) {
        return "Reposición";
      } else if (type == 2) {
        return "Distribución";
      } else {
        return "Reposición";
      }
    } else {
      if (type == 1 || type == 2) {
        return "";
      } else {
        return "Distribución";
      }
    }
  }

  dateCreatedParsed() : string {
    moment.locale('es');
    return moment(this.workWave.releaseDate).format('ddd, DD/MM/YYYY');
  }

  timeCreatedParsed() : string {
    moment.locale('es');
    return moment(this.workWave.releaseDate).format('LT');
  }

  showPickings(event) {
    this.router.navigate(['workwaves-scheduled/pickings']);
    this.workwavesService.lastWorkwaveEdited = {};

    /*this.workwavesService.lastWorkwaveEdited = this.workWave;
    this.workwavesService.lastWorkwaveHistoryQueried = null;
    this.pickingProvider.listPickingsHistory = null;

    this.pickingService
      .getShow(this.workwavesService.lastWorkwaveEdited.id)
      .subscribe((res: PickingModel.ResponseShow) => {
        if ((res.code == 200 || res.code == 201) && res.data && res.data.length > 0) {
          this.pickingProvider.listPickingsHistory = res.data;
          this.router.navigate(['workwaves-scheduled/pickings']);
        }
      }, error => {
        console.warn("Error Subscribe::Load Pickings for Workwave ", this.workwavesService.lastWorkwaveEdited.id);
      });*/
  }

}
