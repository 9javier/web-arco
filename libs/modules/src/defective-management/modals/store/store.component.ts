import { Component, OnInit,ViewChild } from '@angular/core';
import { DataComponent } from '../data/data.component';
import { ModalController, NavParams } from '@ionic/angular';
import { DefectiveManagementModel } from '../../../../../services/src/models/endpoints/defective-management-model';
import { IntermediaryService } from '@suite/services';
import { DefectiveManagementService } from '../../../../../services/src/lib/endpoint/defective-management/defective-management.service';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  isParent = true;
  parentId: number;
  @ViewChild(DataComponent) data:DataComponent;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private intermediaryService: IntermediaryService,
    private defectiveManagementService: DefectiveManagementService
  ) {
    this.isParent = this.navParams.get("isParent");
    this.parentId = this.navParams.get("parentId");
  }

  ngOnInit() {
  }

  /**
   * Save new group in server
   * @param data - the data to be saved
   */
  async submit(data: DefectiveManagementModel.RequestDefectiveManagementParent) {
    await this.intermediaryService.presentLoading();

    if (this.isParent) {
      this.defectiveManagementService.store(data).subscribe(async () => {
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastSuccess("Grupo guardado con éxito");
        this.close();
      }, async () => {
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastError("Error guardando el grupo");
        this.close();
      })
    } else {
      this.defectiveManagementService.storeChild(data).subscribe(async () => {
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastSuccess("Grupo guardado con éxito");
        this.close();
      }, async () => {
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastError("Error guardando el grupo");
        this.close();
      })
    }
  }

  /**
   * Close the current isntance of modal
   */
  async close() {
    await this.modalController.dismiss()
  }

}
