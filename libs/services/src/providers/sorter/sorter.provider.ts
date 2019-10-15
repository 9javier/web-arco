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

  private _idZoneSelected: number;
  get idZoneSelected(): number {
    return this._idZoneSelected;
  }
  set idZoneSelected(value: number) {
    this._idZoneSelected = value;
  }

  private _idTemplateSelected: number;
  get idTemplateSelected(): number {
    return this._idTemplateSelected;
  }
  set idTemplateSelected(value: number) {
    this._idTemplateSelected = value;
  }

  private _colorActiveForUser: string;
  get colorActiveForUser(): string {
    return this._colorActiveForUser;
  }
  set colorActiveForUser(value: string) {
    this._colorActiveForUser = value;
  }
}
