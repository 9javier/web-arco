import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReviewImagesComponent } from '../review-images/review-images.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MatExpansionModule, MatTooltipModule} from "@angular/material";
import {SignatureModule} from "@suite/common-modules";
import {ScrollingModule} from "@angular/cdk/scrolling";

@NgModule({
  declarations: [ReviewImagesComponent],
  entryComponents: [ReviewImagesComponent],
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
  exports: [
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReviewImagesModule { }
