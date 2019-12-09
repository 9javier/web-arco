import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class FiltersAuditProvider {

  private _filter: number = 0;
  get filter(): number {
    return this._filter;
  }
  set filter(filter: number) {
    this._filter = filter;
  }

  private _sort: { value: number, type: string } = null;
  get sort(): { value: number; type: string } {
    return this._sort;
  }
  set sort(value: { value: number; type: string }) {
    this._sort = value;
  }
}
