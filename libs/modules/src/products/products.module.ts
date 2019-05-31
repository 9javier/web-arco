import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { ProductsComponent } from './products.component';
import { RouterModule, Routes } from "@angular/router";
import {MatPaginatorModule} from '@angular/material';
import { ProductDetailsModule } from './modals/product-details/product-details.module';


const routes: Routes = [
  {
    path: '',
    component: ProductsComponent
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
    RouterModule.forChild(routes),
    ProductDetailsModule
  ],
  declarations: [ProductsComponent]
})
export class ProductsModule {}
