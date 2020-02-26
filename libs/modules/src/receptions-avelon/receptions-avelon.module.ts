import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ReceptionsAvelonComponent } from './receptions-avelon.component';
import { ListsComponent } from './components/lists/lists.component';
import { SizesComponent } from './components/sizes/sizes.component';
import { VirtualKeyboardModule } from '../components/virtual-keyboard/virtual-keyboard.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ScreenResultComponent } from './components/screen-result/screen-result.component';
import {
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule
} from "@angular/material";
import {InfoModalModule} from "./info-modal/info-modal.module";
import {SizeInputModule} from "../components/size-input/size-input.module";


const routes: Routes = [
  {
    path: '',
    component: ReceptionsAvelonComponent
  }
];
@NgModule({
  declarations: [ReceptionsAvelonComponent, ListsComponent, SizesComponent, ScreenResultComponent],
  entryComponents: [ReceptionsAvelonComponent, ListsComponent, SizesComponent, ScreenResultComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild(routes),
    VirtualKeyboardModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    InfoModalModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    SizeInputModule,
    MatTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReceptionsAvelonModule { }
