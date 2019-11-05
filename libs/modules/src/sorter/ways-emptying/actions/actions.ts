import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'suite-sorter-actions-emptying',
  templateUrl: './actions.html',
  styleUrls: ['./actions.scss']
})
export class SorterActionsEmptyingComponent implements OnInit, OnDestroy {

  @Input() height: string = null;
  @Input() width: string = null;
  @Input() disableAuto: boolean = false;
  @Input() disableManual: boolean = false;
  @Output() autoEmptying = new EventEmitter();
  @Output() manualEmptying = new EventEmitter();
  @Output() saveChanges = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  public emptyAuto() {
    this.autoEmptying.next();
  }

  public emptyManual() {
    this.manualEmptying.next();
  }

  public save() {
    this.saveChanges.next();
  }
}
