import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SorterComponent } from './sorter.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatIconModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { ListComponent } from './list/list.component';
import { AlInputSorterComponent } from "./al-input/al-input.component";
import {ColorSelectorSorterComponent} from "./color-selector/color-selector.component";
import {FooterButtonsSorterComponent} from "./footer-buttons/footer-buttons.component";
import {ColorItemSorterComponent} from "./color-selector/color/color.component";
import {MatrixInputSorterComponent} from "./matrix-input/matrix-input.component";

const routes:Routes = [
  { path: '', redirectTo: 'plantillas', pathMatch: 'full' },
  {
    path: 'plantillas',
    component: SorterComponent,
    data: {
      name: 'Plantillas'
    }
  },
  {
    path: 'plantilla/:id',
    component: ListComponent,
    data: {
      name: 'Plantilla'
    }
  },
  {
    path: 'input',
    component: AlInputSorterComponent,
    data: {
      name: 'Entrada sorter'
    }
  },
]; 

@NgModule({
  declarations: [SorterComponent, ListComponent, AlInputSorterComponent, ColorSelectorSorterComponent, ColorItemSorterComponent, FooterButtonsSorterComponent, MatrixInputSorterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatIconModule,
    MatGridListModule,
    RouterModule.forChild(routes),
    BreadcrumbModule
  ]
})
export class SorterModule { }
