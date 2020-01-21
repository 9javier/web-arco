import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {IncidencesListComponent} from "./incidences-list.component";
import {IncidenceComplexModule} from "../incidence-complex/incidence-complex.module";
import { MatListModule, MatPaginatorModule, MatTableModule, MatTooltipModule } from '@angular/material';
import {RouterModule, Routes} from "@angular/router";
import {FiltersIncidencesComponent} from "./filters/filters.component";
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';

const routes: Routes = [
  {
    path: '',
    component: IncidencesListComponent
  }
];

@NgModule({
  declarations: [IncidencesListComponent, FiltersIncidencesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    IncidenceComplexModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    RouterModule.forChild(routes),
    FormsModule,
    PaginatorComponentModule,
    MatTooltipModule
  ], entryComponents: [IncidencesListComponent, FiltersIncidencesComponent]
})
export class IncidencesListModule { }
