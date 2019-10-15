import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'sorter-notification-active-process',
  templateUrl: './notification-active-process.component.html',
  styleUrls: ['./notification-active-process.component.scss']
})
export class NotificationActiveProcessSorterComponent implements OnInit {

  @Input() userColorActive: string = null;
  @Input() message: string = null;
  @Input() actionButtonText: string = null;

  @Output() actionLaunched = new EventEmitter();

  constructor() {}
  
  ngOnInit() {}

  launchAction() {
    this.actionLaunched.next();
  }
}
