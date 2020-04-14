import { Component, OnInit } from '@angular/core';
import { IncidentsService, TypesService, environment } from '@suite/services';
import { AlertController, LoadingController, ModalController, NavParams } from "@ionic/angular";
import { InventoryService, WarehouseService } from '@suite/services';
import { DefectiveRegistryModel } from '../../../../services/src/models/endpoints/DefectiveRegistry';
import { DefectiveRegistryService } from '../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { DamagedModel } from '../../../../services/src/models/endpoints/Damaged';
import { ChangeStateComponent } from '../../components/modal-defective/change-state/change-state.component';
import { PrinterService } from '../../../../services/src/lib/printer/printer.service';
import {PrintTicketService} from "../../../../services/src/lib/print-ticket/print-ticket.service";

@Component({
  selector: 'suite-details-register',
  templateUrl: './details-register.component.html',
  styleUrls: ['./details-register.component.scss']
})
export class DetailsRegisterComponent implements OnInit {
  id: number;
  ticketEmit: boolean;
  private baseUrlPhoto = environment.apiBasePhoto;
  section = 'information';
  title = 'Ubicación ';
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
    private printTicketService: PrintTicketService,
  ) {
    this.id = this.navParams.get("id");
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
    console.log("Actualice la información.......");
    this.defectiveRegistryService.getHistoricalAl({ id: this.id }).subscribe(historical => {
      this.registryHistorical = historical;
    });
  }

  getRegistryDetail(): void {
    this.defectiveRegistryService.getDataDefect({ id: this.id }).subscribe(lastHistorical => {
      this.registry_data = {
        data: lastHistorical.data,
        status: lastHistorical.statuses};
      this.registry = lastHistorical.data;
    });
  }

  async close() {
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

  getRequireStatus(defectStatus, statusName: string) {
    if (defectStatus && statusName) {
      switch (statusName) {
        case 'contact':
          return defectStatus.requireContact;
        case 'history':
          return defectStatus.passHistory;
        case 'photo':
          return defectStatus.requirePhoto;
        case 'signature':
          return defectStatus.requireOk;
        case 'ticket':
          return defectStatus.ticketEmit;
        case 'orders':
          return defectStatus.allowOrders;
      }
    }
  }

  print(defective) {
    this.incidentsService.getData(defective).subscribe(
      resp => {
        if (resp.data.statusManagementDefect.ticketEmit == true) {
          this.printTicketService.printTicket(resp.data);
        }
      });
  }
}
