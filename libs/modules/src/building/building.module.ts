import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingComponent } from './building.component';
import { InformationComponent } from './modals/information/information.component';
import { StoreComponent } from './modals/store/store.component';
import { UpdateComponent } from './modals/update/update.component';
import { Routes, RouterModule } from '@angular/router';
import { MatListModule, MatTableModule, MatPaginatorModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: BuildingComponent
  }
];

@NgModule({
  declarations: [BuildingComponent, InformationComponent, StoreComponent, UpdateComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MatListModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class BuildingModule { }
