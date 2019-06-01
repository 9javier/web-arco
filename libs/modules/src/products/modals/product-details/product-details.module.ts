import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductDetailsComponent } from './product-details.component';



@NgModule({
  declarations: [ProductDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
  ],
  entryComponents: [
    ProductDetailsComponent
  ]
})
export class ProductDetailsModule {}