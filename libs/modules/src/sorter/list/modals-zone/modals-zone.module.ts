import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from './store/store.module';
import { UpdateModule } from './update/update.module';
import { BaseComponent } from './base/base.component';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule,
    UpdateModule
  ]
})
export class ModalsZoneModule { }
