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
import {MoveProductsComponent} from "./modals/move-products/move-products.component";
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { MatTooltipModule } from "@angular/material";


@NgModule({
  declarations: [LocationsComponent, UpdateComponent, ListComponent, MoveProductsComponent],
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
    PipesModule,
    BreadcrumbModule,
    MatTooltipModule
  ],
  entryComponents: [
    ListComponent,
    MoveProductsComponent
  ]
})
export class LocationsModule {}
