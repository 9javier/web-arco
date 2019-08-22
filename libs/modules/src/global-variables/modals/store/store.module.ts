import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store.component';
import { IonicModule } from '@ionic/angular';
import { BaseModule } from '../base/base.module';

@NgModule({
  declarations: [StoreComponent],
  imports: [
    IonicModule,
    CommonModule,
    BaseModule
  ],
  entryComponents:[StoreComponent],
  exports:[
    StoreComponent
  ]
})
export class StoreModule { }