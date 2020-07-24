import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
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
import { TableFiltersModule } from "../components/table-filters/table-filters.component.module";
import {EditCustomerComponent} from './edit-customer/edit-customer.component'
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent
  }
];
@NgModule({
  declarations: [CustomersComponent,EditCustomerComponent],
  entryComponents: [CustomersComponent,EditCustomerComponent],
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
    TableFiltersModule,
    MatTabsModule,
    MatExpansionModule,
    MatSelectModule,
  ],
  providers:[EditCustomerComponent],
})
export class CustomersComponentModule { }
