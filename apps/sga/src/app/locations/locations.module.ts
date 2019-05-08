import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { LocationsRoutingModule } from "./locations-routing.module";
import { LocationsComponent } from "./locations.component";
import { UpdateComponent } from './update/update.component';
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListComponent} from "./list/list.component";


@NgModule({
  declarations: [LocationsComponent, UpdateComponent, ListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    LocationsRoutingModule,
    CommonUiCrudModule,
    CdkTableModule
  ],
  entryComponents: [
    ListComponent
  ]
})
export class LocationsModule {}
