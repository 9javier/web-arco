import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReceptionAvelonModel} from "../../../../../services/src/models/endpoints/receptions-avelon.model";
import {DateTimeParserService} from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";
import {StatesExpeditionAvelonProvider} from "../../../../../services/src/providers/states-expetion-avelon/states-expedition-avelon.provider";

@Component({
  selector: 'another-expeditions',
  templateUrl: './another-expeditions.component.html',
  styleUrls: ['./another-expeditions.component.scss']
})
export class AnotherExpeditionsComponent implements OnInit {

  @Input() anotherExpeditions: ReceptionAvelonModel.Expedition[] = [];
  @Input() expedition: ReceptionAvelonModel.Expedition = null;
  @Input() titleAnotherExpeditions: string = null;
  @Output() receptionExpedition = new EventEmitter();

  constructor(
    public dateTimeParserService: DateTimeParserService,
    private stateExpeditionAvelonProvider: StatesExpeditionAvelonProvider
  ) {}

  ngOnInit() {

  }

  stringStates(states: number[]){
    return this.stateExpeditionAvelonProvider.getStringStates(states);
  }

  reception(expedition) {
    this.receptionExpedition.emit(expedition);
  }
}
