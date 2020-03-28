import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {IncidencesReceptionListComponent} from "./incidences-reception-list.component";
import {IncidenceComplexModule} from "../incidence-complex/incidence-complex.module";
import {
  MatListModule, MatOptionModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from "@angular/material";
import {RouterModule, Routes} from "@angular/router";
import {FiltersIncidencesComponent} from "./filters/filters.component";
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import {FilterButtonModule} from "../components/filter-button/filter-button.module";

const routes: Routes = [
  {
    path: '',
    component: IncidencesReceptionListComponent
  }
];

@NgModule({
  declarations: [IncidencesReceptionListComponent, FiltersIncidencesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    IncidenceComplexModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatSortModule,
    RouterModule.forChild(routes),
    FormsModule,
    PaginatorComponentModule,
    MatTooltipModule,
    FilterButtonModule,
    MatSelectModule,
    MatOptionModule
  ], entryComponents: [IncidencesReceptionListComponent, FiltersIncidencesComponent]
})
export class IncidencesReceptionListModule { }
