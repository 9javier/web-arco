import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonChangeState2Component } from './button-change-state2.component';
import { IonicModule } from '@ionic/angular';
import { ChangeState2Module } from '../change-state2/change-state2.module';





@NgModule({
  declarations: [ButtonChangeState2Component],
  entryComponents: [ButtonChangeState2Component],
  exports: [ButtonChangeState2Component],
  imports: [
    CommonModule,
    IonicModule,
    ChangeState2Module,
  ]
})
export class ButtonChangeState2Module { }
