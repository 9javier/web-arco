import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualReceptionComponent } from './manual-reception.component';
import {MatButtonModule, MatIconModule, MatListModule, MatRippleModule} from "@angular/material";
import {FilterItemsListModule} from "../filter-items-list/filter-items-list.module";
import {LoadingMessageModule} from "../../../components/loading-message/loading-message.module";

@NgModule({
  declarations: [ManualReceptionComponent],
  entryComponents: [ManualReceptionComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    FilterItemsListModule,
    LoadingMessageModule
  ],
  exports: [ManualReceptionComponent]
})

export class ManualReceptionModule {}
