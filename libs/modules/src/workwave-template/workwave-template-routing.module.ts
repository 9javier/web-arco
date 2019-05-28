import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkwaveTemplateComponent } from "./workwave-template.component";

const routes: Routes = [
  {
    path: '',
    component: WorkwaveTemplateComponent
  },
  {
    path: 'list',
    component: WorkwaveTemplateComponent
  },
  {
    path: 'menu',
    component: WorkwaveTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkwaveTemplateRoutingModule {}
