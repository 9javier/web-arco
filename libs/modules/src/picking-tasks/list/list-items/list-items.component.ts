import {Component, Input, OnInit} from '@angular/core';
import {PickingModel} from "../../../../../services/src/models/endpoints/Picking";
import {PickingProvider} from "../../../../../services/src/providers/picking/picking.provider";

@Component({
  selector: 'picking-task-template',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class PickingTaskTemplateComponent implements OnInit {

  @Input() pickingAssignment: PickingModel.Picking;

  constructor(
    public pickingProvider: PickingProvider
  ) {}

  ngOnInit() {}

  selectPicking() {
    this.pickingProvider.pickingSelectedToStart = this.pickingAssignment;
  }

}
