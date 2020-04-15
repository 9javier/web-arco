import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkwaveConfigMenuComponent } from './workwave-config-menu.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatListModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatIconModule} from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { MatTooltipModule } from "@angular/material";
import { UsersReplenishmentComponent } from './users-replenishment/users-replenishment.component'

const routes: Routes = [
  {
    path: '',
    component: WorkwaveConfigMenuComponent
  }
];

@NgModule({
  declarations: [WorkwaveConfigMenuComponent, UsersReplenishmentComponent],
  entryComponents: [UsersReplenishmentComponent],
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
    MatTooltipModule,
    MatFormFieldModule,
    MatIconModule
  ]
})
export class WorkwaveConfigMenuModule { }
