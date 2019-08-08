import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyComponent } from './agency.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AgencyComponent
  }
];

@NgModule({
  declarations: [AgencyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AgencyModule { }
