import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule , MatTabsModule, MatExpansionModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { LocationsRoutingModule } from "./locations-routing.module";
import { LocationsComponent } from "./locations.component";
import { UpdateComponent } from './update/update.component';
import { CommonUiCrudModule } from '../../../common/ui/crud/src/lib/common-ui-crud.module';
import {ListComponent} from "./list/list.component";
import {HallsModule} from '../halls/halls.module';
import { EnableLockContainerModule } from './modals/enable-lock-container/enable-lock-container.module';
import { PipesModule } from "../../../pipes/src";



@NgModule({
  declarations: [LocationsComponent, UpdateComponent, ListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    LocationsRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    HallsModule,
    EnableLockContainerModule,
    PipesModule
  ],
  entryComponents: [
    ListComponent
  ]
})
export class LocationsModule {}
