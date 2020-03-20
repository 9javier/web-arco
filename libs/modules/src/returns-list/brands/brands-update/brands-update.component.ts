import { Component, OnInit,ViewChild } from '@angular/core';
import { IntermediaryService } from '@suite/services';
import { NavParams, ModalController } from '@ionic/angular';
import { BrandsDataComponent } from '../brands-data/brands-data.component';
import { DefectiveManagementService } from '../../../../../services/src/lib/endpoint/defective-management/defective-management.service';
import { DefectiveManagementModel } from '../../../../../services/src/models/endpoints/defective-management-model';
import { DefectiveManagementChildModel } from '../../../../../services/src/models/endpoints/DefectiveManagementChild';

@Component({
  selector: 'suite-brands-update',
  templateUrl: './brands-update.component.html',
  styleUrls: ['./brands-update.component.scss']
})
export class BrandsUpdateComponent implements OnInit {
  @ViewChild(BrandsDataComponent) data:BrandsDataComponent;
  element: any;
  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private defectiveManagementService: DefectiveManagementService,
    private intermediaryService:IntermediaryService
  ) {
    // this.group = this.navParams.get("group");
    // this.child = this.navParams.get("child");
    // this.isParent = this.navParams.get("isParent");
    //
    // if (this.isParent) {
    //   this.element = this.group;
    // } else {
    //   this.element = this.child;
    // }
  }

  ngOnInit() {
  }

  async submit(value) {
    // await this.intermediaryService.presentLoading();

    // this.defectiveManagementService.update(this.element.id, value).subscribe(async () => {
    //   this.close();
    //   await this.intermediaryService.dismissLoading();
    //   await this.intermediaryService.presentToastSuccess("Grupo actualizado con exito");
    // }, async () => {
    //   await this.intermediaryService.dismissLoading();
    //   await this.intermediaryService.presentToastError("Error al actualizar")
    // })
  }

  async close() {
    await this.modalController.dismiss();
  }

}
