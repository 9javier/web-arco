import { Component, OnInit,ViewChild } from '@angular/core';
import { DataComponent } from '../data/data.component';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  @ViewChild(DataComponent) data:DataComponent;

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
