import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRelocationComponent } from './product-relocation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ProductRelocationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
  ],
  entryComponents: [ProductRelocationComponent],

})
export class ProductRelocationModule { }
