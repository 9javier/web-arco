import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InfoComponent } from '../info/info.component';
import { IntermediaryService, RegionService, RegionsModel } from "@suite/services";

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  @ViewChild(InfoComponent) information:InfoComponent;

  constructor(
    private modalController: ModalController,
    private intermediaryService: IntermediaryService,
    private regionService: RegionService 
  ) { }

  ngOnInit() {
    console.log(this.information.form.invalid)
  }

  store(region: RegionsModel.Regions) {
    this.intermediaryService.presentLoading();
    this.regionService.store(region).subscribe(resp => {
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess('Region creada exitosament').then(resp =>{
        this.close()
      });
    },e => {
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError(e.error.errors).then(resp => {
        this.close();
      })
    });
  }

  async close() {
    await this.modalController.dismiss()
  }
}
