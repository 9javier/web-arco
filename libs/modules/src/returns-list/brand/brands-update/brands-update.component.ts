import { Component, OnInit,ViewChild } from '@angular/core';
import { IntermediaryService } from '@suite/services';
import { NavParams, ModalController } from '@ionic/angular';
import { BrandsDataComponent } from '../brands-data/brands-data.component';
import { DefectiveManagementModel } from '../../../../../services/src/models/endpoints/defective-management-model';
import { DefectiveManagementChildModel } from '../../../../../services/src/models/endpoints/DefectiveManagementChild';
import { DefectiveManagementService } from '../../../../../services/src/lib/endpoint/defective-management/defective-management.service';

@Component({
  selector: 'suite-update',
  templateUrl: './brands-update.component.html',
  styleUrls: ['./brands-update.component.scss']
})
export class BrandsUpdateComponent implements OnInit {

  @ViewChild(BrandsDataComponent) data:BrandsDataComponent;

  group: DefectiveManagementModel.DefectiveManagementParent;
  child: DefectiveManagementChildModel.DefectiveManagementChild;
  isParent: true;
  element: any;
  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private defectiveManagementService: DefectiveManagementService,
    private intermediaryService:IntermediaryService
  ) {
    this.group = this.navParams.get("group");
    this.child = this.navParams.get("child");
    this.isParent = this.navParams.get("isParent");

    if (this.isParent) {
      this.element = this.group;
    } else {
      this.element = this.child;
    }
  }

  ngOnInit() {
  }

  /**
   * Update a Defective Management
   * @param value - the group to be updated
   */
  async submit(value) {
    await this.intermediaryService.presentLoading();

    if (this.isParent) {
      this.defectiveManagementService.update(this.element.id, value).subscribe(async () => {
        this.close();
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastSuccess("Grupo actualizado con exito");
      }, async () => {
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastError("Error al actualizar")
      })
    } else {
      console.log(value);

      this.defectiveManagementService.updateChild(this.element.id, value).subscribe(async () => {
        this.close();
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastSuccess("Tipo de defectuoso actualizado con exito");
      }, async () => {
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastError("Error al actualizar")
      })
    }
  }

  async close() {
    await this.modalController.dismiss();
  }

}
