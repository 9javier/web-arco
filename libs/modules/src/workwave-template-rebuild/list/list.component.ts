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
import {Events, ToastController} from "@ionic/angular";

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
  private TYPE_EXECUTION_ID = 1;

  @Input() templateToEdit: any;
  @Input() typeWorkwave: number;
  template: any;
  disableEdition: boolean = false;

  listTypesToUpdate: Array<number> = new Array<number>();
  listGroupsWarehousesToUpdate: Array<GroupWarehousePickingModel.GroupWarehousesSelected> = new Array<GroupWarehousePickingModel.GroupWarehousesSelected>();
  listEmployeesToUpdate: Array<number> = new Array<number>();
  listRequestOrdersToUpdate: Array<number> = new Array<number>();

  constructor(
    private location: Location,
    private events: Events,
    private toastController: ToastController,
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
        this.events.publish(this.GROUPS_WAREHOUSES_LOADED);
        this.pickingParametrizationProvider.loadingListGroupsWarehouses = false;
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
        this.events.publish(this.EMPLOYEES_LOADED);
        this.pickingParametrizationProvider.loadingListEmployees = false;
      }, (error) => {
        console.error('Error::Subscribe:userTimeService::getListUsersRegister::', error);
        this.pickingParametrizationProvider.loadingListEmployees = false;
      });
  }

  private loadRequestOrders() {
    if (this.listTypesToUpdate.length > 0 && this.listGroupsWarehousesToUpdate.length > 0) {
      this.pickingParametrizationProvider.loadingListRequestOrders = true;
      this.workwavesService
        .postMatchLineRequest({
          groupsWarehousePicking: this.listGroupsWarehousesToUpdate,
          typesShippingOrders: this.listTypesToUpdate
        })
        .subscribe((res: Array<WorkwaveModel.MatchLineRequest>) => {
          this.pickingParametrizationProvider.listRequestOrders = res;
          this.events.publish(this.REQUEST_ORDERS_LOADED);
          this.pickingParametrizationProvider.loadingListRequestOrders = false;
        }, (error) => {
          console.error('Error::Subscribe:workwavesService::postMatchLineRequest::', error);
          this.pickingParametrizationProvider.loadingListRequestOrders = false;
        });
    } else {
      this.pickingParametrizationProvider.loadingListRequestOrders = false;
    }
  }

  private loadTeamAssignations() {
    if (this.listEmployeesToUpdate.length > 0 && this.listRequestOrdersToUpdate.length > 0) {
      this.pickingParametrizationProvider.loadingListTeamAssignations = true;
      this.workwavesService
        .postAssignUserToMatchLineRequest({
          requestIds: this.listRequestOrdersToUpdate,
          userIds: this.listEmployeesToUpdate
        })
        .subscribe((res: Array<WorkwaveModel.TeamAssignations>) => {
          this.pickingParametrizationProvider.listTeamAssignations = res;
          this.events.publish(this.TEAM_ASSIGNATIONS_LOADED);
          this.pickingParametrizationProvider.loadingListTeamAssignations = false;
        }, (error) => {
          console.error('Error::Subscribe:workwavesService::postAssignUserToMatchLineRequest::', error);
          this.pickingParametrizationProvider.loadingListTeamAssignations = false;
        });
    } else {
      this.pickingParametrizationProvider.loadingListRequestOrders = false;
    }
  }

  saveWorkWave() {
    this.workwavesService
      .postConfirmMatchLineRequest({
        type: this.TYPE_EXECUTION_ID,
        requestIds: this.listRequestOrdersToUpdate,
        userIds: this.listEmployeesToUpdate,
        groupsWarehousePicking: this.listGroupsWarehousesToUpdate
      })
      .subscribe((res: WorkwaveModel.DataConfirmMatchLineRequest) => {
        this.presentToast("Tareas de picking generadas correctamente", "success");
        this.goPreviousPage();
      }, (error) => {
        console.error('Error::Subscribe:workwavesService::postConfirmMatchLineRequest::', error);
      });
  }

  goPreviousPage () {
    this.location.back();
  }

  // Response from table components
  typeChanged(data) {
    this.listTypesToUpdate = data;
    this.loadRequestOrders();
  }

  groupWarehousesChanged(data) {
    this.listGroupsWarehousesToUpdate = new Array<GroupWarehousePickingModel.GroupWarehousesSelected>(data);
    this.loadRequestOrders();
  }

  employeeChanged(data) {
    this.listEmployeesToUpdate = data;
    this.loadTeamAssignations();
  }

  requestOrderChanged(data) {
    this.listRequestOrdersToUpdate = data;
    this.loadTeamAssignations();
  }

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3750,
      color: color || "primary"
    });
    toast.present();
  }
}
