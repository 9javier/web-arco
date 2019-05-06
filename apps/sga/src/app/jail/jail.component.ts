import { Component, OnInit } from '@angular/core';
import { COLLECTIONS } from 'config/base';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-jail',
  templateUrl: './jail.component.html',
  styleUrls: ['./jail.component.scss']
})

export class JailComponent implements OnInit {
  public title = 'Jaulas';
  public displayedColumns: string[] = ['id', 'reference', 'select'];
  public columns: string[] = ['id', 'reference'];
  public apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers').name;
  public routePath = '/jails';

  constructor(private modalCtrl:ModalController) {
  }

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




