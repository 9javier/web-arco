import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeInputComponent } from './size-input.component';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [SizeInputComponent],
  exports: [
    SizeInputComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})

export class SizeInputModule { }
