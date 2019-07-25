import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateComponent } from './update.component';
import { DataModule } from '../data/data.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [UpdateComponent],
  imports: [
    CommonModule,
    DataModule,
    IonicModule
  ]
})
export class UpdateModule { }
