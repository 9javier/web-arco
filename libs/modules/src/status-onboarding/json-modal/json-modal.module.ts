import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JsonModalComponent } from './json-modal.component';
import {MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatTooltipModule} from '@angular/material';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [JsonModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    MatTooltipModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatTableModule
  ],
  entryComponents: [
    JsonModalComponent
  ]
})
export class JsonModalModule {}
