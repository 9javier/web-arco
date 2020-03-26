import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataComponent } from './data.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatDatepickerModule, MatExpansionModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrandsModalsModule } from '../../brands/brands-modals.module';

@NgModule({
  declarations: [DataComponent],
  entryComponents: [],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatExpansionModule,
    BrandsModalsModule
  ],
  exports:[DataComponent]
})
export class DataModule { }
