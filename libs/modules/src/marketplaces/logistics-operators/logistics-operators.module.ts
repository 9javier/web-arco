import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MatListModule } from '@angular/material/list';
import {MatRadioModule, MatSelectModule, MatTableModule} from '@angular/material'
import { MatCheckboxModule } from '@angular/material/checkbox';

import {NewOperatorRuleComponent} from "./new-operator-rule/new-operator-rule.component";
import {FormsModule} from "@angular/forms";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import {UpdateOperatorRuleComponent} from "./update-operator-rule/update-operator-rule.component";



@NgModule({
  declarations: [NewOperatorRuleComponent, UpdateOperatorRuleComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule,
    MatPaginatorModule,
    MatExpansionModule
  ],
  entryComponents: [NewOperatorRuleComponent, UpdateOperatorRuleComponent]
})
export class LogisticsOperatorsModule { }
