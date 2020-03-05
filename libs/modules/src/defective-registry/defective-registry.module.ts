import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule,
  MatRadioModule
} from '@angular/material';
import { FilterButtonModule } from '../components/filter-button/filter-button.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { DefectiveRegistryComponent } from './defective-registry.component';
import { RegistryDetailsModule } from './modals/registry-details/registry-details.module';

const routes: Routes = [
  {
    path: '',
    component: DefectiveRegistryComponent
  }
];

@NgModule({
  declarations: [DefectiveRegistryComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRippleModule,
    MatSortModule,
    FilterButtonModule,
    PaginatorComponentModule,
    MatTooltipModule,
    MatRadioModule,
    FormsModule,
    RegistryDetailsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DefectiveRegistryModule { }
