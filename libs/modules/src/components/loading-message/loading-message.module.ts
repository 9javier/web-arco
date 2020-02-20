import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoadingMessageComponent } from './loading-message.component';

@NgModule({
  declarations: [LoadingMessageComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [LoadingMessageComponent]
})

export class LoadingMessageModule { }
