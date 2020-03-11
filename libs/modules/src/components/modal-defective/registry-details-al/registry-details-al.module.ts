import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistryDetailsComponent } from './registry-details-al.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { ButtonChangeStateModule } from '../button-change-state/button-change-state.module';

@NgModule({
  declarations: [RegistryDetailsComponent],
  entryComponents: [RegistryDetailsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    MatTooltipModule,
    MatExpansionModule,
    ButtonChangeStateModule
  ],
  exports: [RegistryDetailsComponent]
})
export class RegistryDetailsModule { }
