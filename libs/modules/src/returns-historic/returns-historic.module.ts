import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { MatPaginatorModule, MatTooltipModule, MatTableModule } from "@angular/material";
import { IonicModule } from '@ionic/angular';
import { ReturnsHistoricComponent } from './returns-historic.component';
import { FilterButtonModule } from "../components/filter-button/filter-button.module";

const routes: Routes = [{
    path: '',
    component: ReturnsHistoricComponent
}];

@NgModule({
  declarations: [ReturnsHistoricComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatPaginatorModule,
    MatTooltipModule,
    MatTableModule,
    FilterButtonModule
  ]
})

export class ReturnsHistoricModule {}
