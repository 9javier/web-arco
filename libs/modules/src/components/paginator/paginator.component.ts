import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'suite-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PaginatorComponent implements OnInit {

  @Input() pagerValues: any[];

  constructor() { }

  ngOnInit() {
  }

}
