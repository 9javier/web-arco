import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistryDetailsComponent } from './registry-details.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { ButtonChangeStateModule } from '../button-change-state/button-change-state.module';
import {SignatureComponent} from '../../../signature/signature.component';
import {SignatureModule} from '../../../signature/signature.module';

@NgModule({
  declarations: [RegistryDetailsComponent],
  entryComponents: [RegistryDetailsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    MatTooltipModule,
    MatExpansionModule,
    ButtonChangeStateModule,
  ],
  exports: [RegistryDetailsComponent]
})
export class RegistryDetailsModule { }
