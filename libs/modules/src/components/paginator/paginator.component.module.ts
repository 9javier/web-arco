import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './paginator.component';
import { MatListModule } from '@angular/material';

@NgModule({
  declarations: [PaginatorComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatListModule
  ],
  exports:[PaginatorComponent]
})
export class PaginatorComponentModule { }
