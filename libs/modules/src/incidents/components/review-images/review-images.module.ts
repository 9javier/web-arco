import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReviewImagesComponent } from '../review-images/review-images.component';

@NgModule({
  declarations: [ReviewImagesComponent,],
  entryComponents: [ReviewImagesComponent],
  imports: [
    CommonModule,
  
  ],
  exports: [
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReviewImagesModule { }
