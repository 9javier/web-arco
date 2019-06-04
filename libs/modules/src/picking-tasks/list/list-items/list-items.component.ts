import {Component, Input, OnInit} from '@angular/core';
import {TypeUsersProcesses} from "@suite/services";

@Component({
  selector: 'picking-task-template',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class PickingTaskTemplateComponent implements OnInit {

  @Input() pickingAssignment: any;

  constructor() {}

  ngOnInit() {

  }

}
