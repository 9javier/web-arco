import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ReceptionAvelonModel} from "@suite/services";
import {parseDate} from "@ionic/core/dist/types/components/datetime/datetime-util";
import {DateTimeParserService} from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'suite-info-header-reception',
  templateUrl: './info-header-reception.component.html',
  styleUrls: ['./info-header-reception.component.scss']
})
export class InfoHeaderReceptionComponent implements OnInit {

  @Output() resetReception = new EventEmitter();

  packingsPallets: {packings: number, pallets: number};
  date: string;
  shipper: string;
  states: string;

  private _expeditionReference: string;
  get expeditionReference(): string {
    return this._expeditionReference;
  }
  set expeditionReference(value: string) {
    this._expeditionReference = value;
  }

  private _provider: ReceptionAvelonModel.Providers;
  get provider(): ReceptionAvelonModel.Providers {
    return this._provider;
  }
  set provider(value: ReceptionAvelonModel.Providers) {
    this._provider = value;
  }

  constructor() { }

  ngOnInit() {}

  //region PUBLIC METHODS FOR VIEW
  public resetReceptionProcess() {
    this.resetReception.emit();
  }
  //endregion

  //region PUBLIC METHODS FOR USE FROM ANOTHER COMPONENTS/PAGES
  public loadInfoExpedition(expeditionReference: string, provider: ReceptionAvelonModel.Providers, packingsPallets, date, shipper, states) {
    this.expeditionReference = expeditionReference;
    this.provider = provider;
    this.packingsPallets = packingsPallets;
    this.date = new DateTimeParserService().date(date);
    this.shipper = shipper;
    this.states = this.stringStates(states);
  }
  //endregion

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
}
