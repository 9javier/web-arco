import {Injectable} from "@angular/core";
import {GroupWarehousePickingModel} from "../../models/endpoints/group-warehouse-model";
import {UserTimeModel} from "../../models/endpoints/user-time.model";
import {WorkwaveModel} from "../../models/endpoints/Workwaves";

@Injectable({
  providedIn: 'root'
})
export class PickingParametrizationProvider {

  private _loadingListGroupsWarehouses: number = 0;
  get loadingListGroupsWarehouses(): number {
    return this._loadingListGroupsWarehouses;
  }
  set loadingListGroupsWarehouses(value: number) {
    if (value < 0) {
      value = 0;
    }
    this._loadingListGroupsWarehouses = value;
  }

  private _listGroupsWarehouses: Array<GroupWarehousePickingModel.GroupWarehousePicking> = new Array<GroupWarehousePickingModel.GroupWarehousePicking>();
  get listGroupsWarehouses(): Array<GroupWarehousePickingModel.GroupWarehousePicking> {
    return this._listGroupsWarehouses;
  }
  set listGroupsWarehouses(value: Array<GroupWarehousePickingModel.GroupWarehousePicking>) {
    this._listGroupsWarehouses = value;
  }

  private _loadingListEmployees: number = 0;
  get loadingListEmployees(): number {
    return this._loadingListEmployees;
  }
  set loadingListEmployees(value: number) {
    if (value < 0) {
      value = 0;
    }
    this._loadingListEmployees = value;
  }

  private _listEmployees: UserTimeModel.ListUsersRegisterTimeActiveInactive = {usersActive: [], usersInactive: []};
  get listEmployees(): UserTimeModel.ListUsersRegisterTimeActiveInactive {
    return this._listEmployees;
  }
  set listEmployees(value: UserTimeModel.ListUsersRegisterTimeActiveInactive) {
    this._listEmployees = value;
  }

  private _loadingListRequestOrders: number = 0;
  get loadingListRequestOrders(): number {
    return this._loadingListRequestOrders;
  }
  set loadingListRequestOrders(value: number) {
    if (value < 0) {
      value = 0;
    }
    this._loadingListRequestOrders = value;
  }

  private _listRequestOrders: Array<WorkwaveModel.MatchLineRequest> = new Array<WorkwaveModel.MatchLineRequest>();
  get listRequestOrders(): Array<WorkwaveModel.MatchLineRequest> {
    return this._listRequestOrders;
  }
  set listRequestOrders(value: Array<WorkwaveModel.MatchLineRequest>) {
    this._listRequestOrders = value;
  }

  private _loadingListTeamAssignations: number = 0;
  get loadingListTeamAssignations(): number {
    return this._loadingListTeamAssignations;
  }
  set loadingListTeamAssignations(value: number) {
    if (value < 0) {
      value = 0;
    }
    this._loadingListTeamAssignations = value;
  }

  private _listTeamAssignations: Array<WorkwaveModel.TeamAssignations> = new Array<WorkwaveModel.TeamAssignations>();
  get listTeamAssignations(): Array<WorkwaveModel.TeamAssignations> {
    return this._listTeamAssignations;
  }
  set listTeamAssignations(value: Array<WorkwaveModel.TeamAssignations>) {
    this._listTeamAssignations = value;
  }


  // Online-Stores section

  private _listRequestOrdersOnlineStore: WorkwaveModel.MatchLineRequestOnlineStore[] = [];
  get listRequestOrdersOnlineStore(): WorkwaveModel.MatchLineRequestOnlineStore[] {
    return this._listRequestOrdersOnlineStore;
  }
  set listRequestOrdersOnlineStore(value: WorkwaveModel.MatchLineRequestOnlineStore[]) {
    this._listRequestOrdersOnlineStore = value;
  }

  private _loadingListRequestOrdersOnlineStore: number = 0;
  get loadingListRequestOrdersOnlineStore(): number {
    return this._loadingListRequestOrdersOnlineStore;
  }
  set loadingListRequestOrdersOnlineStore(value: number) {
    if (value < 0) {
      value = 0;
    }
    this._loadingListRequestOrdersOnlineStore = value;
  }

}
