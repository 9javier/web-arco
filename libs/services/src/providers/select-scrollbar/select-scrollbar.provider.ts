import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SelectScrollbarProvider {

  private _title: string = '';
  get title(): string {
    return this._title;
  }
  set title(title: string) {
    this._title = title;
  }

  private _listItems: Array<any> = new Array<any>();
  get listItems(): Array<any> {
    return this._listItems;
  }
  set listItems(value: Array<any>) {
    this._listItems = value;
  }

  private _filterType: string = '';
  get filterType(): string {
    return this._filterType;
  }
  set filterType(value: string) {
    this._filterType = value;
  }

  private _allDefectType: Array<any> = new Array<any>();
  get allDefectType(): Array<any> {
    return this._allDefectType;
  }
  set allDefectType(value: Array<any>) {
    this._allDefectType = value;
  }

}
