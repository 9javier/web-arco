import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ReceptionsAvelonAppComponent } from './receptions-avelon-app.component';
import {MatButtonModule, MatDividerModule, MatIconModule} from "@angular/material";
import {EanScannerComponent} from "./components/ean-scanner/ean-scanner.component";
import {EanScannerModule} from "./components/ean-scanner/ean-scanner.module";

const routes: Routes = [
  {
    path: '',
    component: ReceptionsAvelonAppComponent
  },
  {
    path: 'scanner',
    component: EanScannerComponent
  }
];

@NgModule({
  declarations: [ReceptionsAvelonAppComponent],
  entryComponents: [ReceptionsAvelonAppComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    EanScannerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ReceptionsAvelonAppModule {}
