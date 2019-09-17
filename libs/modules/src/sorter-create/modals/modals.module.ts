import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [CreateComponent, UpdateComponent],
  imports: [
    CommonModule
  ]
})
export class ModalsModule { }
