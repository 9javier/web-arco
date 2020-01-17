import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TariffSGAComponent } from './tariffSGA.component';
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatDatepickerModule, MatInputModule, MatTooltipModule, MatIconModule
} from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { TariffUpdateFilterPriceComponent } from './tariff-update-filter-price/tariff-update-filter-price.component';

const routes:Routes = [
  {
    path: '',
    component: TariffSGAComponent
  }
];

@NgModule({
  declarations: [TariffSGAComponent, TariffUpdateFilterPriceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
    TagsInputModule,
    PaginatorComponentModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule
  ],
  entryComponents: [
    TariffUpdateFilterPriceComponent
  ]
})
export class TariffSGAModule { }
