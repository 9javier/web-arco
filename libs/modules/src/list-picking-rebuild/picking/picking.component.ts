import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";

@Component({
  selector: 'picking',
  templateUrl: './picking.component.html',
  styleUrls: ['./picking.component.scss']
})
export class PickingComponent implements OnInit {

  @Input() picking: any;
  // @Input() picking: PickingModel.Picking;
  @Output() pickingSelection = new EventEmitter();

  constructor(
    public pickingProvider: PickingProvider
  ) {}

  ngOnInit() {}

  selectPicking() {
    this.pickingSelection.next({id: this.picking.id, value: this.picking.selected});
  }

}
