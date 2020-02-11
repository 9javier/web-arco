import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ReceptionAvelonModel} from "../../../../../services/src/models/endpoints/receptions-avelon.model";
import {DateTimeParserService} from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'expedition-info',
  templateUrl: './expedition-info.component.html',
  styleUrls: ['./expedition-info.component.scss']
})
export class ExpeditionInfoComponent implements OnInit {

  @Output() receptionExpedition: EventEmitter<any> = new EventEmitter();

  public expedition: ReceptionAvelonModel.Expedition = null;
  public expeditionNumber: string = null;
  public providerName: string = null;

  constructor(
    public dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {

  }

  public loadNewExpeditionInfo(newExpeditionNumber: string, newProviderName: string, newExpeditionInfo: ReceptionAvelonModel.Expedition) {
    this.expedition = newExpeditionInfo;
    this.expeditionNumber = newExpeditionNumber;
    this.providerName = newProviderName;
  }

  public reception() {
    this.receptionExpedition.next();
  }
}
