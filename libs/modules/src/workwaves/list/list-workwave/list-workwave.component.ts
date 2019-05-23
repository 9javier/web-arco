import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'workwave-list-workwaves',
  templateUrl: './list-workwave.component.html',
  styleUrls: ['./list-workwave.component.scss']
})
export class WorkwaveListWorkwavesComponent implements OnInit {

  @Input() workwave: any;

  checked: boolean = false;

  constructor() {}

  ngOnInit() {}

}
