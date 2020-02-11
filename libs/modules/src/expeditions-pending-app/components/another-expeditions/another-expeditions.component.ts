import {Component, OnInit} from '@angular/core';
import {ReceptionAvelonModel} from "../../../../../services/src/models/endpoints/receptions-avelon.model";
import {DateTimeParserService} from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'another-expeditions',
  templateUrl: './another-expeditions.component.html',
  styleUrls: ['./another-expeditions.component.scss']
})
export class AnotherExpeditionsComponent implements OnInit {

  public anotherExpeditions: ReceptionAvelonModel.Expedition[] = [];

  constructor(
    public dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {

  }

  public loadNewAnotherExpeditionsInfo(newAnotherExpeditionsInfo: ReceptionAvelonModel.Expedition[]) {
    this.anotherExpeditions = newAnotherExpeditionsInfo;
  }
}
