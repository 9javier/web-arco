import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'list-workwave-template',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwaveTemplateComponent implements OnInit {

  constructor(
    private location: Location
  ) {}

  ngOnInit() {

  }

  goPreviousPage () {
    this.location.back();
  }

}
