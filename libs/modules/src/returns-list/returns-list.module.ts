import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
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
import { ReturnsListComponent } from './returns-list.component';
import { ShowImageModule } from '../components/modal-defective/show-image/show-image.module';
import { BrandsModule } from './brand/brands.module';
import { ReturnsModule } from './returns/returns.module';

const routes: Routes = [
  {
    path: '',
    component: ReturnsListComponent
  }
];

@NgModule({
  declarations: [ReturnsListComponent],
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
    ShowImageModule,
    BrandsModule,
    ReturnsModule
  ]
})
export class ReturnsListModule { }
