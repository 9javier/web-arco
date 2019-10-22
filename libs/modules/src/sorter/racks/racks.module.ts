import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule, MatInputModule, MatButtonModule, MatSelectModule, MatRadioModule, MatCardModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { RacksRoutingModule } from './racks-routing.module';
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import { ComponentsModule } from '@suite/common-modules';
import { RacksComponent } from './racks.component';
import { StoreComponent } from './store/store.component';

@NgModule({
  declarations: [RacksComponent, StoreComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    RacksRoutingModule,
    CdkTableModule,
    CommonUiCrudModule,
    ComponentsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule
  ],
  entryComponents: [
    StoreComponent
  ]
})
export class RacksModule {}
