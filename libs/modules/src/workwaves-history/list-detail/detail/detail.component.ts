import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'detail-history',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailHistoryComponent implements OnInit {

  @Input() warehouseWorkwaveHistory: any;

  constructor() {}

  ngOnInit() {

  }

}
