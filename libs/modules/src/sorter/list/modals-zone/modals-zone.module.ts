import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from './store/store.module';
import { UpdateModule } from './update/update.module';
import { WarehousesModalModule } from './warehouses-modal/warehouses-modal.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule,
    UpdateModule,
    WarehousesModalModule
  ]
})
export class ModalsZoneModule { }
