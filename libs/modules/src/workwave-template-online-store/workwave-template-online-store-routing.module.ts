import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkwaveTemplateOnlineStoreComponent } from "./workwave-template-online-store.component";

const routes: Routes = [
  {
    path: '',
    component: WorkwaveTemplateOnlineStoreComponent
  },
  {
    path: 'list',
    component: WorkwaveTemplateOnlineStoreComponent
  },
  {
    path: 'menu',
    component: WorkwaveTemplateOnlineStoreComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkwaveTemplateOnlineStoreRoutingModule {}
