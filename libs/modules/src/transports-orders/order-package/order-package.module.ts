import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPackageComponent } from './order-package.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule, MatCheckboxModule, MatListModule, MatTableModule, MatPaginatorModule, MatExpansionModule } from '@angular/material';
import { FilterButtonModule } from '../../components/filter-button/filter-button.module';
import { PaginatorComponentModule } from '../../components/paginator/paginator.component.module';
import {
  MatRippleModule,
  MatSortModule,
} from '@angular/material';
@NgModule({
  declarations: [OrderPackageComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCheckboxModule,
    FilterButtonModule,
    PaginatorComponentModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatRippleModule,
    MatSortModule,
  ], 
  exports: [OrderPackageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderPackageModule { }
