import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TariffSGAComponent } from './tariffSGA.component';
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';

const routes:Routes = [
  {
    path: '',
    component: TariffSGAComponent
  }
]; 

@NgModule({
  declarations: [TariffSGAComponent],
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
    PaginatorComponentModule
  ]
})
export class TariffSGAModule { }
