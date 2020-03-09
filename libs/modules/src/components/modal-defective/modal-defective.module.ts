import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowImageComponent } from './show-image/show-image.component';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ButtonChangeStateModule } from './button-change-state/button-change-state.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatExpansionModule,
    IonicModule,
    MatTooltipModule,
    FormsModule,
    ButtonChangeStateModule
  ],
})
export class ModalDefectiveModule { }
