import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeStateComponent } from './change-state.component';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [ChangeStateComponent],
  entryComponents: [ChangeStateComponent],
  exports: [ChangeStateComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatTooltipModule,
    MatExpansionModule
  ]
})
export class ChangeStateModule { }
