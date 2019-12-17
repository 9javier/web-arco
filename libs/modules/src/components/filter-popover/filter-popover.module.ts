import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPopoverComponent } from './filter-popover.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule, MatInputModule, MatTooltipModule} from "@angular/material";
@NgModule({
  entryComponents:[ FilterPopoverComponent ],
  declarations: [ FilterPopoverComponent ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  exports:[ FilterPopoverComponent ]
})
export class FilterPopoverModule { }
