import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateComponent } from './update.component';
import { IonicModule } from '@ionic/angular';
import { BaseModule } from '../base/base.module';

@NgModule({
  declarations: [UpdateComponent],
  imports: [
    CommonModule,
    IonicModule,
    BaseModule,
  ],
  entryComponents:[UpdateComponent],
  exports:[
    UpdateComponent
  ]
})
export class UpdateModule { }