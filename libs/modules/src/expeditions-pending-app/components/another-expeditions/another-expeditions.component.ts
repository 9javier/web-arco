import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReceptionAvelonModel} from "../../../../../services/src/models/endpoints/receptions-avelon.model";
import {DateTimeParserService} from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";

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
    public dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {

  }

  stringStates(expedition: ReceptionAvelonModel.Expedition){
    const stringStates: string[] = [];
    for(let state of expedition.states_list){
      if(state == 1){
        stringStates.push('Bloqueado');
      }else{
        stringStates.push('Desconocido');
      }
    }
    return stringStates.join(', ');
  }

  reception(expedition) {
    this.receptionExpedition.emit(expedition);
  }
}
