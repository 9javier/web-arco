import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material'  
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NewRuleComponent } from './new-rule/new-rule.component';


@NgModule({
  declarations: [NewRuleComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatCheckboxModule
  ], 
  entryComponents: [NewRuleComponent]
})
export class RulesModule { }
