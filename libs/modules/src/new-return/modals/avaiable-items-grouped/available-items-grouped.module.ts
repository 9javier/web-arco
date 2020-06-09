import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailableItemsGroupedComponent } from './available-items-grouped.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import { ScrollingModule as ExperimentalScrollingModule} from "@angular/cdk-experimental/scrolling";
import {ScrollingModule} from "@angular/cdk/scrolling";

@NgModule({
  declarations: [AvailableItemsGroupedComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CommonModule,
    MatListModule,
    MatIconModule,
    ScrollingModule,
    ExperimentalScrollingModule
  ],
  entryComponents: [AvailableItemsGroupedComponent]
})
export class AvailableItemsGroupedModule { }
