import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualKeyboardComponent } from './virtual-keyboard.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {ScrollingModule} from "@angular/cdk/scrolling";

@NgModule({
  declarations: [VirtualKeyboardComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ScrollingModule
  ],
  entryComponents: [VirtualKeyboardComponent],
  exports: [VirtualKeyboardComponent]
})
export class VirtualKeyboardModule { }
