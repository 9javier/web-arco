import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsDataModule } from './brands-data/brands-data.module';
import { BrandsStoreModule } from './brands-store/brands-store.module';
import { BrandsUpdateModule } from './brands-update/brands-update.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrandsDataModule,
    BrandsStoreModule,
    BrandsUpdateModule
  ]
})
export class BrandsModule { }
