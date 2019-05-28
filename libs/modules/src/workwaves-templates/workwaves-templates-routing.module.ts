import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkwavesTemplatesComponent } from "./workwaves-templates.component";

const routes: Routes = [
  {
    path: '',
    component: WorkwavesTemplatesComponent
  },
  {
    path: 'list',
    component: WorkwavesTemplatesComponent
  },
  {
    path: 'menu',
    component: WorkwavesTemplatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkwavesTemplatesRoutingModule {}
