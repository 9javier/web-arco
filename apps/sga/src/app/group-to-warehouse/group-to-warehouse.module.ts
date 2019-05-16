import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';

import { GroupToWarehouseComponent } from './group-to-warehouse.component';
import {RouterModule, Routes} from "@angular/router";


const routes: Routes = [
  {
    path: '',
    component: GroupToWarehouseComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatListModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GroupToWarehouseComponent]
})
export class GroupToWarehouseModule {}
