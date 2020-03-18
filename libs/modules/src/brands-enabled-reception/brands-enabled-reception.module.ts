import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule } from '@angular/material';
import { BrandsEnabledReceptionComponent } from './brands-enabled-reception.component';
import { RouterModule, Routes } from "@angular/router";
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { FilterButtonModule } from "../components/filter-button/filter-button.module";
import { MatTooltipModule } from "@angular/material";
import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: BrandsEnabledReceptionComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
    TagsInputModule,
    PaginatorComponentModule,
    FilterButtonModule,
    MatTooltipModule,
    FormsModule,
    MatCheckboxModule,
    MatRippleModule,
    MatSortModule
  ],
  declarations: [BrandsEnabledReceptionComponent]
})
export class BrandsEnabledReceptionModule { }
