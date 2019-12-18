import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductDetailsAlComponent } from './product-details-al.component';



@NgModule({
  declarations: [ProductDetailsAlComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
  ],
  entryComponents: [
    ProductDetailsAlComponent
  ]
})
export class ProductDetailsAlModule {}
