import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from '@ionic/angular';
import { ViewReturnComponent } from './view-return.component';
import {FormsModule} from "@angular/forms";
import {MatTooltipModule, MatRippleModule, MatCardModule} from "@angular/material";
import {SingleSelectListModule} from "../components/single-select-list/single-select-list.module";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {ViewFilesComponent} from "./modals/view-files/view-files.component";
import { ModalReviewComponent } from '../components/modal-defective/ModalReview/modal-review.component';

const routes: Routes = [{
    path: '',
    component: ViewReturnComponent
}];

@NgModule({
  declarations: [ViewReturnComponent, ViewFilesComponent, ModalReviewComponent],
  entryComponents: [ViewFilesComponent, ModalReviewComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatTooltipModule,
    SingleSelectListModule,
    MatRippleModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule
  ]
})

export class ViewReturnModule {}
