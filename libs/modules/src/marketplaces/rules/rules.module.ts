import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MatListModule } from '@angular/material/list';
import {MatRadioModule, MatSelectModule, MatTableModule} from '@angular/material'
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NewRuleComponent } from './new-rule/new-rule.component';
import {FormsModule} from "@angular/forms";
import { ManageFilteredProductsComponent } from './manage-filtered-products/manage-filtered-products/manage-filtered-products.component';


@NgModule({
  declarations: [NewRuleComponent, ManageFilteredProductsComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule
  ], 
  entryComponents: [NewRuleComponent, ManageFilteredProductsComponent]
})
export class RulesModule { }
