import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewFilesComponent } from './view-files.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalReviewComponent } from '../../../components/modal-defective/ModalReview/modal-review.component';

@NgModule({
  declarations: [ViewFilesComponent, ModalReviewComponent],
  entryComponents: [ModalReviewComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CommonModule
  ],
  exports:[ViewFilesComponent]
})
export class ViewFilesModule { }
