import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFiltersComponent } from './table-filters.component';
import { MatListModule } from '@angular/material';
import { MatCheckboxModule, MatSortModule, MatTableModule,MatRippleModule, MatPaginatorModule } from '@angular/material';
import { FilterButtonModule } from "../../components/filter-button/filter-button.module";
import { PaginatorComponentModule } from '../../components/paginator/paginator.component.module';

@NgModule({
  declarations: [TableFiltersComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatListModule,
    MatCheckboxModule,
    MatSortModule, 
    MatTableModule,
    FilterButtonModule,
    MatRippleModule,
    MatPaginatorModule,
    PaginatorComponentModule,
  ],
  exports:[TableFiltersComponent]
})
export class TableFiltersModule { }
