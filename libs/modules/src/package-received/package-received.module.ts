import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageReceivedComponent } from './package-received.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule, MatTableModule, MatPaginatorModule, MatExpansionModule, MatSlideToggleModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { RouterModule,Routes } from '@angular/router';
import { ResponsiveLayoutModule } from '../components/responsive-layout/responsive-layout.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';

const routes: Routes = [
  {
    path: '',
    component: PackageReceivedComponent,
  }
];

@NgModule({
  declarations: [PackageReceivedComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
    ResponsiveLayoutModule,
    MatExpansionModule,
    MatSlideToggleModule,
    TagsInputModule,
    PaginatorComponentModule
  ]
})
export class PackageReceivedModule { }
