import { Component, OnInit,ViewChild } from '@angular/core';
import { DataComponent } from '../data/data.component';
import { ModalController, NavParams } from '@ionic/angular';
import { IntermediaryService } from '@suite/services';
import { DefectiveManagementService } from '../../../../../services/src/lib/endpoint/defective-management/defective-management.service';
import { DefectiveManagementModel } from '../../../../../services/src/models/endpoints/defective-management-model';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  @ViewChild(DataComponent) data:DataComponent;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private intermediaryService: IntermediaryService,
    private defectiveManagementService: DefectiveManagementService
  ) { }

  ngOnInit() {
  }

  async submit(data: DefectiveManagementModel.RequestDefectiveManagementParent) {
    await this.intermediaryService.presentLoading();

    this.defectiveManagementService.store(data).subscribe(async () => {
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastSuccess("Producto agregado correctamente");
      this.close();
    }, async () => {
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastError("Error al agregar el producto");
      this.close();
    })
  }

  async close() {
    await this.modalController.dismiss()
  }

}
