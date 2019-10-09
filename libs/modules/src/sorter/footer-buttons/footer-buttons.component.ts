import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'sorter-footer-buttons',
  templateUrl: './footer-buttons.component.html',
  styleUrls: ['./footer-buttons.component.scss']
})
export class FooterButtonsSorterComponent implements OnInit {

  @Output() operationCancel = new EventEmitter();
  @Output() operationStart = new EventEmitter();

  constructor() {

  }
  
  ngOnInit() {

  }

  cancelSorterOperation() {
    this.operationCancel.next();
  }

  startSorterOperation() {
    this.operationStart.next();
  }
}