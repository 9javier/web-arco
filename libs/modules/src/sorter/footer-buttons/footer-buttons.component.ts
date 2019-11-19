import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sorter-footer-buttons',
  templateUrl: './footer-buttons.component.html',
  styleUrls: ['./footer-buttons.component.scss']
})
export class FooterButtonsSorterComponent implements OnInit {

  @Input() overNotification: boolean = false;
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
