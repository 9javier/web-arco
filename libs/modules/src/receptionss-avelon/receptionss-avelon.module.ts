import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ReceptionssAvelonComponent } from './receptionss-avelon.component';

import { VirtualKeyboardModule } from '../components/virtual-keyboard/virtual-keyboard.module';
import { FormsModule } from '@angular/forms';
import { useAnimation, transition, trigger, style, animate } from '@angular/animations';
import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { FilterButtonModule } from '../components/filter-button/filter-button.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { MatTooltipModule } from "@angular/material";


const routes: Routes = [
  {
    path: '',
    component: ReceptionssAvelonComponent
  }
];
@NgModule({
  declarations: [ReceptionssAvelonComponent],
  entryComponents: [ReceptionssAvelonComponent ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild(routes),
    VirtualKeyboardModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatCheckboxModule,
    MatRippleModule,
    MatPaginatorModule,
    MatSortModule,
    FilterButtonModule,
    PaginatorComponentModule,
    MatTooltipModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReceptionssAvelonModule { }
