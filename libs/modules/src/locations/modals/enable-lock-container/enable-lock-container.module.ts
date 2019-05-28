import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EnableLockContainerComponent } from '../enable-lock-container/enable-lock-container.component';

@NgModule({
  declarations: [EnableLockContainerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule
  ],
  entryComponents: [
    EnableLockContainerComponent
  ]
})
export class EnableLockContainerModule {}