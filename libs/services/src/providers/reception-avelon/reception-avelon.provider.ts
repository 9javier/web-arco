import {Injectable} from "@angular/core";

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
}

interface ExpeditionData {
  reference: string,
  providerId: number
}
