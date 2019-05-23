import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import { ComponentsModule } from '../components/components.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';


@NgModule({
  declarations: [UsersComponent, StoreComponent, UpdateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    UsersRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    ComponentsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatListModule
  ],
  entryComponents: [
    StoreComponent
  ]
})
export class UsersModule {}
