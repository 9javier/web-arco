import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleAssignmentComponent } from './role-assignment.component';

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
  ]
})
export class RoleAssignmentModule { }
