import {Injectable} from "@angular/core";
import {ColorSorterModel} from "../../models/endpoints/ColorSorter";
import {TemplateSorterModel} from "../../models/endpoints/TemplateSorter";
import {OutputSorterModel} from "../../models/endpoints/OutputSorter";

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

  private _processActiveForUser: number;
  get processActiveForUser(): number {
    return this._processActiveForUser;
  }
  set processActiveForUser(value: number) {
    this._processActiveForUser = value;
  }

  private _templateToEditSelected: TemplateSorterModel.Template;
  get templateToEditSelected(): TemplateSorterModel.Template {
    return this._templateToEditSelected;
  }
  set templateToEditSelected(value: TemplateSorterModel.Template) {
    this._templateToEditSelected = value;
  }

  private _infoSorterOutputOperation: OutputSorterModel.OutputSorter;
  get infoSorterOutputOperation(): OutputSorterModel.OutputSorter {
    return this._infoSorterOutputOperation;
  }
  set infoSorterOutputOperation(value: OutputSorterModel.OutputSorter) {
    this._infoSorterOutputOperation = value;
  }
}
