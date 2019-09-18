import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from './store/store.module';
import { UpdateModule } from './update/update.module';
import { WarehousesModalModule } from './warehouses-modal/warehouses-modal.module';
import { RailsConfigurationModule} from './rails-configuration/rails-configuration.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule,
    UpdateModule,
    WarehousesModalModule,
    RailsConfigurationModule
  ]
})
export class ModalsZoneModule { }
