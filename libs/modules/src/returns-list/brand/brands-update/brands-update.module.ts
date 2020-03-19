import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BrandsUpdateComponent } from './brands-update.component';
import { BrandsDataModule } from '../brands-data/brands-data.module';

@NgModule({
  declarations: [BrandsUpdateComponent],
  entryComponents:[BrandsUpdateComponent],
  imports: [
    CommonModule,
    BrandsDataModule,
    IonicModule
  ]
})
export class BrandsUpdateModule { }
