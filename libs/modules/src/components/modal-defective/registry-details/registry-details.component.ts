import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment, IncidentsService, TypesService } from '@suite/services';
import { PrinterService } from "../../../../../services/src/lib/printer/printer.service";
import { AlertController, LoadingController, ModalController, NavParams } from "@ionic/angular";
import { InventoryService, WarehouseService } from '@suite/services';
import { DefectiveRegistryModel } from '../../../../../services/src/models/endpoints/DefectiveRegistry';
import { DefectiveRegistryService } from '../../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { DamagedModel } from '../../../../../services/src/models/endpoints/Damaged';
import { ChangeStateComponent } from '../change-state/change-state.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'suite-registry-details',
  templateUrl: './registry-details.component.html',
  styleUrls: ['./registry-details.component.scss']
})
export class RegistryDetailsComponent implements OnInit {
  id: number;
  isHistory: boolean;
  private baseUrlPhoto = environment.apiBasePhoto;
  section = 'information';
  title = 'Ubicación ';
  originalTableStatus: DamagedModel.Status[];
  productId: string;
  registry: any = {};
  registry_data: any ={};
  registryHistorical;
  showChangeState = false;
  date: any;
  container = null;
  warehouseId: number;
  listProducts: any[] = [];
  loading = null;

  actionTypes = {};
  listWarehouses: any[] = [];
  listHalls: any[] = [];
  listHallsOriginal: any = {};
  listRows: any[] = [];
  listRowsOriginal: any = {};
  listColumns: any[] = [];
  listColumnsOriginal: any = {};
  listReferences: any = {};
  warehouseSelected: number;
  columnSelected: number;
  dates: any[] = [];
  statusManagement;

  constructor(
    private typeService: TypesService,
    private defectiveRegistryService: DefectiveRegistryService,
    private modalController: ModalController,
    private navParams: NavParams,
    private printerService: PrinterService,
    private warehouseService: WarehouseService,
    private alertController: AlertController,
    private inventoryService: InventoryService,
    private loadingController: LoadingController,
    private incidentsService: IncidentsService,
  ) {
    this.id = this.navParams.get("id");
    this.isHistory = this.navParams.get("history");
    this.productId = this.navParams.get("productId");
    this.showChangeState = this.navParams.get("showChangeState");
  }

  ngOnInit() {
    this.container = this.navParams.data.container;
    this.warehouseId = this.navParams.data.warehouseId;
    this.listWarehouses = this.warehouseService.listWarehouses;
    this.listHallsOriginal = this.warehouseService.listHalls;
    this.listRowsOriginal = this.warehouseService.listRows;
    this.listColumnsOriginal = this.warehouseService.listColumns;
    this.listReferences = this.warehouseService.listReferences;

    this.warehouseSelected = null;
    this.getRegistryDetail();
    this.getRegistryHistorical();
    this.getActionTypes();
    this.getStatusManagement();
  }

  getActionTypes(): void {
    this.typeService.getTypeActions().subscribe(ActionTypes => {
      ActionTypes.forEach(actionType => {
        this.actionTypes[actionType.id] = actionType.name
      })
    })
  }

  getStatusManagement() {
    this.incidentsService.getDtatusManagamentDefect().subscribe(resp => {
      this.statusManagement = resp;
    })
  }

  getRegistryHistorical(): void {
    this.defectiveRegistryService.getHistorical({ id: this.id, isHistory: this.isHistory }).subscribe(historical => {
      this.registryHistorical = historical;
    });
  }

  getRegistryDetail(): void {
    this.defectiveRegistryService.getDataDefect({ id: this.id, isHistory: this.isHistory }).subscribe(lastHistorical => {
      this.registry_data = {
        data: lastHistorical.data,
        status: lastHistorical.statuses};
      this.registry = lastHistorical.data;
      this.originalTableStatus = lastHistorical.statuses;
    });
  }

  async close() {
    this.defectiveRegistryService.setRefreshList(true);
    await this.modalController.dismiss();
  }

  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }

  async presentAlert(subHeader) {
    const alert = await this.alertController.create({
      header: 'Atencion',
      subHeader,
      buttons: ['OK']
    });
    await alert.present();
  }

  getStatusName(defectType: number) {
    const tableStatus = this.originalTableStatus.find((x) => x.id === defectType);
    return tableStatus.name ? tableStatus.name : '-';
  }

  getRequireStatus(defectType: number, statusName: string) {
    if(this.statusManagement && this.statusManagement.classifications){
      const status = this.statusManagement.classifications.find((x) => x.defectType === defectType);
      if(status){
        switch (statusName) {
          case 'contact':
            return status.requireContact;
          case 'history':
            return status.passHistory;
          case 'photo':
            return status.requirePhoto;
          case 'signature':
            return status.requireOk;
          case 'ticket':
            return status.ticketEmit;
          case 'orders':
            return status.allowOrders;
        }
      }
    }
  }
}
