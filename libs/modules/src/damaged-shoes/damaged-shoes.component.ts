import { Component, OnInit } from '@angular/core';
import { IntermediaryService, ProductsService } from '@suite/services';
import { ModalController, PopoverController } from '@ionic/angular';
import { DamagedModel } from '../../../services/src/models/endpoints/Damaged';
import { AddDamagedShoesComponent } from './add-damaged-shoes/add-damaged-shoes.component';
import Classifications = DamagedModel.Classifications;
import ModalResponse = DamagedModel.ModalResponse;

@Component({
  selector: 'suite-damaged-shoes',
  templateUrl: './damaged-shoes.component.html',
  styleUrls: ['./damaged-shoes.component.scss'],
})
export class DamagedShoesComponent implements OnInit {
  originalClassifications: string;
  tableClassifications: DamagedModel.Classifications[];
  tableAction: DamagedModel.Action[];
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

  changeAction(event, item, action: string) {
    const index = this.tableClassifications.findIndex((x) => x.id === item.id);
    this.tableClassifications[index][action] = event.checked;
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
        tAction: this.tableAction
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

  async editAction(element: Classifications) {
    const modal = await this.modalController.create({
      component: AddDamagedShoesComponent,
      componentProps: {
        tAction: this.tableAction,
        element: element
      }
    });

    modal.onDidDismiss().then(async response => {
      if (response.data) {
        await this.intermediaryService.presentLoading('Cargando...');
        const modalData: ModalResponse = response.data;
        const classification: Classifications = {
          id: element.id,
          name: modalData.name,
          ticketEmit: modalData.actions[0].isChecked,
          passHistory: modalData.actions[1].isChecked,
          requirePhoto: modalData.actions[2].isChecked,
          requireContact: modalData.actions[3].isChecked,
          requireOk: modalData.actions[4].isChecked,
          allowOrders: modalData.actions[5].isChecked
        };
        await this.productsService.postDamagedUpdate([classification]);
        await this.getData();
        await this.intermediaryService.dismissLoading();
      }
    });

    await modal.present();
  }

  async getData() {
    this.thereAreChanges = false;
    await this.productsService.getDamagedList().then(response => {
      const list: DamagedModel.List = response.data;
      this.originalClassifications = JSON.stringify(list.classifications);
      this.tableClassifications = list.classifications;
      this.tableAction = list.list_actions;
    });
  }

  async postData() {
    this.tableClassifications.forEach((v) => {
      delete v.createdAt;
      delete v.updatedAt;
    });
    await this.productsService.postDamagedUpdate(this.tableClassifications).then(() => {
      this.ngOnInit();
    });
  }

  async postNewPermission(data: DamagedModel.ModalResponse){
    const item = {
      name: data.name,
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

}
