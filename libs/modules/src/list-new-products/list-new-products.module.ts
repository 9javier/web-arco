import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ListNewProductsComponent } from './list-new-products.component';
import {MatListModule} from '@angular/material/list';

import { VirtualKeyboardModule } from '../components/virtual-keyboard/virtual-keyboard.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {MatRadioModule} from "@angular/material/radio";
// import {ComponentsModule} from "..";


const routes: Routes = [
  {
    path: '',
    component: ListNewProductsComponent
  }
];
@NgModule({
  declarations: [ListNewProductsComponent],
  entryComponents: [ListNewProductsComponent],
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
    MatListModule,
    MatRadioModule,
    ReactiveFormsModule,
    // ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListNewProductsComponentModule { }
