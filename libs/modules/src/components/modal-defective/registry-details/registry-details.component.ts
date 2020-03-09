import { Component, OnInit } from '@angular/core';
import { TypesService } from '@suite/services';
import { PrinterService } from "../../../../../services/src/lib/printer/printer.service";
import { AlertController, LoadingController, ModalController, NavParams } from "@ionic/angular";
import { InventoryService, WarehouseService } from '@suite/services';
import { DefectiveRegistryModel } from '../../../../../services/src/models/endpoints/DefectiveRegistry';
import { DefectiveRegistryService } from '../../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { DamagedModel } from '../../../../../services/src/models/endpoints/Damaged';
import { ChangeStateComponent } from '../change-state/change-state.component';

@Component({
  selector: 'suite-registry-details',
  templateUrl: './registry-details.component.html',
  styleUrls: ['./registry-details.component.scss']
})
export class RegistryDetailsComponent implements OnInit {
  section = 'information';
  title = 'Ubicación ';
  originalTableStatus: DamagedModel.Status[];
  registry: DefectiveRegistryModel.DefectiveRegistry;
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
  ) {
    this.registry = this.navParams.get("registry");
    // ToDo: Delete Mock
    this.registry.photos = [
      'https://ccc1.krackonline.com/img/krackonline-logo-1503048892.jpg',
      'https://ccc1.krackonline.com/img/krackonline-logo-1503048892.jpg',
      'https://ccc1.krackonline.com/img/krackonline-logo-1503048892.jpg',
      'https://ccc1.krackonline.com/img/krackonline-logo-1503048892.jpg',
    ];

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
    this.getRegistryHistorical();
    this.getActionTypes();
  }

  getActionTypes(): void {
    this.typeService.getTypeActions().subscribe(ActionTypes => {
      ActionTypes.forEach(actionType => {
        this.actionTypes[actionType.id] = actionType.name
      })
    })
  }

  getRegistryHistorical(): void {
    this.defectiveRegistryService.getHistorical({ productReference: this.registry.product.reference }).subscribe(historical => {
      this.registryHistorical = historical.results;
      this.originalTableStatus = historical.statuses;

      this.registryHistorical.photos = [
        'https://ccc1.krackonline.com/img/krackonline-logo-1503048892.jpg',
        'https://ccc1.krackonline.com/img/krackonline-logo-1503048892.jpg',
        'https://ccc1.krackonline.com/img/krackonline-logo-1503048892.jpg',
        'https://ccc1.krackonline.com/img/krackonline-logo-1503048892.jpg',
      ];
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

  getStatusName(defectType: number) {
    const status = this.originalTableStatus.find((x) => x.id === defectType);
    return status.name;
  }
}
