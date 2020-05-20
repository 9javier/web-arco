import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataComponent } from './data.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {SelectableListComponent} from "../selectable-list/selectable-list.component";
import {SingleSelectListModule} from "../../../components/single-select-list/single-select-list.module";

@NgModule({
  declarations: [DataComponent, SelectableListComponent],
  entryComponents: [SelectableListComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CommonModule,
    SingleSelectListModule
  ],
  exports:[DataComponent]
})
export class DataModule { }
