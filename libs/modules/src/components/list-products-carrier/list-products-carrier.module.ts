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

@NgModule({
  entryComponents: [ListProductsCarrierComponent],
  declarations: [ListProductsCarrierComponent],
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
    PopoverFiltersModule
  ],
  exports: [ListProductsCarrierComponent]
})
export class ListProductsCarrierModule { }
