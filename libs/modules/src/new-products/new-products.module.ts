import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BreadcrumbModule, NewProductsComponent } from '@suite/common-modules';
import { ReactiveFormsModule } from '@angular/forms';
import { TagsInputModule } from '../components/tags-inputag/tags-input.module';
import {
  MatCheckboxModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatRippleModule,
  MatTableModule
} from '@angular/material';
import { ResponsiveLayoutModule } from '../components/responsive-layout/responsive-layout.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';

const routes: Routes = [
  {
    path: '',
    component: NewProductsComponent,
  }
];

@NgModule({
  declarations: [NewProductsComponent],
  entryComponents: [NewProductsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IonicModule,
    BreadcrumbModule,
    ReactiveFormsModule,
    TagsInputModule,
    MatTableModule,
    MatCheckboxModule,
    MatRippleModule,
    MatPaginatorModule,
    ResponsiveLayoutModule,
    PaginatorComponentModule,
    MatExpansionModule
  ]
})
export class NewProductsModule { }
