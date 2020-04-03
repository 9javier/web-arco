import { Component, OnInit,ViewChild } from '@angular/core';
import { IntermediaryService } from '@suite/services';
import { NavParams, ModalController } from '@ionic/angular';
import { DataComponent } from '../data/data.component';
import { DefectiveZonesService } from '../../../../../services/src/lib/endpoint/defective-zones/defective-zones.service';
import { DefectiveZonesModel } from '../../../../../services/src/models/endpoints/defective-zones-model';
import { DefectiveZonesChildModel } from '../../../../../services/src/models/endpoints/DefectiveZonesChild';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @ViewChild(DataComponent) data:DataComponent;

  group: DefectiveZonesModel.DefectiveZonesParent;
  child: DefectiveZonesChildModel.DefectiveZonesChild;
  isParent: true;
  element: any;
  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private defectiveZonesService: DefectiveZonesService,
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
   * Update a Defective Zones
   * @param value - the group to be updated
   */
  async submit(value) {
    await this.intermediaryService.presentLoading();

    if (this.isParent) {
      this.defectiveZonesService.update(this.element.id, value).subscribe(async () => {
        this.close();
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastSuccess("Grupo actualizado con exito");
      }, async () => {
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastError("Error al actualizar")
      })
    } else {
      console.log(value);

      this.defectiveZonesService.updateChild(this.element.id, value).subscribe(async () => {
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