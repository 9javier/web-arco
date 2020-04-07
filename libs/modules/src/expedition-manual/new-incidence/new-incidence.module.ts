import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule } from '@angular/material';
import { RouterModule, Routes } from "@angular/router";
import { MatTooltipModule } from "@angular/material";
import { NewIncidenceComponent } from './new-incidence.component';
import {MatTabsModule} from '@angular/material/tabs';
import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { NgxFileDropModule } from  'ngx-file-drop' ;



@NgModule({
  exports: [NewIncidenceComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    FormsModule,
    MatCheckboxModule,
    MatRippleModule,
    MatSortModule,
    NgxFileDropModule,
    MatTabsModule
  ],
  declarations: [NewIncidenceComponent]
})
export class NewIncidenceModule { }
