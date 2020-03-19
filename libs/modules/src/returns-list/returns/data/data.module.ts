import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataComponent } from './data.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatDatepickerModule, MatExpansionModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrandsStoreModule } from '../../brand/brands-store/brands-store.module';
import { BrandsStoreComponent } from '../../brand/brands-store/brands-store.component';

@NgModule({
  declarations: [DataComponent],
  entryComponents: [BrandsStoreComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatExpansionModule,
    BrandsStoreModule
  ],
  exports:[DataComponent]
})
export class DataModule { }
