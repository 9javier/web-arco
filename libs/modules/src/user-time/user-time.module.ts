import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTimeComponent } from './user-time.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MatTooltipModule } from "@angular/material";

const routes:Routes = [
  {
    path: '',
    component: UserTimeComponent
  }
];

@NgModule({
  declarations: [UserTimeComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatTooltipModule
  ]
})
export class UserTimeModule { }
