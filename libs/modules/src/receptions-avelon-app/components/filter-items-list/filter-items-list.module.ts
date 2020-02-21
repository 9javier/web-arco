import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterItemsListComponent } from './filter-items-list.component';
import {MatListModule, MatRippleModule, MatTooltipModule} from "@angular/material";

@NgModule({
  declarations: [FilterItemsListComponent],
  entryComponents: [FilterItemsListComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatListModule,
    MatRippleModule,
    MatTooltipModule
  ],
  exports: [FilterItemsListComponent]
})

export class FilterItemsListModule {}
