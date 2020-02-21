import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import {
  GroupWarehousePickingModel,
  GroupWarehousePickingService, IntermediaryService,
  UserTimeModel,
  UserTimeService
} from '@suite/services';
import { PickingParametrizationProvider } from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import { WorkwavesService } from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import { WorkwaveModel } from "../../../../services/src/models/endpoints/Workwaves";
import { AlertController, Events, LoadingController } from "@ionic/angular";
import { TableTypesOSComponent } from "../table-types/table-types.component";
import { TableRequestsOrdersOSComponent } from "../table-requests-orders/table-requests-orders.component";
import { TableEmployeesOSComponent } from "../table-employees/table-employees.component";
import { Observable } from 'rxjs';
import {Router} from "@angular/router";
import { TimesToastType } from '../../../../services/src/models/timesToastType';

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
  @ViewChild(TableEmployeesOSComponent) tableEmployees: TableEmployeesOSComponent;

  template: any;
  disableEdition: boolean = false;

  listTypesToUpdate: Array<number> = new Array<number>();
  listGroupsWarehousesToUpdate: Array<GroupWarehousePickingModel.GroupWarehousesSelected> = new Array<GroupWarehousePickingModel.GroupWarehousesSelected>();
  listEmployeesToUpdate: Array<number> = new Array<number>();
  listRequestOrdersToUpdate: Array<number> = new Array<number>();
  listDeliveryRequestOrdersToUpdate: Array<number> = new Array<number>();
  private listWarehousesThresholdAndSelectedQty: any = {};
  private checkRequestsSelectedIsOverThreshold: boolean = false;
  private ObservablePendings: Array<any> = new Array();


  private loading: HTMLIonLoadingElement = null;
  enlarged = false;
  responseQuantities: WorkwaveModel.AssignationsByRequests[];

  constructor(
    private location: Location,
    private events: Events,
    private router: Router,
    private intermediaryService: IntermediaryService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private groupWarehousePickingService: GroupWarehousePickingService,
    private userTimeService: UserTimeService,
    private workwavesService: WorkwavesService,
    private pickingParametrizationProvider: PickingParametrizationProvider,
  ) {
    this.workwavesService.requestUser.subscribe(res => {
      if (res.user === true && res.table === true) {
        res.data.user = this.tableEmployees.getSelectedEmployees();
        this.employeeChanged(res.data);
      }
    })

    this.workwavesService.orderAssignment.subscribe(res => {
      if (res.store === true && res.type === true) {
        this.typeChanged(res.data.typesShippingOrders);
      }
    })
  }

  ngOnInit() {
    this.pickingParametrizationProvider.loadingListEmployees = 0;
    this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore = 0;
    this.tableRequests.loadingListRequestOrdersOnlineStore = 0;
    this.pickingParametrizationProvider.loadingListTeamAssignations = 0;
    this.template = {
      name: 'Nueva Ola de trabajo',
      id: null
    };
    this.loadDefaultWorkWaveData();
    this.typeChanged([20, 30]);
  }

  ngOnDestroy() {

    this.ObservablePendings.map(obs => {
      try {
        <Observable<any>>obs.unsubscribe();
      } catch (error) {
      }
    })
  }

  private loadDefaultWorkWaveData() {
    this.pickingParametrizationProvider.loadingListEmployees++;
    this.loadEmployees();
    this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore++;
    this.tableRequests.loadingListRequestOrdersOnlineStore++;
    this.loadRequestOrders();
    this.pickingParametrizationProvider.loadingListTeamAssignations++;
    this.loadTeamAssignations();
  }

  private loadEmployees() {
    let obs = this.userTimeService.getListUsersRegister();
    this.ObservablePendings.push(obs);
    obs.subscribe((res: UserTimeModel.ListUsersRegisterTimeActiveInactive) => {
      this.pickingParametrizationProvider.listEmployees = res;
      this.events.publish(this.EMPLOYEES_LOADED);
      this.pickingParametrizationProvider.loadingListEmployees--;
    }, (error) => {
      console.error('Error::Subscribe:userTimeService::getListUsersRegister::', error);
      this.pickingParametrizationProvider.listEmployees = { usersActive: [], usersInactive: [] };
      this.events.publish(this.EMPLOYEES_LOADED);
      this.pickingParametrizationProvider.loadingListEmployees--;
    });
  }

  private loadRequestOrders() {
    this.pickingParametrizationProvider.loadingListTeamAssignations++;
    if (this.listTypesToUpdate.length > 0) {
      this.workwavesService.postMatchLineRequestOnlineStore({ preparationLinesTypes: this.listTypesToUpdate })
        .then((res: WorkwaveModel.ResponseMatchLineRequestOnlineStore) => {
          if (res.code === 201) {
            this.pickingParametrizationProvider.listRequestOrdersOnlineStore = res.data;
            this.events.publish(this.REQUEST_ORDERS_LOADED);
            this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore--;
            this.tableRequests.loadingListRequestOrdersOnlineStore--;
            this.pickingParametrizationProvider.loadingListTeamAssignations--;
          } else {
            console.error('Error::Subscribe:workwavesService::postMatchLineRequest::', res);
            this.pickingParametrizationProvider.listRequestOrdersOnlineStore = [];
            this.events.publish(this.REQUEST_ORDERS_LOADED);
            this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore--;
            this.tableRequests.loadingListRequestOrdersOnlineStore--;
            this.pickingParametrizationProvider.loadingListTeamAssignations--;
          }
        }, (error) => {
          console.error('Error::Subscribe:workwavesService::postMatchLineRequest::', error);
          this.pickingParametrizationProvider.listRequestOrdersOnlineStore = [];
          this.events.publish(this.REQUEST_ORDERS_LOADED);
          this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore--;
          this.tableRequests.loadingListRequestOrdersOnlineStore--;
          this.pickingParametrizationProvider.loadingListTeamAssignations--;
        }
      ).catch((error) => {
        console.error('Error::Subscribe:workwavesService::postMatchLineRequest::', error);
        this.pickingParametrizationProvider.listRequestOrdersOnlineStore = [];
        this.events.publish(this.REQUEST_ORDERS_LOADED);
        this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore--;
        this.tableRequests.loadingListRequestOrdersOnlineStore--;
        this.pickingParametrizationProvider.loadingListTeamAssignations--;
      });
    } else {
      this.pickingParametrizationProvider.listRequestOrdersOnlineStore = [];
      this.events.publish(this.REQUEST_ORDERS_LOADED);
      this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore--;
      this.tableRequests.loadingListRequestOrdersOnlineStore--;
      this.pickingParametrizationProvider.loadingListTeamAssignations--;
    }
  }

  private loadTeamAssignations() {
    if (this.listEmployeesToUpdate.length > 0 && (this.listRequestOrdersToUpdate.length > 0 || this.listDeliveryRequestOrdersToUpdate.length > 0)) {
      this.workwavesService
        .postAssignUserToMatchLineOnlineStoreRequest({
          requestIds: this.listRequestOrdersToUpdate,
          deliveryRequestIds: this.listDeliveryRequestOrdersToUpdate,
          userIds: this.listEmployeesToUpdate
        })
        .then((res: WorkwaveModel.ResponseAssignUserToMatchLineRequestOnlineStore) => {
          if (res.code === 201) {
            let resData = res.data;
            this.pickingParametrizationProvider.listTeamAssignations = resData.assignations;
            this.events.publish(this.TEAM_ASSIGNATIONS_LOADED);
            if (resData.quantities) {
              this.events.publish(this.DRAW_CONSOLIDATED_MATCHES, resData.quantities);
              this.responseQuantities = resData.quantities;
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
      this.intermediaryService.presentToastError('Seleccione almenos un usuario para generar las tareas de picking.', TimesToastType.DURATION_ERROR_TOAST);
    } else if (this.listRequestOrdersToUpdate.length < 1 && this.listDeliveryRequestOrdersToUpdate.length < 1) {
      this.intermediaryService.presentToastError('Seleccione almenos una operación de envío para generar las tareas de picking.', TimesToastType.DURATION_ERROR_TOAST);
    } else {
      this.presentAlertConfirmPickings();
    }
  }

  goPreviousPage() {
    this.router.navigate(['workwaves-scheduled'], { replaceUrl: true });
  }

  //region Response from table components
  typeChanged(data) {
    this.listTypesToUpdate = data;
    this.pickingParametrizationProvider.loadingListRequestOrdersOnlineStore++;
    this.tableRequests.loadingListRequestOrdersOnlineStore++;
    this.loadRequestOrders();
  }

  employeeChanged(data) {
    this.listEmployeesToUpdate = data.user;
    this.listRequestOrdersToUpdate = data.table.listSelected;
    this.listDeliveryRequestOrdersToUpdate = data.table.listSelectedDelivery;
    this.pickingParametrizationProvider.loadingListTeamAssignations++;
    this.loadTeamAssignations();
  }

  requestOrderChanged(data) {
    this.listWarehousesThresholdAndSelectedQty = data.listThreshold;
    this.listRequestOrdersToUpdate = data.listSelected;
    this.loadTeamAssignations();
  }
  //endregion

  enlarge() {
    if (this.enlarged) {
      let top = document.getElementsByClassName('stores-employees')[0] as HTMLElement;
      top.style.height = '25vh';
      this.enlarged = !this.enlarged;
    } else {
      let top = document.getElementsByClassName('stores-employees')[0] as HTMLElement;
      top.style.height = 'calc(100vh - 52px - 56px - 8px)';
      this.enlarged = !this.enlarged;
    }
  }

  private generateWorkWave() {
    this.workwavesService
      .postConfirmMatchLineRequestOnlineStore({
        type: this.TYPE_EXECUTION_ID,
        requestIds: this.listRequestOrdersToUpdate,
        deliveryRequestIds: this.listDeliveryRequestOrdersToUpdate,
        userIds: this.listEmployeesToUpdate
      })
      .then((res: WorkwaveModel.ResponseConfirmMatchLineRequestOnlineStore) => {
        if (res.code === 201) {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          this.intermediaryService.presentToastSuccess('Tareas de picking generadas correctamente', TimesToastType.DURATION_SUCCESS_TOAST_3750);
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
    if (listWarehousesOverThreshold.length === 1) {
      msg = `Se ha superado el umbral máximo de envío a la tienda <b>${listWarehousesOverThreshold[0]}</b>. Ajuste las órdenes seleccionadas al máximo de la tienda.`
    } else {
      let warehousesOverThreshold = listWarehousesOverThreshold.join(', ');
      msg = `Se ha superado el umbral máximo de envío a las tienda <b>${warehousesOverThreshold}</b>. Ajuste las órdenes seleccionadas al máximo de cada tienda.`
    }

    const alert = await this.alertController.create({
      header: '¡Umbral máximo superado!',
      message: msg,
      buttons: ['Cerrar']
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
}
