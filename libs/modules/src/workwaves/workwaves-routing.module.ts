import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkwavesComponent } from "./workwaves.component";

const routes: Routes = [
  {
    path: '',
    component: WorkwavesComponent
  },
  {
    path: 'list',
    component: WorkwavesComponent
  },
  {
    path: 'menu',
    component: WorkwavesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkwavesRoutingModule {}
