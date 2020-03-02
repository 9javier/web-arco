import { Component, OnInit,ViewChild } from '@angular/core';
import { DataComponent } from '../data/data.component';
import { ModalController } from '@ionic/angular';
import { DefectiveManagementModel } from '../../../../../services/src/models/endpoints/defective-management-model';
import { IntermediaryService } from '@suite/services';
import { DefectiveManagementService } from '../../../../../services/src/lib/endpoint/defective-management/defective-management.service';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  @ViewChild(DataComponent) data:DataComponent;

  constructor(
    private modalController:ModalController,
    private intermediaryService:IntermediaryService,
    private defectiveManagementService: DefectiveManagementService

  ) { }

  ngOnInit() {
  }

  /**
   * Save new group in server
   * @param data - the data to be saved
   */
  async submit(data: DefectiveManagementModel.RequestDefectiveManagementParent) {
    await this.intermediaryService.presentLoading();
    this.defectiveManagementService.store(data).subscribe(async () => {
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastSuccess("Grupo guardado con éxito");
      this.close();
    }, async () => {
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastError("Error guardando el grupo");
      this.close();
    })
  }

  /**
   * Close the current isntance of modal
   */
  async close() {
    await this.modalController.dismiss()
  }

}
