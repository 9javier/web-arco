import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleAssignmentComponent } from './role-assignment.component';
import { IonicModule } from '@ionic/angular';
import { FilterButtonModule } from '@suite/common-modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResponsiveLayoutModule } from '../components/responsive-layout/responsive-layout.module';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule, MatIconModule, MatInputModule,
  MatSelectModule,
  MatTableModule, MatTooltipModule
} from '@angular/material';
import { AddRoleAssignmentComponent } from './add-role-assignment/add-role-assignment.component';
import { FiltersRoleAssignmentComponent } from './filters-role-assignment/filters-role-assignment.component';

const routes: Routes = [
  {
    path: '',
    component: RoleAssignmentComponent
  }
];

@NgModule({
  declarations: [RoleAssignmentComponent, AddRoleAssignmentComponent, FiltersRoleAssignmentComponent],
  entryComponents: [AddRoleAssignmentComponent, FiltersRoleAssignmentComponent],
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
    MatTooltipModule,
    MatInputModule,
  ]
})
export class RoleAssignmentModule { }
