import { NgModule } from '@angular/core';
import { AnotherExpeditionsComponent } from './another-expeditions.component';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {MatButtonModule, MatCardModule, MatIconModule} from "@angular/material";

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
    MatIconModule,
    MatButtonModule
  ]
})

export class AnotherExpeditionsModule {}
