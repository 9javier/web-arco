import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarPickingComponent } from './calendar-picking.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatListModule, MatCheckboxModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: CalendarPickingComponent
  }
];

@NgModule({
  declarations: [CalendarPickingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IonicModule,
    DpDatePickerModule,
    FormsModule,
    MatExpansionModule,
    MatListModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ]
})
export class CalendarPickingModule { }
