import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterItemsListComponent } from './filter-items-list.component';
import {MatButtonModule, MatIconModule, MatInputModule, MatListModule, MatRippleModule, MatTooltipModule} from "@angular/material";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [FilterItemsListComponent],
  entryComponents: [FilterItemsListComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatListModule,
    MatRippleModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  exports: [FilterItemsListComponent]
})

export class FilterItemsListModule {}
