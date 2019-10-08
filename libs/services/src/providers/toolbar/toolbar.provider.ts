import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {ActionToolbarModel} from "../../models/endpoints/ActionToolbar";

@Injectable({
  providedIn: 'root'
})
export class ToolbarProvider {

  private _currentPage: Subject<string> = new Subject();
  get currentPage(): Subject<string> {
    return this._currentPage;
  }

  private _showAlMenu: Subject<boolean> = new Subject();
  get showAlMenu(): Subject<boolean> {
    return this._showAlMenu;
  }

  private _optionsActions: Subject<ActionToolbarModel.ActionToolbar[]> = new Subject();
  get optionsActions(): Subject<ActionToolbarModel.ActionToolbar[]> {
    return this._optionsActions;
  }

  private _currentOptionsActions: ActionToolbarModel.ActionToolbar[] = [];
  get currentOptionsActions(): ActionToolbarModel.ActionToolbar[] {
    return this._currentOptionsActions;
  }
  set currentOptionsActions(value: ActionToolbarModel.ActionToolbar[]) {
    this._currentOptionsActions = value;
  }
}
