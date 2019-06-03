import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { WarehousesRoutingModule } from "./warehouses-routing.module";
import { WarehousesComponent } from "./warehouses.component";
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import { CommonUiCrudModule } from '../../../common/ui/crud/src//lib/common-ui-crud.module';
import { ComponentsModule } from '../components/components.module';


@NgModule({
  declarations: [WarehousesComponent, StoreComponent, UpdateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    WarehousesRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    ComponentsModule
  ],
  entryComponents: [
    StoreComponent
  ]
})
export class WarehousesModule {}
