import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRegisterComponent } from './details-register.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { ButtonChangeState2Module } from '../button-change-state2/button-change-state2.module';
import { SignatureComponent } from '../../signature/signature.component';
import { SignatureModule } from '../../signature/signature.module';

@NgModule({
  declarations: [DetailsRegisterComponent],
  entryComponents: [DetailsRegisterComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    MatTooltipModule,
    MatExpansionModule,
    ButtonChangeState2Module,
  ],
  exports: [DetailsRegisterComponent]
})
export class DetailsRegisterModule { }
