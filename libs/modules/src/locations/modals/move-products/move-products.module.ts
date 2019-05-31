import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MoveProductsComponent} from "./move-products.component";
import {PipesModule} from "../../../../../pipes/src";

@NgModule({
  declarations: [MoveProductsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    PipesModule
  ],
  entryComponents: [
    MoveProductsComponent
  ]
})
export class MoveProductsModule {}
