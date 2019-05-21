import { Component, OnInit } from '@angular/core';
import { COLLECTIONS } from 'config/base';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'suite-halls',
  templateUrl: './halls.component.html',
  styleUrls: ['./halls.component.scss']
})
export class HallsComponent implements OnInit {
  title = 'Pasillos';
  displayedColumns: string[] = ['id', 'hall', 'rows', 'columns', 'select'];
  columns: string[] = ['id', 'hall', 'rows', 'columns'];
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Warehouses Maps')
    .name;
  routePath = '/halls';

  constructor(private modalCtrl:ModalController) {}

  ngOnInit() {}

  closeModal()
  {
    this.modalCtrl.dismiss();
  }
  async moveToFirst()
  {
    const modal = await this.modalCtrl.create({
      component: 'StoreComponent'
    });

    return await modal.present();
  }

}
