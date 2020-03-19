import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BrandsStoreComponent } from './brands-store.component';
import { BrandsDataModule } from '../brands-data/brands-data.module';

@NgModule({
  declarations: [BrandsStoreComponent],
  entryComponents:[BrandsStoreComponent],
  imports: [
    CommonModule,
    BrandsDataModule,
    IonicModule
  ]
})
export class BrandsStoreModule { }
