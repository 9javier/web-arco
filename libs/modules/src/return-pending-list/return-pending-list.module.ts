import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { MatPaginatorModule, MatTooltipModule } from "@angular/material";
import { IonicModule } from '@ionic/angular';
import { ReturnPendingListComponent } from './return-pending-list.component';
import { FilterButtonModule } from "../components/filter-button/filter-button.module";

const routes: Routes = [{
    path: '',
    component: ReturnPendingListComponent
}];

@NgModule({
  declarations: [ReturnPendingListComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatPaginatorModule,
    MatTooltipModule,
    FilterButtonModule
  ]
})

export class ReturnPendingListModule {}
