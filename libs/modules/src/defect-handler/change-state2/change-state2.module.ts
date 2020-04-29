import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeState2Component } from './change-state2.component';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropFilesModule } from '../../drop-files/drop-files.module';
import { SignatureModule } from '../../signature/signature.module';
import { SignatureComponent } from '../../signature/signature.component';
import { ReviewImagesComponent } from '../../incidents/components/review-images/review-images.component';
import {SelectScrollbarStateComponent} from "./select-scrollbar-state/select-scrollbar-state.component";
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  declarations: [ChangeState2Component, SelectScrollbarStateComponent],
  entryComponents: [ChangeState2Component, SelectScrollbarStateComponent],
  exports: [ChangeState2Component],
  imports: [
    CommonModule,
    IonicModule,
    MatTooltipModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    SignatureModule,
    ScrollingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChangeState2Module { }
