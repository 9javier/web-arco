import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ReceptionAvelonModel} from "@suite/services";

@Component({
  selector: 'suite-info-header-reception',
  templateUrl: './info-header-reception.component.html',
  styleUrls: ['./info-header-reception.component.scss']
})
export class InfoHeaderReceptionComponent implements OnInit {

  @Output() resetReception = new EventEmitter();

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
  public loadInfoExpedition(expeditionReference: string, provider: ReceptionAvelonModel.Providers) {
    this.expeditionReference = expeditionReference;
    this.provider = provider;
  }
  //endregion
}
