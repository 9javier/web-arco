import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterButtonComponent } from './filter-button.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {FilterPopoverModule} from "../filter-popover/filter-popover.module";
import {MatTooltipModule} from "@angular/material";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
@NgModule({
  entryComponents:[ FilterButtonComponent ],
  declarations: [ FilterButtonComponent ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FilterPopoverModule,
    MatTooltipModule,
    NgxMaterialTimepickerModule
  ],
  exports:[ FilterButtonComponent ]
})
export class FilterButtonModule { }
