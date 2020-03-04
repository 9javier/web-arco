import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataComponent } from './data.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [DataComponent],
    imports: [
    ReactiveFormsModule,
    CommonModule,
    IonicModule
  ],
  exports:[DataComponent]
})
export class DataModule { }
