import {Component, Input, OnInit} from '@angular/core';
import {PickingModel} from "../../../../../services/src/models/endpoints/Picking";

@Component({
  selector: 'picking-task-template',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class PickingTaskTemplateComponent implements OnInit {

  @Input() pickingAssignment: PickingModel.Picking;

  constructor() {}

  ngOnInit() {

  }

}
