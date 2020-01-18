import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProductsCarrierComponent } from './list-products-carrier.component';
import { IonicModule } from '@ionic/angular';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatTableModule
} from '@angular/material';
import { PaginatorComponentModule } from '../paginator/paginator.component.module';
import { PopoverFiltersModule } from '../../audits-mobile/sccaner-product/popover-filters/popover-filters.module';
import { TagsInputModule } from '../tags-inputag/tags-input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FiltersListComponent } from './filters-list/filters-list.component';

@NgModule({
  entryComponents: [ListProductsCarrierComponent, FiltersListComponent],
  declarations: [ListProductsCarrierComponent, FiltersListComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    PaginatorComponentModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    PopoverFiltersModule,
    TagsInputModule,
    ReactiveFormsModule
  ],
  exports: [ListProductsCarrierComponent]
})
export class ListProductsCarrierModule { }
