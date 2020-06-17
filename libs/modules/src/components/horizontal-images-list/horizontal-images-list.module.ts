import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalImagesListComponent } from './horizontal-images-list.component';
import { IonicModule } from '@ionic/angular';
import {ThumbnailImageModule} from "../thumbnails/thumbnail-image/thumbnail-image.module";
import {ThumbnailPdfModule} from "../thumbnails/thumbnail-pdf/thumbnail-pdf.module";

@NgModule({
  entryComponents:[ HorizontalImagesListComponent ],
  declarations: [ HorizontalImagesListComponent ],
  imports: [
    CommonModule,
    IonicModule,
    ThumbnailImageModule,
    ThumbnailPdfModule
  ],
  exports:[ HorizontalImagesListComponent ]
})

export class HorizontalImagesListModule { }
