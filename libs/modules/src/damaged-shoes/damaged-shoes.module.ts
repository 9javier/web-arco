import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResponsiveLayoutModule } from '../components/responsive-layout/responsive-layout.module';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule, MatIconModule, MatInputModule,
  MatSelectModule,
  MatTableModule, MatTooltipModule
} from '@angular/material';
import { DamagedShoesComponent } from './damaged-shoes.component';
import { AddDamagedShoesComponent } from './add-damaged-shoes/add-damaged-shoes.component';
import { FiltersDamagedShoesComponent } from './filters-damaged-shoes/filters-damaged-shoes.component';

const routes: Routes = [
  {
    path: '',
    component: DamagedShoesComponent
  }
];

@NgModule({
  declarations: [DamagedShoesComponent, AddDamagedShoesComponent, FiltersDamagedShoesComponent],
  entryComponents: [AddDamagedShoesComponent, FiltersDamagedShoesComponent],
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

export class DamagedShoesModule { }
