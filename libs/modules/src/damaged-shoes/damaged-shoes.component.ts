import { Component, OnInit } from '@angular/core';
import { IntermediaryService, ProductsService } from '@suite/services';
import { ModalController, PopoverController } from '@ionic/angular';
import { DamagedModel } from '../../../services/src/models/endpoints/Damaged';
import { AddDamagedShoesComponent } from './add-damaged-shoes/add-damaged-shoes.component';

@Component({
  selector: 'suite-damaged-shoes',
  templateUrl: './damaged-shoes.component.html',
  styleUrls: ['./damaged-shoes.component.scss'],
})
export class DamagedShoesComponent implements OnInit {
  DEFAULT_STATUS: number = 1;
  originalClassifications: string;
  modalClassifications: DamagedModel.Classifications[];
  tableClassifications: DamagedModel.Classifications[];
  tableStatus: DamagedModel.Status[];
  tableColumns = ['statusId', 'status', 'ticketEmit', 'passHistory', 'requirePhoto', 'requireContact', 'requireOk', 'allowOrders'];

  thereAreChanges: boolean;

  constructor(
    private intermediaryService: IntermediaryService,
    private productsService: ProductsService,
    private popoverController: PopoverController,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.intermediaryService.presentLoading('Cargando...');
    await this.getData();
    this.thereAreChanges = false;
    await this.intermediaryService.dismissLoading();
  }

  changeAction(event, defectType: number, action: string) {
    const item = this.tableClassifications.findIndex((x) => x.defectType === defectType);
    this.tableClassifications[item][action] = event.checked;
    this.thereAreChanges = JSON.stringify(this.tableClassifications) !== this.originalClassifications;
  }

  async saveChanges() {
    await this.intermediaryService.presentLoading('Cargando...');
    await this.postData();
    this.originalClassifications = JSON.stringify(this.tableClassifications);
    this.thereAreChanges = false;
    await this.intermediaryService.dismissLoading();
  }

  async newAction() {
    await this.getModalPermissions();
    const modal = await this.modalController.create({
      component: AddDamagedShoesComponent,
      componentProps: {
        tPermissions: this.modalClassifications,
        tActions: this.tableStatus
      }
    });

    modal.onDidDismiss().then(async response=>{
      if (response.data) {
        await this.intermediaryService.presentLoading('Cargando...');
        const modalResponse: DamagedModel.ModalResponse = response.data;
        await this.postNewPermission(modalResponse);
        await this.getData();
        await this.intermediaryService.dismissLoading();
      }
    });

    await modal.present();
  }

  async getData() {
    await this.productsService.getDamagedList().then(response => {
      const list: DamagedModel.List = response.data;
      this.originalClassifications = JSON.stringify(list.classifications);
      this.tableClassifications = list.classifications;
      this.tableStatus = list.statuses;
    //   this.tableActions = list.list_actions;
    //   if (this.tableActions.length > 0) {
    //     for (let action of this.tableActions) {
    //       this.tableColumns.push(action.id.toString());
    //     }
    //   }
    });
  }

  async getModalPermissions(){
    // await this.productsService.getDamagedList({classifications: [], statuses: []}).then(response => {
    //   const list: DamagedModel.List = response.data;
    //   this.modalPermissions = list.permissions;
    // });
  }

  async postData() {
    this.tableClassifications.forEach((v) => {
      delete v.createdAt;
      delete v.updatedAt;
      delete v.id;
    });

    await this.productsService.postDamagedUpdate(this.tableClassifications).then(() => {
      this.ngOnInit();
    });
  }

  async postNewPermission(data: DamagedModel.ModalResponse){
    // await this.productsService.postDamagedNew(data);
  }

  isChecked(action: DamagedModel.Status, permissionActions: DamagedModel.Status[]): boolean {
    for(let iAction of permissionActions){
      if(iAction.id === action.id){
        return true;
      }
    }
    return false;
  }

  getStatusName(defectType: number) {
    const status = this.tableStatus.find((x) => x.id === defectType);
    return status.name;
  }
}
