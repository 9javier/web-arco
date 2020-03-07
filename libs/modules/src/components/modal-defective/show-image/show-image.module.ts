import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { ShowImageComponent } from './show-image.component';

@NgModule({
  declarations: [ShowImageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  entryComponents: [
    ShowImageComponent
  ]
})
export class ShowImageModule {}
