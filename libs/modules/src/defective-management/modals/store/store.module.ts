import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataModule } from '../data/data.module';
import { StoreComponent } from './store.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [StoreComponent],
  entryComponents:[StoreComponent],
  imports: [
    CommonModule,
    DataModule,
    IonicModule
  ]
})
export class StoreModule { }
