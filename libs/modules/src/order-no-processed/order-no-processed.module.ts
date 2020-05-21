import { IonicModule } from '@ionic/angular';
import { NgModule} from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import {MatTableModule} from '@angular/material';

import { OrderNoProcessedComponent } from './order-no-processed.component';


const routes: Routes = [
  {
    path: '',
    component: OrderNoProcessedComponent
  }
];

@NgModule({
  declarations: [OrderNoProcessedComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatListModule,
    MatTableModule,
  ]
})
export class OrderNoProcesse2dModule { }
