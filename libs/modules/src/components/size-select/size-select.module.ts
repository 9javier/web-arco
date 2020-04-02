import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeSelectComponent } from './size-select.component';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material";

@NgModule({
  declarations: [SizeSelectComponent],
  exports: [
    SizeSelectComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatRippleModule
  ]
})

export class SizeSelectModule { }
