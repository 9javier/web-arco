import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from './base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatCheckboxModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [BaseComponent],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
    MatListModule
  ],
  exports:[BaseComponent]
})
export class BaseModule { }
