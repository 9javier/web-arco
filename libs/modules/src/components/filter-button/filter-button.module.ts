import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterButtonComponent } from './filter-button.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {FilterPopoverModule} from "../filter-popover/filter-popover.module";
import {MatTooltipModule} from "@angular/material";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatRippleModule} from "@angular/material/core";
@NgModule({
  entryComponents:[ FilterButtonComponent ],
  declarations: [ FilterButtonComponent ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FilterPopoverModule,
    MatTooltipModule,
    NgxMaterialTimepickerModule,
    MatRippleModule
  ],
  exports:[ FilterButtonComponent ]
})
export class FilterButtonModule { }
