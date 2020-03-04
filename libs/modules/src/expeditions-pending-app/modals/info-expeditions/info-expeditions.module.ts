import { NgModule } from '@angular/core';
import { InfoExpeditionsComponent } from './info-expeditions.component';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material";
import {ExpeditionInfoModule} from "../../components/expedition-info/expedition-info.module";
import {AnotherExpeditionsModule} from "../../components/another-expeditions/another-expeditions.module";

@NgModule({
  declarations: [InfoExpeditionsComponent],
  entryComponents: [InfoExpeditionsComponent],
  exports: [
    InfoExpeditionsComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    MatTooltipModule,
    ExpeditionInfoModule,
    AnotherExpeditionsModule,
  ]
})

export class InfoExpeditionsModule {}
