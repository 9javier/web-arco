import { Component, OnInit,ViewChild } from '@angular/core';
import { IntermediaryService } from '@suite/services';
import { NavParams, ModalController } from '@ionic/angular';
import { DataComponent } from '../data/data.component';
import { DefectiveManagementService } from '../../../../../services/src/lib/endpoint/defective-management/defective-management.service';
import { DefectiveManagementModel } from '../../../../../services/src/models/endpoints/defective-management-model';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @ViewChild(DataComponent) data:DataComponent;

  group: DefectiveManagementModel.DefectiveManagementParent;

  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private defectiveManagementService: DefectiveManagementService,
    private intermediaryService:IntermediaryService
  ) {
    this.group = this.navParams.get("group");
  }

  ngOnInit() {
  }

  /**
   * Update a Defective Management
   * @param value - the group to be updated
   */
  async submit(value) {
    await this.intermediaryService.presentLoading();
    this.defectiveManagementService.update(this.group.id, value).subscribe(async () => {
      this.close();
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastSuccess("Grupo actualizado con exito");
    }, async () => {
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastError("Error al actualizar")
    })
  }

  close():void{
    this.modalController.dismiss();
  }

}
