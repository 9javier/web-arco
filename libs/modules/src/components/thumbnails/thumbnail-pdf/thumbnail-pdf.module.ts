import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbnailPdfComponent } from './thumbnail-pdf.component';
import { IonicModule } from '@ionic/angular';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  entryComponents:[ ThumbnailPdfComponent ],
  declarations: [ ThumbnailPdfComponent ],
  imports: [
    CommonModule,
    IonicModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports:[ ThumbnailPdfComponent ]
})

export class ThumbnailPdfModule { }
