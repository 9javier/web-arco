import {Component, Input, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {
  GroupWarehousePickingModel,
  GroupWarehousePickingService,
  UserTimeModel,
  UserTimeService
} from "@suite/services";
import {PickingParametrizationProvider} from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import {Events} from "@ionic/angular";

@Component({
  selector: 'list-workwave-template-rebuild',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwaveTemplateRebuildComponent implements OnInit {

  private GROUPS_WAREHOUSES_LOADED = "groups-warehouses-loaded";
  private EMPLOYEES_LOADED = "employees-loaded";
  private REQUEST_ORDERS_LOADED = "request-orders-loaded";
  private TEAM_ASSIGNATIONS_LOADED = "team-assignations-loaded";

  @Input() templateToEdit: any;
  @Input() typeWorkwave: number;
  template: any;
  disableEdition: boolean = false;

  constructor(
    private location: Location,
    private events: Events,
    private groupWarehousePickingService: GroupWarehousePickingService,
    private userTimeService: UserTimeService,
    private workwavesService: WorkwavesService,
    private pickingParametrizationProvider: PickingParametrizationProvider,
  ) {}

  ngOnInit() {
    if (this.templateToEdit) {
      if (this.templateToEdit.type == 1) {
        this.disableEdition = true;
      }
      this.template = {
        name: this.templateToEdit.name || 'Ola de trabajo // '+this.templateToEdit.id,
        id: this.templateToEdit.id
      };
    } else {
      this.template = {
        name: 'Nueva Ola de trabajo',
        id: null
      };
    }

    this.loadDefaultWorkWaveData()
  }

  private loadDefaultWorkWaveData() {
    this.loadGroupsWarehouses();
    this.loadEmployees();
    this.loadRequestOrders();
    this.loadTeamAssignations();
  }

  private loadGroupsWarehouses() {
    this.pickingParametrizationProvider.loadingListGroupsWarehouses = true;
    this.groupWarehousePickingService
      .getIndex()
      .subscribe((res: Array<GroupWarehousePickingModel.GroupWarehousePicking>) => {
        this.pickingParametrizationProvider.listGroupsWarehouses = res.filter(groupWarehouse => groupWarehouse.warehouses.length > 0);
        this.pickingParametrizationProvider.loadingListGroupsWarehouses = false;
        this.events.publish(this.GROUPS_WAREHOUSES_LOADED);
      }, (error) => {
        console.error('Error::Subscribe:groupWarehousePickingService::getIndex::', error);
        this.pickingParametrizationProvider.loadingListGroupsWarehouses = false;
      });
  }

  private loadEmployees() {
    this.pickingParametrizationProvider.loadingListEmployees = true;
    this.userTimeService
      .getListUsersRegister()
      .subscribe((res: UserTimeModel.ListUsersRegisterTimeActiveInactive) => {
        this.pickingParametrizationProvider.listEmployees = res;
        this.pickingParametrizationProvider.loadingListEmployees = false;
        this.events.publish(this.EMPLOYEES_LOADED);
      }, (error) => {
        console.error('Error::Subscribe:userTimeService::getListUsersRegister::', error);
        this.pickingParametrizationProvider.loadingListEmployees = false;
      });
  }

  private loadRequestOrders() {
    this.pickingParametrizationProvider.loadingListRequestOrders = true;
    this.workwavesService
      .postMatchLineRequest({
        groupsWarehousePicking: [],
        typesShippingOrders: []
      })
      .subscribe((res: Array<WorkwaveModel.MatchLineRequest>) => {
        this.pickingParametrizationProvider.listRequestOrders = res;
        this.pickingParametrizationProvider.loadingListRequestOrders = false;
        this.events.publish(this.REQUEST_ORDERS_LOADED);
      }, (error) => {
        console.error('Error::Subscribe:workwavesService::postMatchLineRequest::', error);
        this.pickingParametrizationProvider.loadingListRequestOrders = false;
      });
  }

  private loadTeamAssignations() {
    this.pickingParametrizationProvider.loadingListTeamAssignations = true;
    this.workwavesService
      .postAssignUserToMatchLineRequest({
        requestIds: [1, 2],
        userIds: [1, 3, 4]
      })
      .subscribe((res: Array<WorkwaveModel.TeamAssignations>) => {
        this.pickingParametrizationProvider.listTeamAssignations = res;
        this.pickingParametrizationProvider.loadingListTeamAssignations = false;
        this.events.publish(this.TEAM_ASSIGNATIONS_LOADED);
      }, (error) => {
        console.error('Error::Subscribe:workwavesService::postAssignUserToMatchLineRequest::', error);
        this.pickingParametrizationProvider.loadingListTeamAssignations = false;
      });
  }

  saveWorkWave() {
    return null;
  }

  goPreviousPage () {
    this.location.back();
  }

}
