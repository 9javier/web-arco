import { Component, OnInit } from '@angular/core';
import { COLLECTIONS } from 'config/base';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'suite-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent implements OnInit {
  title = 'Almacenes';
  displayedColumns: string[] = ['select', 'name', 'description', 'reference', 'buttons-warehouse'];
  columns: string[] = ['name', 'description', 'reference'];
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Warehouses')
    .name;
  routePath = '/warehouses';

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
