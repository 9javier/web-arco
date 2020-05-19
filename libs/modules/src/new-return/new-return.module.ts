import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from '@ionic/angular';
import { NewReturnComponent } from './new-return.component';
import {FormsModule} from "@angular/forms";
import {SelectConditionComponent} from "./select-condition/select-condition.component";
import {MatTooltipModule} from "@angular/material";

const routes: Routes = [{
    path: '',
    component: NewReturnComponent
}];

@NgModule({
  declarations: [NewReturnComponent, SelectConditionComponent],
  entryComponents: [SelectConditionComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatTooltipModule
  ]
})

export class NewReturnModule {}
