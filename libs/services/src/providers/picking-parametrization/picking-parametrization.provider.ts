import {Injectable} from "@angular/core";
import {GroupWarehousePickingModel} from "../../models/endpoints/group-warehouse-model";
import {UserTimeModel} from "../../models/endpoints/user-time.model";
import {WorkwaveModel} from "../../models/endpoints/Workwaves";

@Injectable({
  providedIn: 'root'
})
export class PickingParametrizationProvider {

  private _loadingListGroupsWarehouses: boolean = true;
  get loadingListGroupsWarehouses(): boolean {
    return this._loadingListGroupsWarehouses;
  }
  set loadingListGroupsWarehouses(value: boolean) {
    this._loadingListGroupsWarehouses = value;
  }

  private _listGroupsWarehouses: Array<GroupWarehousePickingModel.GroupWarehousePicking> = new Array<GroupWarehousePickingModel.GroupWarehousePicking>();
  get listGroupsWarehouses(): Array<GroupWarehousePickingModel.GroupWarehousePicking> {
    return this._listGroupsWarehouses;
  }
  set listGroupsWarehouses(value: Array<GroupWarehousePickingModel.GroupWarehousePicking>) {
    this._listGroupsWarehouses = value;
  }

  private _loadingListEmployees: boolean = true;
  get loadingListEmployees(): boolean {
    return this._loadingListEmployees;
  }
  set loadingListEmployees(value: boolean) {
    this._loadingListEmployees = value;
  }

  private _listEmployees: UserTimeModel.ListUsersRegisterTimeActiveInactive = {usersActive: [], usersInactive: []};
  get listEmployees(): UserTimeModel.ListUsersRegisterTimeActiveInactive {
    return this._listEmployees;
  }
  set listEmployees(value: UserTimeModel.ListUsersRegisterTimeActiveInactive) {
    this._listEmployees = value;
  }

  private _loadingListRequestOrders: boolean = true;
  get loadingListRequestOrders(): boolean {
    return this._loadingListRequestOrders;
  }
  set loadingListRequestOrders(value: boolean) {
    this._loadingListRequestOrders = value;
  }

  private _listRequestOrders: Array<WorkwaveModel.MatchLineRequest> = new Array<WorkwaveModel.MatchLineRequest>();
  get listRequestOrders(): Array<WorkwaveModel.MatchLineRequest> {
    return this._listRequestOrders;
  }
  set listRequestOrders(value: Array<WorkwaveModel.MatchLineRequest>) {
    this._listRequestOrders = value;
  }

  private _loadingListTeamAssignations: boolean = true;
  get loadingListTeamAssignations(): boolean {
    return this._loadingListTeamAssignations;
  }
  set loadingListTeamAssignations(value: boolean) {
    this._loadingListTeamAssignations = value;
  }

  private _listTeamAssignations: Array<WorkwaveModel.TeamAssignations> = new Array<WorkwaveModel.TeamAssignations>();
  get listTeamAssignations(): Array<WorkwaveModel.TeamAssignations> {
    return this._listTeamAssignations;
  }
  set listTeamAssignations(value: Array<WorkwaveModel.TeamAssignations>) {
    this._listTeamAssignations = value;
  }

}
