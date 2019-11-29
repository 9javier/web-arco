import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { Location } from "@angular/common";
import {
  GroupWarehousePickingModel,
  GroupWarehousePickingService,
  UserTimeModel,
  UserTimeService
} from "@suite/services";
import { PickingParametrizationProvider } from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import { WorkwavesService } from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import { WorkwaveModel } from "../../../../services/src/models/endpoints/Workwaves";
import { AlertController, Events, LoadingController, ToastController } from "@ionic/angular";
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {Router} from "@angular/router";
import {TableEmployeesComponent} from "../table-employees/table-employees.component";
import {TableRequestsOrdersComponent} from "../table-requests-orders/table-requests-orders.component";

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
  private DRAW_CONSOLIDATED_MATCHES = "draw-consolidated-matches";
  private TYPE_EXECUTION_ID = 1;
  private BLOCK_BUTTONS = 'block_button';
  private ENABLED_BUTTONS = 'enabled_button';
  private BLOCK_BUTTONS_TEAM = 'block_button_team';
  private ENABLED_BUTTONS_TEAM = 'enabled_button_team';

  @Input() templateToEdit: any;
  @Input() typeWorkwave: number;
  @ViewChild(TableEmployeesComponent) tableEmployees: TableEmployeesComponent;
  @ViewChild(TableRequestsOrdersComponent) tableRequestsOrders: TableRequestsOrdersComponent;

  template: any;
  public userReques: any = [];
  disableEdition: boolean = false;

  listTypesToUpdate: Array<number> = new Array<number>();
  listGroupsWarehousesToUpdate: Array<GroupWarehousePickingModel.GroupWarehousesSelected> = new Array<GroupWarehousePickingModel.GroupWarehousesSelected>();
  listEmployeesToUpdate: Array<number> = new Array<number>();
  listRequestOrdersToUpdate: Array<number> = new Array<number>();
  private listWarehousesThresholdAndSelectedQty: any = {};
  private checkRequestsSelectedIsOverThreshold: boolean = false;

  private loading: HTMLIonLoadingElement = null;
  private ObservablePendings: Array<any> = new Array();
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  enlarged = false;
  responseQuantities: WorkwaveModel.AssignationsByRequests[];

  constructor(
    private location: Location,
    private events: Events,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private groupWarehousePickingService: GroupWarehousePickingService,
    private userTimeService: UserTimeService,
    private workwavesService: WorkwavesService,
    private pickingParametrizationProvider: PickingParametrizationProvider,

  ) {

    this.workwavesService.requestUser.subscribe(res => {
      if (res.user === true && res.table == true) {
        this.employeeChanged(res.data);

      }
    })

    this.workwavesService.orderAssignment.subscribe(res => {
      if (res.store == true && res.type == true) {
        this.groupWarehousesChanged(res.data);
      }
    })
  }

  ngOnInit() {

    if (this.templateToEdit) {
      if (this.templateToEdit.type == 1) {
        this.disableEdition = true;
      }
      this.template = {
        name: this.templateToEdit.name || 'Ola de trabajo // ' + this.templateToEdit.id,
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


  ngOnDestroy() {


    //this.workwavesService.orderAssignment.unsubscribe();
    //this.workwavesService.requestUser.unsubscribe();
    // this.ngUnsubscribe.next();
    // this.ngUnsubscribe.complete();

    this.ObservablePendings.map(obs => {
      try {
        <Observable<any>>obs.unsubscribe();
      } catch (error) {
      }
    })
  }

  private loadDefaultWorkWaveData() {
    this.pickingParametrizationProvider.loadingListGroupsWarehouses++;
    this.loadGroupsWarehouses();
    this.pickingParametrizationProvider.loadingListEmployees++;
    this.loadEmployees();
    this.pickingParametrizationProvider.loadingListRequestOrders++;
    this.loadRequestOrders();
    this.pickingParametrizationProvider.loadingListTeamAssignations++;
    this.loadTeamAssignations();
  }

  private loadGroupsWarehouses() {
    let obs = this.groupWarehousePickingService.getIndex();
    this.ObservablePendings.push(obs);
    obs.subscribe((res: Array<GroupWarehousePickingModel.GroupWarehousePicking>) => {
      this.pickingParametrizationProvider.listGroupsWarehouses = res.filter(groupWarehouse => groupWarehouse.warehouses.length > 0);
      this.events.publish(this.GROUPS_WAREHOUSES_LOADED);
      this.pickingParametrizationProvider.loadingListGroupsWarehouses--;
    }, (error) => {
      console.error('Error::Subscribe:groupWarehousePickingService::getIndex::', error);
      this.pickingParametrizationProvider.listGroupsWarehouses = new Array<GroupWarehousePickingModel.GroupWarehousePicking>();
      this.events.publish(this.GROUPS_WAREHOUSES_LOADED);
      this.pickingParametrizationProvider.loadingListGroupsWarehouses--;
    });
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
    if (this.listTypesToUpdate.length > 0 && this.listGroupsWarehousesToUpdate.length > 0) {
      let obs = this.workwavesService.postMatchLineRequest({
        groupsWarehousePicking: this.listGroupsWarehousesToUpdate,
        typesShippingOrders: this.listTypesToUpdate
      });
      this.ObservablePendings.push(obs);
      obs.subscribe((res: Array<WorkwaveModel.MatchLineRequest>) => {
        this.pickingParametrizationProvider.listRequestOrders = res;
        this.events.publish(this.REQUEST_ORDERS_LOADED);
        this.pickingParametrizationProvider.loadingListRequestOrders--;
        this.pickingParametrizationProvider.loadingListRequestOrders--;
        this.pickingParametrizationProvider.loadingListTeamAssignations--;
        this.events.publish(this.ENABLED_BUTTONS);
        this.events.publish(this.ENABLED_BUTTONS_TEAM);
      }, (error) => {
        console.error('Error::Subscribe:workwavesService::postMatchLineRequest::', error);
        this.pickingParametrizationProvider.listRequestOrders = new Array<WorkwaveModel.MatchLineRequest>();
        this.events.publish(this.REQUEST_ORDERS_LOADED);
        this.pickingParametrizationProvider.loadingListRequestOrders--;
        this.pickingParametrizationProvider.loadingListRequestOrders--;
        this.pickingParametrizationProvider.loadingListTeamAssignations--;
        this.events.publish(this.ENABLED_BUTTONS);
        this.events.publish(this.ENABLED_BUTTONS_TEAM);
      });
    } else {
      this.pickingParametrizationProvider.listRequestOrders = new Array<WorkwaveModel.MatchLineRequest>();
      this.events.publish(this.REQUEST_ORDERS_LOADED);
      this.pickingParametrizationProvider.loadingListRequestOrders--;
      this.pickingParametrizationProvider.loadingListRequestOrders--;
      this.pickingParametrizationProvider.loadingListTeamAssignations--;
      this.events.publish(this.ENABLED_BUTTONS);
      this.events.publish(this.ENABLED_BUTTONS_TEAM);
    }
  }

  private loadTeamAssignations() {
    if (this.listEmployeesToUpdate.length > 0 && this.listRequestOrdersToUpdate.length > 0) {
      let obs0 = this.workwavesService
        .postMatchLineRequest({
          groupsWarehousePicking: this.listGroupsWarehousesToUpdate,
          typesShippingOrders: this.listTypesToUpdate
        });
      this.ObservablePendings.push(obs0);
      let obs = this.workwavesService
        .postAssignUserToMatchLineRequest({
          requestIds: this.listRequestOrdersToUpdate,
          userIds: this.listEmployeesToUpdate,
          groupsWarehousePicking: this.listGroupsWarehousesToUpdate,
          typesShippingOrders: this.listTypesToUpdate
        })
      this.ObservablePendings.push(obs);
      obs.subscribe((res: WorkwaveModel.UsersAndAssignationsQuantities) => {
        this.pickingParametrizationProvider.listTeamAssignations = res.assignations;
        this.events.publish(this.TEAM_ASSIGNATIONS_LOADED);
        if (res.quantities) {
          this.events.publish(this.DRAW_CONSOLIDATED_MATCHES, res.quantities);
          this.responseQuantities = res.quantities;
        }
        this.pickingParametrizationProvider.loadingListTeamAssignations--;
      }, (error) => {
        console.error('Error::Subscribe:workwavesService::postAssignUserToMatchLineRequest::', error);
        this.pickingParametrizationProvider.listTeamAssignations = new Array<WorkwaveModel.TeamAssignations>();
        this.events.publish(this.TEAM_ASSIGNATIONS_LOADED);
        this.pickingParametrizationProvider.loadingListTeamAssignations--;
      }, () => {
        this.events.publish(this.ENABLED_BUTTONS);
        this.events.publish(this.ENABLED_BUTTONS_TEAM);
      });
    } else {
      this.pickingParametrizationProvider.listTeamAssignations = new Array<WorkwaveModel.TeamAssignations>();
      this.events.publish(this.TEAM_ASSIGNATIONS_LOADED);
      this.pickingParametrizationProvider.loadingListTeamAssignations--;
      this.events.publish(this.ENABLED_BUTTONS);
      this.events.publish(this.ENABLED_BUTTONS_TEAM);
    }
  }

  saveWorkWave() {
    if (this.listEmployeesToUpdate.length < 1) {
      this.presentToast("Seleccione almenos un usuario para generar las tareas de picking.", "danger");
    } else if (this.listRequestOrdersToUpdate.length < 1) {
      this.presentToast("Seleccione almenos una operación de envío para generar las tareas de picking.", "danger");
    } else {
      let listWarehousesOverThreshold = [];

      for (let iWarehouse in this.listWarehousesThresholdAndSelectedQty) {
        let warehouseThreshold = this.listWarehousesThresholdAndSelectedQty[iWarehouse];
        if (typeof warehouseThreshold.max != 'undefined' && warehouseThreshold.max != null && warehouseThreshold.max > 0 && warehouseThreshold.selected > warehouseThreshold.max) {
          listWarehousesOverThreshold.push(warehouseThreshold.warehouse);
        }
      }

      if (this.checkRequestsSelectedIsOverThreshold && listWarehousesOverThreshold.length > 0) {
        this.presentAlertWarningOverThreshold(listWarehousesOverThreshold);
      } else {
        this.presentAlertConfirmPickings();
      }
    }
  }

  goPreviousPage() {
    this.router.navigate(['workwaves-scheduled'], { replaceUrl: true });
  }

  typeChanged(data) {
    this.listTypesToUpdate = data.fields;
    if (data.inPageCreation) {
      this.updateListOfRequestOrders();
    }
    // this.pickingParametrizationProvider.loadingListRequestOrders++;
    // this.loadRequestOrders();
  }

  groupWarehousesChanged(data) {
    this.listGroupsWarehousesToUpdate = new Array<GroupWarehousePickingModel.GroupWarehousesSelected>(data.fields);
    if (data.inPageCreation) {
      this.updateListOfRequestOrders();
    }
  }

  employeeChanged(data) {
    this.listEmployeesToUpdate = data.fields;
    if (data.inPageCreation) {
      this.updateListOfUserAssignations();
    }
  }

  requestOrderChanged(data) {
    this.listWarehousesThresholdAndSelectedQty = data.fields.listThreshold;
    this.listRequestOrdersToUpdate = data.fields.listSelected;
    if (data.inPageCreation) {
      this.updateListOfUserAssignations();
    }
  }

  updateListOfRequestOrders() {
    this.pickingParametrizationProvider.loadingListRequestOrders++;
    this.loadRequestOrders();
  }

  updateListOfUserAssignations() {
    this.listEmployeesToUpdate = this.tableEmployees.getSelectedEmployees();
    this.listRequestOrdersToUpdate = this.tableRequestsOrders.getSelectedRequests();
    this.pickingParametrizationProvider.loadingListTeamAssignations++;
    this.loadTeamAssignations();
  }

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
    let obs = this.workwavesService
      .postConfirmMatchLineRequest({
        type: this.TYPE_EXECUTION_ID,
        requestIds: this.listRequestOrdersToUpdate,
        userIds: this.listEmployeesToUpdate,
        groupsWarehousePicking: this.listGroupsWarehousesToUpdate
      });
    this.ObservablePendings.push(obs);
    obs.subscribe((res: WorkwaveModel.DataConfirmMatchLineRequest) => {
      if (this.loading) {
        this.loading.dismiss();
        this.loading = null;
      }
      this.presentToast("Tareas de picking generadas correctamente", "success");
      this.goPreviousPage();
    }, (error) => {
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
