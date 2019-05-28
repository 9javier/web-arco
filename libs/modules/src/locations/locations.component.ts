import { Component, OnInit } from '@angular/core';
import { COLLECTIONS } from 'config/base';
import {ModalController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'suite-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  title = 'Ubicaciones';
  displayedColumns: any[] = ['icon', 'hall','rows','columns', 'use', 'locations',"update", 'dropdown'];
  columns: any[] = [{name: 'Pasillos', value: 'hall'}, {name:"Filas",value:"rows"},{name:"Columnas",value:"columns"},{name: 'Utilización', value: 'use'}, {name: 'Ubicaciones', value: 'locations'}];
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Warehouses Maps')
    .name;
  routePath = '/locations';
  origin: string = 'list';


  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: any )=> {
      let paramsReceived = params.params;
      if (typeof paramsReceived.id == 'string' && paramsReceived.id == 'manage') {
        this.origin = 'manage';
      }
    });
  }

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
