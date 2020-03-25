import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import {
  
  MatTableModule,
 
} from '@angular/material';
import { InputCodesComponent } from "./input-codes/input-codes.component";
import { HideKeyboardModule } from 'hide-keyboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from "@angular/cdk/table";
import { OrderPreparationComponent } from './order-preparation.component';
import { OrderPreparationRoutingModule } from "./order-preparation-routing.module";

const routes: Routes = [
  {
    path: '',
    component: OrderPreparationComponent
  }
];

@NgModule({
  declarations: [OrderPreparationComponent,InputCodesComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatListModule,
    MatTableModule,
    CdkTableModule,
    FormsModule,
    HideKeyboardModule,
    OrderPreparationRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [InputCodesComponent]
})
export class OrderPreparationModule { }
