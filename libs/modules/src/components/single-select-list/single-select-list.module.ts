import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSelectListComponent } from './single-select-list.component';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {MatTooltipModule, MatRippleModule, MatListModule, MatIconModule, MatButtonModule, MatInputModule} from "@angular/material";
import {ScrollingModule} from "@angular/cdk/scrolling";

@NgModule({
  declarations: [SingleSelectListComponent],
  exports: [
    SingleSelectListComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    CommonModule,
    IonicModule,
    MatListModule,
    MatRippleModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ScrollingModule
  ]
})

export class SingleSelectListModule { }
