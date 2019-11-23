import {Component, Input, OnInit, ViewChild} from '@angular/core';
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
import {AlertController, Events, LoadingController, ToastController} from "@ionic/angular";
import {TableTypesOSComponent} from "../table-types/table-types.component";
import {TableRequestsOrdersOSComponent} from "../table-requests-orders/table-requests-orders.component";

@Component({
  selector: 'list-workwave-template-online-store',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwaveTemplateRebuildOSComponent implements OnInit {

  private GROUPS_WAREHOUSES_LOADED = "groups-warehouses-loaded-os";
  private EMPLOYEES_LOADED = "employees-loaded-os";
  private REQUEST_ORDERS_LOADED = "request-orders-loaded-os";
  private TEAM_ASSIGNATIONS_LOADED = "team-assignations-loaded-os";
  private DRAW_CONSOLIDATED_MATCHES = "draw-consolidated-matches-os";
  private TYPE_EXECUTION_ID = 1;

  @Input() typeWorkwave: number;
  @ViewChild(TableTypesOSComponent) tableTypes: TableTypesOSComponent;
  @ViewChild(TableRequestsOrdersOSComponent) tableRequests: TableRequestsOrdersOSComponent;

  template: any;
  disableEdition: boolean = false;

  listTypesToUpdate: Array<number> = new Array<number>();
  listGroupsWarehousesToUpdate: Array<GroupWarehousePickingModel.GroupWarehousesSelected> = new Array<GroupWarehousePickingModel.GroupWarehousesSelected>();
  listEmployeesToUpdate: Array<number> = new Array<number>();
  listRequestOrdersToUpdate: Array<number> = new Array<number>();
  private listWarehousesThresholdAndSelectedQty: any = {};
  private checkRequestsSelectedIsOverThreshold: boolean = false;

  private loading: HTMLIonLoadingElement = null;

  constructor(
    private location: Location,
    private events: Events,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private groupWarehousePickingService: GroupWarehousePickingService,
    private userTimeService: UserTimeService,
    private workwavesService: WorkwavesService,
    private pickingParametrizationProvider: PickingParametrizationProvider,
  ) {}

  ngOnInit() {
    this.pickingParametrizationProvider.loadingListEmployees = 0;
    this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore = 0;
    this.tableRequests.loadingListRequestOrdersOnlineStore = 0;
    console.log('Test::loading 1', this.tableRequests.loadingListRequestOrdersOnlineStore);
    this.pickingParametrizationProvider.loadingListTeamAssignations = 0;
    this.template = {
      name: 'Nueva Ola de trabajo',
      id: null
    };
    // this.tableTypes.loadListTypes([{name: 'Online', value: 20, selected: true}, {name: 'Peticiones tienda', value: 30, selected: true}], true);
    this.loadDefaultWorkWaveData()
  }

  private loadDefaultWorkWaveData() {
    this.pickingParametrizationProvider.loadingListEmployees++;
    this.loadEmployees();
    this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore++;
    this.tableRequests.loadingListRequestOrdersOnlineStore++;
    console.log('Test::loading 2', this.tableRequests.loadingListRequestOrdersOnlineStore);
    this.loadRequestOrders();
    this.pickingParametrizationProvider.loadingListTeamAssignations++;
    this.loadTeamAssignations();
  }

  private loadEmployees() {
    this.userTimeService
      .getListUsersRegister()
      .subscribe((res: UserTimeModel.ListUsersRegisterTimeActiveInactive) => {
        this.pickingParametrizationProvider.listEmployees = res;
        this.events.publish(this.EMPLOYEES_LOADED);
        this.pickingParametrizationProvider.loadingListEmployees--;
      }, (error) => {
        console.error('Error::Subscribe:userTimeService::getListUsersRegister::', error);
        this.pickingParametrizationProvider.listEmployees = {usersActive: [], usersInactive: []};
        this.events.publish(this.EMPLOYEES_LOADED);
        this.pickingParametrizationProvider.loadingListEmployees--;
      });
  }

  private loadRequestOrders() {
    this.pickingParametrizationProvider.loadingListTeamAssignations++;
    if (this.listTypesToUpdate.length > 0) {
      this.workwavesService
        .postMatchLineRequestOnlineStore({
          preparationLinesTypes: this.listTypesToUpdate
        })
        .then((res: WorkwaveModel.ResponseMatchLineRequestOnlineStore) => {
          if (res.code == 201) {
            this.pickingParametrizationProvider.listRequestOrdersOnlineStore = res.data;
            this.events.publish(this.REQUEST_ORDERS_LOADED);
            this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore--;
            this.tableRequests.loadingListRequestOrdersOnlineStore--;
            console.log('Test::loading 3', this.tableRequests.loadingListRequestOrdersOnlineStore);
            this.pickingParametrizationProvider.loadingListTeamAssignations--;
          } else {
            console.error('Error::Subscribe:workwavesService::postMatchLineRequest::', res);
            this.pickingParametrizationProvider.listRequestOrdersOnlineStore = [];
            this.events.publish(this.REQUEST_ORDERS_LOADED);
            this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore--;
            this.tableRequests.loadingListRequestOrdersOnlineStore--;
            console.log('Test::loading 4', this.tableRequests.loadingListRequestOrdersOnlineStore);
            this.pickingParametrizationProvider.loadingListTeamAssignations--;
          }
        }, (error) => {
          console.error('Error::Subscribe:workwavesService::postMatchLineRequest::', error);
          this.pickingParametrizationProvider.listRequestOrdersOnlineStore = [];
          this.events.publish(this.REQUEST_ORDERS_LOADED);
          this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore--;
          this.tableRequests.loadingListRequestOrdersOnlineStore--;
          console.log('Test::loading 5', this.tableRequests.loadingListRequestOrdersOnlineStore);
          this.pickingParametrizationProvider.loadingListTeamAssignations--;
        })
        .catch((error) => {
          console.error('Error::Subscribe:workwavesService::postMatchLineRequest::', error);
          this.pickingParametrizationProvider.listRequestOrdersOnlineStore = [];
          this.events.publish(this.REQUEST_ORDERS_LOADED);
          this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore--;
          this.tableRequests.loadingListRequestOrdersOnlineStore--;
          console.log('Test::loading 6', this.tableRequests.loadingListRequestOrdersOnlineStore);
          this.pickingParametrizationProvider.loadingListTeamAssignations--;
        });
    } else {
      this.pickingParametrizationProvider.listRequestOrdersOnlineStore = [];
      this.events.publish(this.REQUEST_ORDERS_LOADED);
      this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore--;
      this.tableRequests.loadingListRequestOrdersOnlineStore--;
      console.log('Test::loading 7', this.tableRequests.loadingListRequestOrdersOnlineStore);
      this.pickingParametrizationProvider.loadingListTeamAssignations--;
    }
  }

  private loadTeamAssignations() {
    if (this.listEmployeesToUpdate.length > 0 && this.listRequestOrdersToUpdate.length > 0) {
      this.workwavesService
        .postAssignUserToMatchLineOnlineStoreRequest({
          requestIds: this.listRequestOrdersToUpdate,
          userIds: this.listEmployeesToUpdate
        })
        .then((res: WorkwaveModel.ResponseAssignUserToMatchLineRequestOnlineStore) => {
          if (res.code == 201) {
            let resData = res.data;
            this.pickingParametrizationProvider.listTeamAssignations = resData.assignations;
            this.events.publish(this.TEAM_ASSIGNATIONS_LOADED);
            if (resData.quantities) {
              this.events.publish(this.DRAW_CONSOLIDATED_MATCHES, resData.quantities);
            }
            this.pickingParametrizationProvider.loadingListTeamAssignations--;
          } else {
            console.error('Error::Subscribe:workwavesService::postAssignUserToMatchLineRequest::', res);
            this.pickingParametrizationProvider.listTeamAssignations = new Array<WorkwaveModel.TeamAssignations>();
            this.events.publish(this.TEAM_ASSIGNATIONS_LOADED);
            this.pickingParametrizationProvider.loadingListTeamAssignations--;
          }
        }, (error) => {
          console.error('Error::Subscribe:workwavesService::postAssignUserToMatchLineRequest::', error);
          this.pickingParametrizationProvider.listTeamAssignations = new Array<WorkwaveModel.TeamAssignations>();
          this.events.publish(this.TEAM_ASSIGNATIONS_LOADED);
          this.pickingParametrizationProvider.loadingListTeamAssignations--;
        })
        .catch((error) => {
          console.error('Error::Subscribe:workwavesService::postAssignUserToMatchLineRequest::', error);
          this.pickingParametrizationProvider.listTeamAssignations = new Array<WorkwaveModel.TeamAssignations>();
          this.events.publish(this.TEAM_ASSIGNATIONS_LOADED);
          this.pickingParametrizationProvider.loadingListTeamAssignations--;
        });
    } else {
      this.pickingParametrizationProvider.listTeamAssignations = new Array<WorkwaveModel.TeamAssignations>();
      this.events.publish(this.TEAM_ASSIGNATIONS_LOADED);
      this.pickingParametrizationProvider.loadingListTeamAssignations--;
    }
  }

  saveWorkWave() {
    if (this.listEmployeesToUpdate.length < 1) {
      this.presentToast("Seleccione almenos un usuario para generar las tareas de picking.", "danger");
    } else if (this.listRequestOrdersToUpdate.length < 1) {
      this.presentToast("Seleccione almenos una operación de envío para generar las tareas de picking.", "danger");
    } else {
      this.presentAlertConfirmPickings();
    }
  }

  goPreviousPage () {
    this.location.back();
  }

  //region Response from table components
  typeChanged(data) {
    this.listTypesToUpdate = data;
    this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore++;
    this.tableRequests.loadingListRequestOrdersOnlineStore++;
    console.log('Test::loading 8', this.tableRequests.loadingListRequestOrdersOnlineStore);
    this.loadRequestOrders();
  }

  employeeChanged(data) {
    this.listEmployeesToUpdate = data;
    this.pickingParametrizationProvider.loadingListTeamAssignations++;
    this.loadTeamAssignations();
  }

  requestOrderChanged(data) {
    this.listWarehousesThresholdAndSelectedQty = data.listThreshold;
    this.listRequestOrdersToUpdate = data.listSelected;
    this.loadTeamAssignations();
  }
  //endregion

  private generateWorkWave() {
    this.workwavesService
      .postConfirmMatchLineRequestOnlineStore({
        type: this.TYPE_EXECUTION_ID,
        requestIds: this.listRequestOrdersToUpdate,
        userIds: this.listEmployeesToUpdate
      })
      .then((res: WorkwaveModel.ResponseConfirmMatchLineRequestOnlineStore) => {
        if (res.code == 201) {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          this.presentToast("Tareas de picking generadas correctamente", "success");
          this.goPreviousPage();
        } else {
          console.error('Error::Subscribe:workwavesService::postConfirmMatchLineRequest::', res);
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
        }
      }, (error) => {
        console.error('Error::Subscribe:workwavesService::postConfirmMatchLineRequest::', error);
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
      })
      .catch((error) => {
        console.error('Error::Subscribe:workwavesService::postConfirmMatchLineRequest::', error);
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
      });
  }

  async presentAlertWarningOverThreshold(listWarehousesOverThreshold: Array<string>) {
    let msg = '';
    if (listWarehousesOverThreshold.length == 1) {
      msg = `Se ha superado el umbral máximo de envío a la tienda <b>${listWarehousesOverThreshold[0]}</b>. Ajuste las órdenes seleccionadas al máximo de la tienda.`
    } else {
      let warehousesOverThreshold = listWarehousesOverThreshold.join(', ');
      msg = `Se ha superado el umbral máximo de envío a las tienda <b>${warehousesOverThreshold}</b>. Ajuste las órdenes seleccionadas al máximo de cada tienda.`
    }

    const alert = await this.alertController.create({
      header: '¡Umbral máximo superado!',
      message: msg,
      buttons: [ 'Cerrar' ]
    });

    await alert.present();
  }

  async presentAlertConfirmPickings() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      message: 'Se generará y ejecutará la ola de trabajo con las especificaciones indicadas. ¿Continuar con la creación?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.showLoading('Lanzando ola de trabajo...').then(() => this.generateWorkWave());
          }
        }
      ]
    });

    await alert.present();
  }

  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
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