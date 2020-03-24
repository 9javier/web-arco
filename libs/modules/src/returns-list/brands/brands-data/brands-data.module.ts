import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsDataComponent } from './brands-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatCheckboxModule } from '@angular/material';

@NgModule({
  declarations: [BrandsDataComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
    MatCheckboxModule,
    FormsModule
  ],
  exports:[BrandsDataComponent]
})
export class BrandsDataModule { }
