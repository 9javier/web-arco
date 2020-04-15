import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { UserManagerComponent } from './user-manager.component';
import { RouterModule, Routes } from "@angular/router";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ComponentsModule } from '../components//components.module';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ResponsiveLayoutModule } from '../components/responsive-layout/responsive-layout.module';
import { MatTooltipModule } from "@angular/material";

const routes: Routes = [
  {
    path: '',
    component: UserManagerComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatCheckboxModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    BreadcrumbModule,
    MatExpansionModule,
    MatSlideToggleModule,
    ResponsiveLayoutModule,
    MatTooltipModule
  ],
  declarations: [UserManagerComponent]
})
export class UserManagerModule {}
