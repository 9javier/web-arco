import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from '@ionic/angular';
import { NewReturnComponent } from './new-return.component';

const routes: Routes = [{
    path: '',
    component: NewReturnComponent
}];

@NgModule({
  declarations: [NewReturnComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})

export class NewReturnModule {}
