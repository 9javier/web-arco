import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefectHandlerComponent } from './defect-handler.component';

const routes: Routes = [
  {
    path: '',
    component: DefectHandlerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefectHandlerRoutingModule { }
