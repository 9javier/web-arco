import { Component, OnInit } from '@angular/core';
import { UserModel } from '@suite/services';
import { COLLECTIONS } from 'config/base';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'suite-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  title = 'Usuarios';
  displayedColumns: string[] = ['id', 'name', 'email', 'select'];
  columns: string[] = ['id', 'name', 'email'];
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Users')
    .name;
  routePath = '/users';

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
