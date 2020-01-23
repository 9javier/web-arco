import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarSgaComponent } from './calendar-sga.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatListModule, MatCheckboxModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { TagsInputModule } from '../components/tags-inputag/tags-input.module';
import { ModalsModule } from './modals/modals.module';
import { MatTooltipModule } from "@angular/material";

const routes: Routes = [
  {
    path: '',
    component: CalendarSgaComponent
  }
];

@NgModule({
  declarations: [CalendarSgaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IonicModule,
    DpDatePickerModule,
    FormsModule,
    MatExpansionModule,
    MatListModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    BreadcrumbModule,
    TagsInputModule,
    ModalsModule,
    MatTooltipModule
  ]
})
export class CalendarSgaModule { }
