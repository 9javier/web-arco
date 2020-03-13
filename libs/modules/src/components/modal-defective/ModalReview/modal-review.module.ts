import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalReviewComponent } from './modal-review.component';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModalReviewComponent],
  entryComponents: [ModalReviewComponent],
  exports: [ModalReviewComponent],
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
export class ModalReviewModule { }
