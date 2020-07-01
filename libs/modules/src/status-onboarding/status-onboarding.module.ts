import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MatCheckboxModule, MatTableModule } from '@angular/material';
import { MatListModule } from '@angular/material';
import { RouterModule, Routes } from "@angular/router";
import { MatPaginatorModule } from '@angular/material';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { StatusOnBoardingComponent } from './status-onboarding.component';
import {
  MatRippleModule,
} from '@angular/material';
import { FormsModule} from '@angular/forms';

import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatSelectModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';

import {InfoModalModule} from "./info-modal/info-modal.module";
import {JsonModalModule} from "./json-modal/json-modal.module";

const routes: Routes = [
  {
    path: '',
    component: StatusOnBoardingComponent
  }
];

@NgModule({
  declarations: [StatusOnBoardingComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    MatPaginatorModule,
    FormsModule,
    PaginatorComponentModule,
    InfoModalModule,
    JsonModalModule
  ],
  entryComponents:[],
  providers:[
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StatusOnBoardingModule { }
