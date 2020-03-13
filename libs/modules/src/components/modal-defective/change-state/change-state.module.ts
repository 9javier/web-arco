import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeStateComponent } from './change-state.component';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {SignatureComponent} from '../../../signature/signature.component';
import {SignatureModule} from '../../../signature/signature.module';


@NgModule({
  declarations: [ChangeStateComponent],
  entryComponents: [ChangeStateComponent],
  exports: [ChangeStateComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatTooltipModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChangeStateModule { }
