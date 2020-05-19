import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectableListComponent } from './selectable-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {SingleSelectListModule} from "../../../components/single-select-list/single-select-list.module";

@NgModule({
  declarations: [SelectableListComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CommonModule,
    SingleSelectListModule
  ],
  exports:[SelectableListComponent]
})
export class SelectableListModule { }
