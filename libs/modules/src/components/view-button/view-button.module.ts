import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewButtonComponent } from './view-button.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {ViewPopoverModule} from "../view-popover/view-popover.module";
import {MatTooltipModule} from "@angular/material";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatRippleModule} from "@angular/material/core";
@NgModule({
  entryComponents:[ ViewButtonComponent ],
  declarations: [ ViewButtonComponent ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ViewPopoverModule,
    MatTooltipModule,
    NgxMaterialTimepickerModule,
    MatRippleModule
  ],
  exports:[ ViewButtonComponent ]
})
export class ViewButtonModule { }
