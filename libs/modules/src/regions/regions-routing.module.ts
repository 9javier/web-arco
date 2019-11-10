import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegionsComponent } from '@suite/common-modules';
import { StoreComponent } from './modal/store/store.component';
import { UpdateComponent } from './modal/update/update.component';

const routes: Routes = [
  {
    path: '',
    component: RegionsComponent,
    children:
      [
        {
          path: '',
          component: StoreComponent
        },
        {
          path: '',
          component: UpdateComponent
        }
      ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionsRoutingModule { }
