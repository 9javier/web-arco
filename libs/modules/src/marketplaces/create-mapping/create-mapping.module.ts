import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CreateMappingComponent } from './create-mapping.component';

import {MatSelectModule} from '@angular/material/select';

const routes: Routes = [
  {
    path: '',
    component: CreateMappingComponent
  } 
]

@NgModule({
  declarations: [CreateMappingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule
  ]
})
export class CreateMappingModule { }
