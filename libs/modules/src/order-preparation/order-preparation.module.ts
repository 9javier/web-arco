import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { InputCodesComponent } from "./input-codes/input-codes.component";
import { HideKeyboardModule } from 'hide-keyboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderPreparationComponent } from './order-preparation.component';
import { OrderPreparationRoutingModule } from "./order-preparation-routing.module";
import { MatListModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { MatTooltipModule } from "@angular/material";
import { File } from '@ionic-native/file/ngx';



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
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    HideKeyboardModule,
    OrderPreparationRoutingModule,
    MatTooltipModule
  ],
  providers:[
    File
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [InputCodesComponent]
})
export class OrderPreparationModule { }
