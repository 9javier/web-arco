import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbnailImageComponent } from './thumbnail-image.component';
import { IonicModule } from '@ionic/angular';
import {MatCardModule} from "@angular/material/card";

@NgModule({
  entryComponents:[ ThumbnailImageComponent ],
  declarations: [ ThumbnailImageComponent ],
  imports: [
    CommonModule,
    IonicModule,
    MatCardModule
  ],
  exports:[ ThumbnailImageComponent ]
})

export class ThumbnailImageModule { }
