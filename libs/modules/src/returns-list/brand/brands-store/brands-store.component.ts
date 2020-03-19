import { Component, OnInit,ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { IntermediaryService } from '@suite/services';
import { BrandsDataComponent } from '../brands-data/brands-data.component';
import { DefectiveManagementService } from '../../../../../services/src/lib/endpoint/defective-management/defective-management.service';
import { DefectiveManagementModel } from '../../../../../services/src/models/endpoints/defective-management-model';

@Component({
  selector: 'suite-store',
  templateUrl: './brands-store.component.html',
  styleUrls: ['./brands-store.component.scss']
})
export class BrandsStoreComponent implements OnInit {
  @ViewChild(BrandsDataComponent) data:BrandsDataComponent;

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
