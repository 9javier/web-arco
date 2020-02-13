import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InfoModalComponent } from './info-modal.component';
import {MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatTooltipModule} from '@angular/material';

@NgModule({
  declarations: [InfoModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    MatTooltipModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  entryComponents: [
    InfoModalComponent
  ]
})
export class InfoModalModule {}
