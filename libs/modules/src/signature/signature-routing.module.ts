import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignatureComponent } from './signature.component';

const routes: Routes = [
  {
    path: '',
    component: SignatureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignatureRoutingModule { }
