import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { MatPaginatorModule, MatTooltipModule } from "@angular/material";
import { IonicModule } from '@ionic/angular';
import { ReturnPendingListComponent } from './return-pending-list.component';
import { FilterButtonModule } from "../components/filter-button/filter-button.module";
import {TagsInputModule} from "../components/tags-inputag/tags-input.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

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
    FilterButtonModule,
    TagsInputModule,
    ReactiveFormsModule,
    FormsModule
  ]
})

export class ReturnPendingListModule {}
