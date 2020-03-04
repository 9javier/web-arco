import { NgModule } from '@angular/core';
import { FormExpeditionProviderComponent } from './form-expedition-provider.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [FormExpeditionProviderComponent],
  entryComponents: [FormExpeditionProviderComponent],
  exports: [
    FormExpeditionProviderComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule
  ]
})

export class FormExpeditionProviderModule {}
