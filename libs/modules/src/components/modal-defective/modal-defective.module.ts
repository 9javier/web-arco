import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeStateComponent } from './change-state/change-state.component';
import { ShowImageComponent } from './show-image/show-image.component';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ButtonChangeStateModule } from './button-change-state/button-change-state.module';
import { RegistryDetailsComponent } from './registry-details/registry-details.component';

@NgModule({
  declarations: [RegistryDetailsComponent, ChangeStateComponent, ShowImageComponent],
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
