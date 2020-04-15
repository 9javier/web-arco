import { Component, OnInit,ViewChild } from '@angular/core';
import { BrandsDataComponent } from '../brands-data/brands-data.component';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'suite-brands-store',
  templateUrl: './brands-store.component.html',
  styleUrls: ['./brands-store.component.scss']
})

export class BrandsStoreComponent implements OnInit {
  @ViewChild(BrandsDataComponent) data:BrandsDataComponent;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  async submit(data: any) {
    await this.modalController.dismiss(data)
  }

  async close() {
    await this.modalController.dismiss()
  }

}
