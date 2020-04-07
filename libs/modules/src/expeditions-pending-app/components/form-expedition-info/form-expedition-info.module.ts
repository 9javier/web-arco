import { NgModule } from '@angular/core';
import { FormExpeditionInfoComponent } from './form-expedition-info.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import { HideKeyboardModule } from 'hide-keyboard';

@NgModule({
  declarations: [FormExpeditionInfoComponent],
  entryComponents: [FormExpeditionInfoComponent],
  exports: [
    FormExpeditionInfoComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    HideKeyboardModule,
    MatButtonModule
  ]
})

export class FormExpeditionInfoModule {}
