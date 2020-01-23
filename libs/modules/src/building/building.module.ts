import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingComponent } from './building.component';
import { InformationComponent } from './modals/information/information.component';
import { StoreComponent } from './modals/store/store.component';
import { UpdateComponent } from './modals/update/update.component';
import { Routes, RouterModule } from '@angular/router';
import { MatListModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from "@angular/material";

const routes: Routes = [
  {
    path: '',
    component: BuildingComponent
  }
];

@NgModule({
  declarations: [BuildingComponent, InformationComponent, StoreComponent, UpdateComponent],
  entryComponents: [InformationComponent, StoreComponent, BuildingComponent, UpdateComponent],
  imports: [
    ReactiveFormsModule,
    IonicModule,
    CommonModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule
  ]
})
export class BuildingModule { }
