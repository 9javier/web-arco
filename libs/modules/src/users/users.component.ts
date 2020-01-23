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
  displayedColumns: string[] = ['name', 'email', 'address', 'select'];
  columns: any[] = [{name: 'Nombre', value: 'name'}, {name: 'Usuario', value: 'email'}, {name: 'Dirección', value: 'address'}];
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Users')
    .name;
  routePath = '/users';
  tooltipMessage = 'Agregar usuario';

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
