import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { MatPaginatorModule, MatTooltipModule } from "@angular/material";
import { IonicModule } from '@ionic/angular';
import { ReturnTrackingListComponent } from './return-tracking-list.component';

const routes: Routes = [{
    path: '',
    component: ReturnTrackingListComponent
}];

@NgModule({
  declarations: [ReturnTrackingListComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatPaginatorModule,
    MatTooltipModule
  ]
})

export class ReturnTrackingListModule {}
