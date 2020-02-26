import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeInputComponent } from './size-input.component';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material";

@NgModule({
  declarations: [SizeInputComponent],
  exports: [
    SizeInputComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatTooltipModule
  ]
})

export class SizeInputModule { }
