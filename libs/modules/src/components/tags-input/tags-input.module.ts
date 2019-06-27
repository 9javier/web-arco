import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsInputComponent } from './tags-input.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TagsInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[TagsInputComponent]
})
export class TagsInputModule { }
