import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VentilationNoSorterComponent } from './ventilation-no-sorter.component';
import { ScannerManualModule } from "../components/scanner-manual/scanner-manual.module";
import {CommonModule} from "@angular/common";
import { HideKeyboardModule } from 'hide-keyboard';

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
    ScannerManualModule,
    HideKeyboardModule,
    CommonModule
  ],
  declarations: [VentilationNoSorterComponent]
})
export class VentilationNoSorterModule {}
