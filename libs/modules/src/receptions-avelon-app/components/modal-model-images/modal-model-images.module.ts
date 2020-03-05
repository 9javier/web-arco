import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModelImagesComponent } from './modal-model-images.component';
import {MatButtonModule, MatIconModule} from "@angular/material";

@NgModule({
  declarations: [ModalModelImagesComponent],
  entryComponents: [ModalModelImagesComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [ModalModelImagesComponent]
})

export class ModalModelImagesModule {}
