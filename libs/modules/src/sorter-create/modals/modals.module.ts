import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { IonicModule } from '@ionic/angular';
import { BaseComponent } from './base/base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateComponent, UpdateComponent, BaseComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    CreateComponent,
    UpdateComponent
  ],
})
export class ModalsModule { }
