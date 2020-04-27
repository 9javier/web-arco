import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalVariablesComponent } from './global-variables.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { ModalsModule } from './modals/modals.module';
import { MatTooltipModule } from "@angular/material";
import { UsersReplenishmentGlobalVarComponent } from './users-replenishment-global-var/users-replenishment-global-var.component';
import {
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatSelectModule
} from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: GlobalVariablesComponent
  }
];

@NgModule({
  declarations: [GlobalVariablesComponent, UsersReplenishmentGlobalVarComponent],
  entryComponents: [UsersReplenishmentGlobalVarComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    ModalsModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class GlobalVariablesModule { }
