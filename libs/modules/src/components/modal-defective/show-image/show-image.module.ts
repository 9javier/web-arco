import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowImageComponent } from './show-image.component';
import { IonicModule } from '@ionic/angular';
import { MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [ShowImageComponent],
  entryComponents: [ShowImageComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatTooltipModule
  ]
})
export class ShowImageModule { }
