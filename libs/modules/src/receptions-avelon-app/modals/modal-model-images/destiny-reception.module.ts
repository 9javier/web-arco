import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDestinyReceptionComponent } from './destiny-reception.component';
import {MatButtonModule, MatIconModule} from "@angular/material";

@NgModule({
  declarations: [ModalDestinyReceptionComponent],
  entryComponents: [ModalDestinyReceptionComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [ModalDestinyReceptionComponent]
})

export class ModalDestinyReceptionModule {}
