import { Component, OnInit } from '@angular/core';
import { COLLECTIONS } from 'config/base';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-pallets',
  templateUrl: './pallets.component.html',
  styleUrls: ['./pallets.component.scss']
})

export class PalletsComponent implements OnInit {
  public title = 'Palets';
  public displayedColumns: string[] = ['select', 'reference', 'buttons-print' ];
  public columns: any[] = [{name: 'ID', value: 'id'}, {name: 'Referencia', value: 'reference'}];
  public apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Pallets').name;
  public routePath = '/pallets';

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
