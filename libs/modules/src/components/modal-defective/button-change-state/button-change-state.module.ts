import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonChangeStateComponent } from './button-change-state.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ButtonChangeStateComponent],
  exports: [
    ButtonChangeStateComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ButtonChangeStateModule { }
