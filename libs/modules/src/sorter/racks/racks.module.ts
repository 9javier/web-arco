import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RacksRoutingModule } from './racks-routing.module';
import { RacksComponent } from './racks.component';
import { IonicModule } from '@ionic/angular';
import {
  MatCheckboxModule,
  MatFormFieldModule,
  MatGridListModule, MatIconModule,
  MatInputModule, MatSelectModule,
  MatTableModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreUpdateComponent } from './store-update/store-update.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [RacksComponent, StoreUpdateComponent],
  entryComponents: [StoreUpdateComponent],
  imports: [
    CommonModule,
    RacksRoutingModule,
    IonicModule,
    MatTableModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgxMaskModule,
    MatSelectModule
  ]
})
export class RacksModule { }
