import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReceptionAvelonModel} from "../../../../../services/src/models/endpoints/receptions-avelon.model";
import {DateTimeParserService} from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";
import Expedition = ReceptionAvelonModel.Expedition;
import {StatesExpeditionAvelonProvider} from "../../../../../services/src/providers/states-expetion-avelon/states-expedition-avelon.provider";

@Component({
  selector: 'expedition-info',
  templateUrl: './expedition-info.component.html',
  styleUrls: ['./expedition-info.component.scss']
})
export class ExpeditionInfoComponent implements OnInit {

  @Input() expedition: ReceptionAvelonModel.Expedition = null;
  @Output() receptionExpedition: EventEmitter<any> = new EventEmitter();

  constructor(
    public dateTimeParserService: DateTimeParserService,
    private stateExpeditionAvelonProvider: StatesExpeditionAvelonProvider
  ) {}

  ngOnInit() {}

  stringStates(states: number[]){
    return this.stateExpeditionAvelonProvider.getStringStates(states);
  }

  public reception(expedition) {
    this.receptionExpedition.emit(expedition);
  }
}
