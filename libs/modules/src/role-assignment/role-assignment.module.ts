import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleAssignmentComponent } from './role-assignment.component';
import { IonicModule } from '@ionic/angular';
import { BreadcrumbModule, ComponentsModule } from '@suite/common-modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResponsiveLayoutModule } from '../components/responsive-layout/responsive-layout.module';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatExpansionModule, MatFormFieldModule, MatIconModule,
  MatListModule, MatSelectModule,
  MatSlideToggleModule,
  MatTableModule, MatTooltipModule
} from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: RoleAssignmentComponent
  }
];

@NgModule({
  declarations: [RoleAssignmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IonicModule,
    ResponsiveLayoutModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class RoleAssignmentModule { }
