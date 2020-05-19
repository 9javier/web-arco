import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from '@ionic/angular';
import { NewReturnComponent } from './new-return.component';
import {FormsModule} from "@angular/forms";
import {SelectConditionComponent} from "./select-condition/select-condition.component";
import {MatTooltipModule, MatRippleModule, MatCardModule} from "@angular/material";
import {SelectableListComponent} from "./modals/selectable-list/selectable-list.component";
import {SingleSelectListModule} from "../components/single-select-list/single-select-list.module";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

const routes: Routes = [{
    path: '',
    component: NewReturnComponent
}];

@NgModule({
  declarations: [NewReturnComponent, SelectConditionComponent, SelectableListComponent],
  entryComponents: [SelectConditionComponent, SelectableListComponent],
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
    MatIconModule
  ]
})

export class NewReturnModule {}
