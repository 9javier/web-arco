import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'suite-user-assignment-picking',
  templateUrl: './user-assignment-picking.component.html',
  styleUrls: ['./user-assignment-picking.component.scss']
})
export class UserAssignmentPickingComponent implements OnInit {

  public idWorkwave: number = null;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.idWorkwave = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
  }

}
