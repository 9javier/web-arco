import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsDataModule } from '../brands-data/brands-data.module';
import { BrandsStoreComponent } from './brands-store.component';
import { IonicModule } from '@ionic/angular';

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
