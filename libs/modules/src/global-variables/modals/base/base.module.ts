import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from './base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [BaseComponent],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports:[BaseComponent]
})
export class BaseModule { }
