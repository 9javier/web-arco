import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ReceptionsAvelonComponent } from './receptions-avelon.component';
import { ListsComponent } from './components/lists/lists.component';
import { SizesComponent } from './components/sizes/sizes.component';
import { VirtualKeyboardModule } from '../components/virtual-keyboard/virtual-keyboard.module';

const routes: Routes = [
  {
    path: '',
    component: ReceptionsAvelonComponent
  }
];
@NgModule({
  declarations: [ReceptionsAvelonComponent, ListsComponent, SizesComponent],
  entryComponents: [ReceptionsAvelonComponent, ListsComponent, SizesComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    RouterModule.forChild(routes),
    VirtualKeyboardModule
  ]
})
export class ReceptionsAvelonModule { }
