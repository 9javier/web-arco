import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RulesComponent } from './rules.component';
import { NewRuleComponent } from './new-rule/new-rule.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [NewRuleComponent],
  imports: [
    CommonModule,
    IonicModule
  ], 
  entryComponents: [NewRuleComponent]
})
export class RulesModule { }
