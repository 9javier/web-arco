import {Injectable} from "@angular/core";
import {ReceptionAvelonModel} from "@suite/services";
import Expedition = ReceptionAvelonModel.Expedition;

@Injectable({
  providedIn: 'root'
})
export class ReceptionAvelonProvider {

  private _expeditionData: ExpeditionData = null;
  get expeditionData(): ExpeditionData {
    return this._expeditionData;
  }
  set expeditionData(value: ExpeditionData) {
    this._expeditionData = value;
  }

  private _expedition: Expedition = null;
  get expedition(): Expedition {
    return this._expedition;
  }
  set expedition(value: Expedition) {
    this._expedition = value;
  }

  private _deliveryNote: string = null;
  get deliveryNote(): string {
    return this._deliveryNote;
  }
  set deliveryNote(value: string) {
    this._deliveryNote = value;
  }
}

interface ExpeditionData {
  reference: string,
  providerId: number
}
