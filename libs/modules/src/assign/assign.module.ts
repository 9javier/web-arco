import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

import { AssignRoutingModule } from './assign-routing.module';
import { PermissionToRolComponent } from './permission-to-rol/permission-to-rol.component';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { ModalsModule } from './permission-to-rol/modals/modals.module';


@NgModule({
  declarations: [PermissionToRolComponent],
  imports: [
    CommonModule,
    AssignRoutingModule,
    ReactiveFormsModule,
    IonicModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatListModule,
    BreadcrumbModule,
    MatTableModule,
    ModalsModule

  ],
  exports: [PermissionToRolComponent]
})
export class AssignModule {}
