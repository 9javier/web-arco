import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatCheckboxModule, MatPaginatorModule, MatListModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { IonicModule } from '@ionic/angular';
import { RegionsComponent } from './regions.component';
import { StoreComponent } from './modal/store/store.component';
import { UpdateComponent } from './modal/update/update.component';
import { InfoComponent } from './modal/info/info.component';
import { RegionsRoutingModule } from './regions-routing.module';

@NgModule({
  declarations: [RegionsComponent,StoreComponent, UpdateComponent, InfoComponent],
  imports: [
    IonicModule,
    CommonModule,
    RegionsRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    CdkTableModule,
    MatPaginatorModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegionsModule { }
