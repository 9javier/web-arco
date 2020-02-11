import { NgModule } from '@angular/core';
import { AnotherExpeditionsComponent } from './another-expeditions.component';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {MatCardModule, MatDividerModule} from "@angular/material";

@NgModule({
  declarations: [AnotherExpeditionsComponent],
  entryComponents: [AnotherExpeditionsComponent],
  exports: [
    AnotherExpeditionsComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    MatCardModule,
    MatDividerModule
  ]
})

export class AnotherExpeditionsModule {}
