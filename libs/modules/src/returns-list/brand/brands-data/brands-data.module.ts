import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsDataComponent } from './brands-data.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatDatepickerModule, MatExpansionModule, MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [BrandsDataComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatExpansionModule,
  ],
  exports:[BrandsDataComponent]
})
export class BrandsDataModule { }
