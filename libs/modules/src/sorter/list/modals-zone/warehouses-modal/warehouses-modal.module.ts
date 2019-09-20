import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehousesModalComponent } from './warehouses-modal.component';
import { IonicModule } from '@ionic/angular';
import { MatTableModule } from '@angular/material'  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WarehousesModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule
  ],
  entryComponents:[WarehousesModalComponent],
  exports:[
    WarehousesModalComponent
  ]
})
export class WarehousesModalModule { }
