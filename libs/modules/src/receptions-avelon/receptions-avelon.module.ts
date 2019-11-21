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
  declarations: [ListsComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ReceptionsAvelonModule { }
