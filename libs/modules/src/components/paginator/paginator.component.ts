import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'suite-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

  @Input() pagerValues: any[];

  constructor() { }

  ngOnInit() {
  }

}
