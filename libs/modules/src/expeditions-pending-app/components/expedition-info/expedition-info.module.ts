import { NgModule } from '@angular/core';
import { ExpeditionInfoComponent } from './expedition-info.component';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {MatButtonModule, MatCardModule, MatDividerModule, MatIconModule} from "@angular/material";

@NgModule({
  declarations: [ExpeditionInfoComponent],
  entryComponents: [ExpeditionInfoComponent],
  exports: [
    ExpeditionInfoComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ]
})

export class ExpeditionInfoModule {}
