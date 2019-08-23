import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkwaveTemplateRebuildComponent } from "./workwave-template-rebuild.component";

const routes: Routes = [
  {
    path: '',
    component: WorkwaveTemplateRebuildComponent
  },
  {
    path: 'list',
    component: WorkwaveTemplateRebuildComponent
  },
  {
    path: 'menu',
    component: WorkwaveTemplateRebuildComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkwaveTemplateRebuildRoutingModule {}
