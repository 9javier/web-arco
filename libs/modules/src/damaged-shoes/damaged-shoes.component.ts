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
  originalClassifications: string;
  tableClassifications: DamagedModel.Classifications[];
  originalTableStatus: DamagedModel.Status[];
  tableAction: DamagedModel.Action[];
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
    const modal = await this.modalController.create({
      component: AddDamagedShoesComponent,
      componentProps: {
        tAction: this.tableAction,
        tStatus: this.tableStatus
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
      console.log(list);
      this.originalClassifications = JSON.stringify(list.classifications);
      this.tableClassifications = list.classifications;
      this.originalTableStatus = JSON.parse(JSON.stringify(list.statuses));
      this.tableAction = list.list_actions;
      this.tableStatus = list.statuses.filter((status) => {
        let result = true;
        list.classifications.forEach((item) => {
          if (item.defectType === status.id) {
            result = false;
          }
        });

        return result;
      });
    });
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
    const item = {
      defectType: data.defectType,
      ticketEmit: data.actions[0].isChecked,
      passHistory: data.actions[1].isChecked,
      requirePhoto: data.actions[2].isChecked,
      requireContact: data.actions[3].isChecked,
      requireOk: data.actions[4].isChecked,
      allowOrders: data.actions[5].isChecked
    };

    await this.productsService.postDamagedNew([item]);
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
    const status = this.originalTableStatus.find((x) => x.id === defectType);
    return status.name;
  }
}
