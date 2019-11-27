import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule, MatPaginatorModule, MatListModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import {CommonUiCrudModule} from '@suite/common/ui/crud';
import { DataModule } from './data/data.module';
import { BreadcrumbModule } from '../../../modules/src/components/breadcrumb/breadcrumb.module';
import { SendComponent } from './send/send.component';
import { MatFormFieldModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { StateExpeditionAvelonComponent } from './state-expedition-avelon.component';
import { StateExpeditionAvelonRoutingModule } from './state-expedition-avelon-routing.module';

@NgModule({
  declarations: [StateExpeditionAvelonComponent, StoreComponent, UpdateComponent, SendComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    StateExpeditionAvelonRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    DataModule,
    MatPaginatorModule,
    MatListModule,
    FormsModule,
    BreadcrumbModule,
    MatFormFieldModule,
    MatSelectModule
  ], entryComponents: [
    StoreComponent,
    SendComponent
  ]
})
export class StateExpeditionAvelonModule { }
