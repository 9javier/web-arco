import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { HallsRoutingModule } from "./halls-routing.module";
import { HallsComponent } from "./halls.component";
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import { MatTooltipModule } from "@angular/material";


@NgModule({
  declarations: [HallsComponent, StoreComponent, UpdateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    HallsRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    MatTooltipModule
  ],
  entryComponents: [
    StoreComponent
  ]
})
export class HallsModule {}
