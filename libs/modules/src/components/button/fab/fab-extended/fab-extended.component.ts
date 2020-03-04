import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'fab-extended',
  templateUrl: './fab-extended.component.html',
  styleUrls: ['./fab-extended.component.scss']
})
export class FabExtendedComponent implements OnInit {

  @Input() label: string = null;
  @Input() icon: string = null;
  @Input() tooltip: string = null;
  @Output() clickButton = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  public clickFab(event) {
    this.clickButton.next(event);
  }
}
