import { Component, OnInit } from '@angular/core';
import { COLLECTIONS } from 'config/base';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'suite-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  title = 'Ubicaciones';
  displayedColumns: any[] = ['icon', 'hall', 'use', 'locations', 'dropdown'];
  columns: any[] = [{name: 'Pasillos', value: 'hall'}, {name: 'Utilización', value: 'use'}, {name: 'Ubicaciones', value: 'locations'}];
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Warehouses Maps')
    .name;
  routePath = '/locations';


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
