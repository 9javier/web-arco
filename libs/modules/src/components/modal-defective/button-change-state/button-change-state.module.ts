import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonChangeStateComponent } from './button-change-state.component';
import { IonicModule } from '@ionic/angular';
import { ChangeStateModule } from '../change-state/change-state.module';

@NgModule({
  declarations: [ButtonChangeStateComponent],
  entryComponents: [ButtonChangeStateComponent],
  exports: [ButtonChangeStateComponent],
  imports: [
    CommonModule,
    IonicModule,
    ChangeStateModule
  ]
})
export class ButtonChangeStateModule { }
