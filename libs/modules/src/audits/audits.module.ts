import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuditsComponent } from './audits.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule, MatTableModule, MatPaginatorModule, MatSlideToggleModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDialogModule, MatCardModule, MatCheckboxModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { ModalsModule } from '../sorter/modals/modals.module';
import { ProductsByAuditComponent } from './modals/products-by-audit/products-by-audit.component';
import {PaginatorComponentModule} from "../components/paginator/paginator.component.module";

const routes: Routes = [
  {
    path: '',
    component: AuditsComponent
  }
];

@NgModule({
  declarations: [AuditsComponent,ProductsByAuditComponent],
  entryComponents: [ProductsByAuditComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    ModalsModule, 
    MatExpansionModule,
    MatSlideToggleModule,
    RouterModule.forChild(routes),
    PaginatorComponentModule
  ]
})
export class AuditsModule { }
