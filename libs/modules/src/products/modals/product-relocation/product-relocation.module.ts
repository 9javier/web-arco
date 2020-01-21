import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRelocationComponent } from './product-relocation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [ProductRelocationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    MatTooltipModule
  ],
  entryComponents: [ProductRelocationComponent],

})
export class ProductRelocationModule { }
