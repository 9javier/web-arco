import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkwaveConfigMenuComponent } from './workwave-config-menu.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { MatTooltipModule } from "@angular/material";

const routes: Routes = [
  {
    path: '',
    component: WorkwaveConfigMenuComponent
  }
];

@NgModule({
  declarations: [WorkwaveConfigMenuComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatTooltipModule
  ]
})
export class WorkwaveConfigMenuModule { }
