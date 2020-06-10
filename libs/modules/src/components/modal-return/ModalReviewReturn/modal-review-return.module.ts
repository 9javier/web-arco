import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalReviewReturnComponent } from './modal-review-return.component';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModalReviewReturnComponent],
  entryComponents: [ModalReviewReturnComponent],
  exports: [ModalReviewReturnComponent],
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
export class ModalReviewReturnModule { }
