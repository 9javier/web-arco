import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InternalExpeditionModalComponent } from './internal-expedition-modal.component';
import {MatExpansionModule, MatGridListModule, MatPaginatorModule} from "@angular/material";



@NgModule({
  declarations: [InternalExpeditionModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    MatExpansionModule
  ],
  entryComponents: [
    InternalExpeditionModalComponent
  ],
})
export class InternalExpeditionModalModule {}
