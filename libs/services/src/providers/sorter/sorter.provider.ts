import {Injectable} from "@angular/core";
import {ColorSorterModel} from "../../models/endpoints/ColorSorter";

@Injectable({
  providedIn: 'root'
})
export class SorterProvider {

  private _colorSelected: ColorSorterModel.ColorSorter;
  get colorSelected(): ColorSorterModel.ColorSorter {
    return this._colorSelected;
  }
  set colorSelected(value: ColorSorterModel.ColorSorter) {
    this._colorSelected = value;
  }
}
