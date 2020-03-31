import { Component, OnInit,ViewChild } from '@angular/core';
import { DataComponent } from '../data/data.component';
import { ModalController, NavParams } from '@ionic/angular';
import { DefectiveZonesModel } from '../../../../../services/src/models/endpoints/defective-zones-model';
import { IntermediaryService } from '@suite/services';
import { DefectiveZonesService } from '../../../../../services/src/lib/endpoint/defective-zones/defective-zones.service';

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
    private defectiveZonesService: DefectiveZonesService
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
  async submit(data: DefectiveZonesModel.RequestDefectiveZonesParent) {
    await this.intermediaryService.presentLoading();

    if (this.isParent) {
      this.defectiveZonesService.store(data).subscribe(async () => {
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastSuccess("Grupo guardado con éxito");
        this.close();
      }, async () => {
        await this.intermediaryService.dismissLoading();
        await this.intermediaryService.presentToastError("Error guardando el grupo");
        this.close();
      })
    } else {
      this.defectiveZonesService.storeChild(data).subscribe(async () => {
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
