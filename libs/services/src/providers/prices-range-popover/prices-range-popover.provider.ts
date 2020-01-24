import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PricesRangePopoverProvider {

  private _minValue: number = 0;
  get minValue(): number {
    return this._minValue;
  }
  set minValue(minValue: number) {
    this._minValue = minValue;
  }

  private _maxValue: number = 200;
  get maxValue(): number {
    return this._maxValue;
  }
  set maxValue(maxValue: number) {
    this._maxValue = maxValue;
  }

  private _minValueSelected: number = 0;
  get minValueSelected(): number {
    return this._minValueSelected;
  }
  set minValueSelected(minValueSelected: number) {
    this._minValueSelected = minValueSelected;
  }

  private _maxValueSelected: number = 200;
  get maxValueSelected(): number {
    return this._maxValueSelected;
  }
  set maxValueSelected(maxValueSelected: number) {
    this._maxValueSelected = maxValueSelected;
  }
}
