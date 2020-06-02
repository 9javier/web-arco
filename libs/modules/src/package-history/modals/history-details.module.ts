import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HistoryDetailsComponent } from './history-details.component';
import { MatTooltipModule } from '@angular/material';



@NgModule({
  declarations: [HistoryDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    MatTooltipModule
  ],
  entryComponents: [
    HistoryDetailsComponent
  ]
})
export class HistoryDetailsModule {}
