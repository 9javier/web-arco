import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataModule } from './data/data.module';
import { StoreModule } from './store/store.module';
import { UpdateModule } from './update/update.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DataModule,
    StoreModule,
    UpdateModule
  ]
})
export class ReturnsModule { }
