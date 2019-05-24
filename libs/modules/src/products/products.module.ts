import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { ProductsComponent } from './products.component';
import { RouterModule, Routes } from "@angular/router";
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginatorModule} from '@angular/material';


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
    RouterModule.forChild(routes)
  ],
  declarations: [ProductsComponent]
})
export class ProductsModule {}
