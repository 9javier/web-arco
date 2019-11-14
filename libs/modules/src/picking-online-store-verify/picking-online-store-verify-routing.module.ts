import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PickingOnlineStoreVerifyComponent} from "./picking-online-store-verify.component";

const routes: Routes = [
  {
    path: '',
    component: PickingOnlineStoreVerifyComponent
  },
  {
    path: 'list',
    component: PickingOnlineStoreVerifyComponent
  },
  {
    path: 'menu',
    component: PickingOnlineStoreVerifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickingOnlineStoreVerifyRoutingModule {}
