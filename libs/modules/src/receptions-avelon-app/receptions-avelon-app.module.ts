import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ReceptionsAvelonAppComponent } from './receptions-avelon-app.component';
import {MatButtonModule, MatDividerModule, MatIconModule, MatRippleModule} from "@angular/material";
import {EanScannerModule} from "./components/ean-scanner/ean-scanner.module";
import {ManualReceptionComponent} from "./components/manual-reception/manual-reception.component";
import {ManualReceptionModule} from "./components/manual-reception/manual-reception.module";
import {HideKeyboardModule} from "hide-keyboard";
import {ScannerManualModule} from "../components/scanner-manual/scanner-manual.module";

const routes: Routes = [
  {
    path: '',
    component: ReceptionsAvelonAppComponent
  },
  {
    path: 'free',
    component: ReceptionsAvelonAppComponent
  },
  {
    path: 'manual',
    component: ManualReceptionComponent
  },
  {
    path: 'manual/:ean',
    component: ManualReceptionComponent
  },
  {
    path: 'free/manual',
    component: ManualReceptionComponent
  },
  {
    path: 'free/manual/:ean',
    component: ManualReceptionComponent
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
    EanScannerModule,
    ManualReceptionModule,
    HideKeyboardModule,
    ScannerManualModule,
    MatRippleModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ReceptionsAvelonAppModule {}
