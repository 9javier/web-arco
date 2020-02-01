import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule } from '@angular/material';
import { MatListModule } from '@angular/material';
import { ProductsAlComponent } from './products-al.component';
import { RouterModule, Routes } from "@angular/router";
import { MatPaginatorModule } from '@angular/material';
import { ProductDetailsAlModule } from './modals-al/product-details-al/product-details-al.module';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { MatTooltipModule } from "@angular/material";

const routes: Routes = [
  {
    path: '',
    component: ProductsAlComponent
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
    ProductDetailsAlModule,
    TagsInputModule,
    PaginatorComponentModule,
    MatTooltipModule,
  ],
  declarations: [ProductsAlComponent]
})
export class ProductsAlModule {}
