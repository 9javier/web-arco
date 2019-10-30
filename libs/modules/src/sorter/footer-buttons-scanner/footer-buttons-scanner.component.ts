import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'sorter-footer-buttons-scanner',
  templateUrl: './footer-buttons-scanner.component.html',
  styleUrls: ['./footer-buttons-scanner.component.scss']
})
export class FooterButtonsScannerSorterComponent implements OnInit {

  @Input() leftButton: string;
  @Input() rightButton: string;
  @Input() leftButtonDanger: boolean = false;
  @Input() leftButtonDisabled: boolean = false;
  @Input() rightButtonDisabled: boolean = false;
  @Output() leftButtonAction = new EventEmitter();
  @Output() rightButtonAction = new EventEmitter();

  constructor() {

  }
  
  ngOnInit() {

  }

  clickLeftButton() {
    this.leftButtonAction.next();
  }

  clickRightButton() {
    this.rightButtonAction.next();
  }
}
