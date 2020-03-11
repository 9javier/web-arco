import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefectsSgaComponent } from './defects-sga.component';

const routes: Routes = [
  {
    path: '',
    component: DefectsSgaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefectsSgaRoutingModule { }
