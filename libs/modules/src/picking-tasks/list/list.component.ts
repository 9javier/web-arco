import {Component, OnInit} from '@angular/core';
import {TypeUsersProcesses, UserProcessesService} from "@suite/services";
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {PickingService} from "../../../../services/src/lib/endpoint/picking/picking.service";
import {AlertController} from "@ionic/angular";
import {ScanditService} from "../../../../services/src/lib/scandit/scandit.service";

@Component({
  selector: 'list-picking-tasks-template',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListPickingTasksTemplateComponent implements OnInit {

  private pickingId: number = 1;
  public pickingAssignments: PickingModel.Picking[] = [];

  constructor(
    private pickingService: PickingService,
    private scanditService: ScanditService
  ) {}

  ngOnInit() {
    /*
    * TODO enable this to use endpoint data
    this.pickingService
      .getShow(this.pickingId)
      .subscribe((res: PickingModel.ResponseShow) => {
        if (res.code == 200 || res.code == 201) {
          this.pickingAssignments = res.data;
        } else {

        }
      }, (error: PickingModel.ErrorResponse) => {

      });
    */

    // TODO remove this when enable endpoint data
    this.pickingAssignments = [
      {
        store: 'KRACK Vigo',
        storeRef: '001',
        typeId: 1,
        type: 'Dcto.',
        quantity: 300,
        threshold: 450
      },
      {
        store: 'KRACK Pontevedra',
        storeRef: '002',
        typeId: 1,
        type: 'Dcto.',
        quantity: 350,
        threshold: 500
      },
      {
        store: 'KRACK Lugo',
        storeRef: '003',
        typeId: 2,
        type: 'Cdo.',
        quantity: 250,
        threshold: 500
      }
    ];
  }

  initPicking() {
    this.scanditService.picking();
  }

}
