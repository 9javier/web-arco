import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'workwave-list-workwaves-schedule',
  templateUrl: './list-workwave.component.html',
  styleUrls: ['./list-workwave.component.scss']
})
export class WorkwaveListWorkwavesScheduleComponent implements OnInit {

  @Input() workwave: any;

  checked: boolean = false;

  constructor() {}

  ngOnInit() {}

}
