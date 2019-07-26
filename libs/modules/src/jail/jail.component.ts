import { Component, OnInit } from '@angular/core';
import { COLLECTIONS } from 'config/base';
import {ModalController} from "@ionic/angular";
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import { CarrierService, WarehouseModel } from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { WarehouseService } from 'libs/services/src/lib/endpoint/warehouse/warehouse.service';

@Component({
  selector: 'app-jail',
  templateUrl: './jail.component.html',
  styleUrls: ['./jail.component.scss'],
  animations:  [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class JailComponent implements OnInit {
  public title = 'Jaulas';
 // public displayedColumns: string[] = ['select', 'reference', 'buttons-print' ];
  public columns: any[] = [{name: 'ID', value: 'id'}, {name: 'Referencia', value: 'reference'}];
  public apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers').name;
  public routePath = '/jails';

  displayedColumns = ['select', 'reference', 'packing', 'warehouse','buttons-print'];
  dataSource:MatTableDataSource<CarrierModel.Carrier>;
  expandedElement:CarrierModel.Carrier;
  
  carriers:Array<CarrierModel.Carrier> = [];
  warehouses:Array<WarehouseModel.Warehouse> = [];

  constructor(
    private modalCtrl:ModalController,
    private carrierService:CarrierService,
    private warehouseService:WarehouseService
    ) {
  }

  ngOnInit() {
    this.getCarriers();
    this.getWarehouses();
  }

  getCarriers():void{
    this.carrierService.getIndex().subscribe(carriers=>{
      this.carriers = carriers;
      this.dataSource = new MatTableDataSource(carriers)
    })
  }

  getWarehouses(){
    this.warehouseService.getIndex().then(observable=>{
      observable.subscribe(response=>{
        this.warehouses = (<any>response.body).data;
      });
    })
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




