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
import { ModalsModule } from './modals/modals.module';
import { ModalsZoneModule } from './list/modals-zone/modals-zone.module';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material';
import { AlInputSorterComponent } from "./al-input/al-input.component";
import {ColorSelectorSorterComponent} from "./color-selector/color-selector.component";
import {FooterButtonsSorterComponent} from "./footer-buttons/footer-buttons.component";
import {ColorItemSorterComponent} from "./color-selector/color/color.component";
import {MatrixInputSorterComponent} from "./matrix-input/matrix-input.component";
import {ScannerInputSorterComponent} from "./al-input/scanner/scanner.component";
import {FooterButtonsScannerSorterComponent} from "./footer-buttons-scanner/footer-buttons-scanner.component";
import {AlOutputSorterComponent} from "./al-output/al-output.component";
import {ScannerOutputSorterComponent} from "./al-output/scanner/scanner.component";
import {TemplateSelectionComponent} from "./template-selection/template-selection";
import {SorterListTemplatesSelectionComponent} from "./template-selection/list-templates/list-templates";
import {SorterMatrixSelectedComponent} from "./template-selection/matrix-selected/matrix-selected";
import {SorterTemplateSelectionComponent} from "./template-selection/list-templates/template/template";
import { MatrixSelectWaySorterComponent } from './list/components/matrix-select-way-sorter/matrix-select-way-sorter.component';
import { TablePrioritiesSorterComponent } from './list/components/table-priorities-sorter/table-priorities-sorter.component';

const routes:Routes = [
  {
    path: '',
    component: SorterComponent,
    data: {
      name: 'Plantillas'
    }
  },
  {
    path: 'plantilla/:id/:equalParts',
    component: ListComponent,
    data: {
      name: 'Plantilla'
    }
  },
  {
    path: 'template/selection',
    component: TemplateSelectionComponent,
    data: {
      name: 'Selección de plantilla'
    }
  },
  {
    path: 'input',
    component: AlInputSorterComponent,
    data: {
      name: 'Entrada sorter'
    }
  },
  {
    path: 'input/scanner',
    component: ScannerInputSorterComponent,
    data: {
      name: 'Entrada sorter'
    }
  },
  {
    path: 'output',
    component: AlOutputSorterComponent,
    data: {
      name: 'Salida sorter'
    }
  },
  {
    path: 'output/scanner',
    component: ScannerOutputSorterComponent,
    data: {
      name: 'Salida sorter'
    }
  }
];

@NgModule({
  declarations: [
    SorterComponent,
    ListComponent,
    AlInputSorterComponent,
    AlOutputSorterComponent,
    MatrixInputSorterComponent,
    ScannerInputSorterComponent,
    ScannerOutputSorterComponent,
    FooterButtonsSorterComponent,
    FooterButtonsScannerSorterComponent,
    ColorSelectorSorterComponent,
    ColorItemSorterComponent,
    TemplateSelectionComponent,
    SorterListTemplatesSelectionComponent,
    SorterTemplateSelectionComponent,
    SorterMatrixSelectedComponent,
    MatrixSelectWaySorterComponent,
    TablePrioritiesSorterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatIconModule,
    MatGridListModule,
    ModalsModule,
    ModalsZoneModule,
    RouterModule.forChild(routes),
    BreadcrumbModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class SorterModule { }
