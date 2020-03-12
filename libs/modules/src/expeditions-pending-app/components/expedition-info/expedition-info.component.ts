import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReceptionAvelonModel} from "../../../../../services/src/models/endpoints/receptions-avelon.model";
import {DateTimeParserService} from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";
import Expedition = ReceptionAvelonModel.Expedition;

@Component({
  selector: 'expedition-info',
  templateUrl: './expedition-info.component.html',
  styleUrls: ['./expedition-info.component.scss']
})
export class ExpeditionInfoComponent implements OnInit {

  @Input() expedition: ReceptionAvelonModel.Expedition = null;
  @Output() receptionExpedition: EventEmitter<any> = new EventEmitter();

  constructor(
    public dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {}

  stringStates(states: number[]){
    const stringStates: string[] = [];
    for(let state of states){
      if(state == 1){
        stringStates.push('Bloqueado');
      }else{
        stringStates.push('Desconocido');
      }
    }
    return stringStates.join(', ');
  }

  public reception(expedition) {
    this.receptionExpedition.emit(expedition);
  }
}
