import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VentilationNoSorterComponent } from './ventilation-no-sorter.component';

const routes: Routes = [
  {
    path: '',
    component: VentilationNoSorterComponent
  }
];

@NgModule({
  imports: [
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [VentilationNoSorterComponent]
})
export class VentilationNoSorterModule {}
