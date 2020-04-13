import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from "@angular/material";
import { DefectiveManagementComponent } from './defective-management.component';
import { StoreModule } from './modals/store/store.module';
import { UpdateModule } from './modals/update/update.module';

const routes: Routes = [
  {
    path: '',
    component: DefectiveManagementComponent
  }
];

@NgModule({
  declarations: [DefectiveManagementComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    StoreModule,
    UpdateModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class DefectiveManagementModule { }
