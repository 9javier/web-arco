import {Component, Input, OnInit} from '@angular/core';
import {TypeUsersProcesses} from "@suite/services";

@Component({
  selector: 'user-assignment-template',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class UserAssignmentTemplateComponent implements OnInit {

  @Input() pickingAssignment: any;
  @Input() listOperators: TypeUsersProcesses.UsersProcesses[] = [];

  constructor() {}

  ngOnInit() {

  }

}
