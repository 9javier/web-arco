import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ReceptionsAvelonComponent } from './receptions-avelon.component';
import { ListsComponent } from './components/lists/lists.component';

const routes: Routes = [
  {
    path: '',
    component: ReceptionsAvelonComponent
  }
];
@NgModule({
  declarations: [ReceptionsAvelonComponent, ListsComponent],
  entryComponents: [ReceptionsAvelonComponent, ListsComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    RouterModule.forChild(routes),
  ]
})
export class ReceptionsAvelonModule { }
