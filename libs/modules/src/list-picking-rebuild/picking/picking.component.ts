import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";

@Component({
  selector: 'picking',
  templateUrl: './picking.component.html',
  styleUrls: ['./picking.component.scss']
})
export class PickingComponent implements OnInit {

  @Input() picking: PickingModel.PendingPickingByWorkWaveSelected;
  @Output() pickingSelection = new EventEmitter();

  public STATUS_PICKING_INITIATED: number = 2;

  constructor(
    public pickingProvider: PickingProvider
  ) {}

  ngOnInit() {}

  selectPicking() {
    this.pickingSelection.next({id: this.picking.id, value: this.picking.selected, delete: this.picking.status != this.STATUS_PICKING_INITIATED});
  }

  getPickingStatusText(): string {
    switch (this.picking.status) {
      case 1:
        return 'Creado';
      case 2:
        return 'Iniciado';
      case 3:
        return 'Finalizado';
      case 4:
        return 'Pendiente';
      case 5:
        return 'Temporal';
      default:
        return 'error';
    }
  }

}
