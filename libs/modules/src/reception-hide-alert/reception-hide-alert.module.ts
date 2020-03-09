import {NgModule} from '@angular/core';
import {ReceptionHideAlertComponent} from "./reception-hide-alert.component";
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material";

const routes: Routes = [
  {
    path: '',
    component: ReceptionHideAlertComponent
  }
];

@NgModule({
  declarations: [ReceptionHideAlertComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatTooltipModule
  ]
})
export class ReceptionHideAlertModule {}
