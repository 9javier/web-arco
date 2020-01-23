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
  displayedColumns: string[] = ['select', 'reference', 'name', 'description', 'buttons-warehouse'];
  columns: any[] = [{name: 'Nombre', value: 'name'}, {name: 'Descripción', value: 'description'}, {name: 'Referencia', value: 'reference'}];
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Warehouses')
    .name;
  routePath = '/warehouses';
  tooltipMessage: string[] = ['Agregar un Almacen','Eliminar de Almacen'];

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
