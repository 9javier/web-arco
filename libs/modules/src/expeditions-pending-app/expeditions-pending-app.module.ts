import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ExpeditionsPendingAppComponent } from './expeditions-pending-app.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule
} from "@angular/material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormExpeditionInfoModule} from "./components/form-expedition-info/form-expedition-info.module";
import {FormExpeditionInfoComponent} from "./components/form-expedition-info/form-expedition-info.component";
import {ExpeditionInfoComponent} from "./components/expedition-info/expedition-info.component";
import {ExpeditionInfoModule} from "./components/expedition-info/expedition-info.module";
import {AnotherExpeditionsComponent} from "./components/another-expeditions/another-expeditions.component";
import {AnotherExpeditionsModule} from "./components/another-expeditions/another-expeditions.module";
import {InfoExpeditionsModule} from "./modals/info-expeditions/info-expeditions.module";
import {FormExpeditionProviderComponent} from "./components/form-expedition-provider/form-expedition-provider.component";
import {FormExpeditionProviderModule} from "./components/form-expedition-provider/form-expedition-provider.module";

const routes: Routes = [
  {
    path: '',
    component: ExpeditionsPendingAppComponent
  }
];

@NgModule({
  declarations: [ExpeditionsPendingAppComponent],
  entryComponents: [ExpeditionsPendingAppComponent, FormExpeditionInfoComponent, FormExpeditionProviderComponent, ExpeditionInfoComponent, AnotherExpeditionsComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    FormExpeditionInfoModule,
    FormExpeditionProviderModule,
    ExpeditionInfoModule,
    AnotherExpeditionsModule,
    InfoExpeditionsModule
  ]
})

export class ExpeditionsPendingAppModule {}
