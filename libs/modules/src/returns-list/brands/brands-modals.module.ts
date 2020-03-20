import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsStoreModule } from './brands-store/brands-store.module';
import { BrandsUpdateModule } from './brands-update/brands-update.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrandsStoreModule
  ]
})
export class BrandsModalsModule { }
