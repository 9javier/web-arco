import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverFiltersComponent } from './popover-filters.component';
import {IonicModule} from "@ionic/angular";
import {MatChipsModule, MatDividerModule, MatIconModule, MatSelectModule} from "@angular/material";

@NgModule({
  entryComponents:[ PopoverFiltersComponent ],
  declarations: [ PopoverFiltersComponent ],
  imports: [
    IonicModule,
    CommonModule,
    MatChipsModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule
  ],
  exports: [ PopoverFiltersComponent ]
})

export class PopoverFiltersModule { }
