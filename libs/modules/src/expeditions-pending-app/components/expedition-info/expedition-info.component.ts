import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'expedition-info',
  templateUrl: './expedition-info.component.html',
  styleUrls: ['./expedition-info.component.scss']
})
export class ExpeditionInfoComponent implements OnInit {

  @Output() receptionExpedition: EventEmitter<any> = new EventEmitter();

  public expedition: ExpeditionInfo = null;

  constructor() {}

  ngOnInit() {

  }

  public loadNewExpeditionInfo(newExpeditionInfo: ExpeditionInfo) {
    this.expedition = newExpeditionInfo;
  }

  public reception() {
    this.receptionExpedition.next();
  }
}

export interface ExpeditionInfo {
  code: string,
  provider: string,
  total_packing: number,
  delivery_date: string,
  shipper: string,
  status_list: string[],
  reception_enabled: boolean
}
