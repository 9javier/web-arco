import {NgModule} from '@angular/core';
import {PickingScanPackingComponent} from "./picking-scan-packing.component";
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material";

const routes: Routes = [
  {
    path: '',
    component: PickingScanPackingComponent
  }
];

@NgModule({
  declarations: [PickingScanPackingComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatTooltipModule
  ]
})
export class PickingScanPackingModule {}
