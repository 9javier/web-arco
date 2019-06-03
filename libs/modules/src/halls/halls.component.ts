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
  displayedColumns: string[] = ['hall', 'rows', 'columns', 'select'];
  columns: any[] = [{name: 'ID', value: 'id'}, {name: 'Pasillo', value: 'hall'}, {name: 'Nº alturas', value: 'rows'}, {name: 'Nº columnas', value: 'columns'}];
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
