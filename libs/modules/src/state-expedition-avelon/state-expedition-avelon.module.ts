import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MatTableModule, MatTooltipModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {StateExpeditionAvelonComponent} from './state-expedition-avelon.component';
import {StateExpeditionAvelonRoutingModule} from './state-expedition-avelon-routing.module';

@NgModule({
  declarations: [StateExpeditionAvelonComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatTableModule,
    StateExpeditionAvelonRoutingModule,
    FormsModule,
    MatSelectModule,
    MatTooltipModule
  ]
})
export class StateExpeditionAvelonModule {}
