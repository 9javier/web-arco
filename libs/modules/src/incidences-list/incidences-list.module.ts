import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {IncidencesListComponent} from "./incidences-list.component";
import {IncidenceComplexModule} from "../incidence-complex/incidence-complex.module";
import {MatListModule, MatPaginatorModule, MatTableModule} from "@angular/material";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: IncidencesListComponent
  }
];

@NgModule({
  declarations: [IncidencesListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    IncidenceComplexModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    RouterModule.forChild(routes)
  ], entryComponents: [IncidencesListComponent]
})
export class IncidencesListModule { }
