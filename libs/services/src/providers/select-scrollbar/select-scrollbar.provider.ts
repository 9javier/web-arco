import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SelectScrollbarProvider {

  private _allOptions: Array<any> = new Array<any>();
  get allOptions(): Array<any> {
    return this._allOptions;
  }
  set allOptions(value: Array<any>) {
    this._allOptions = value;
  }

}
