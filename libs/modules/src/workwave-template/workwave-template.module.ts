import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatTableModule, MatCheckboxModule, MatGridListModule, MatRadioModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { WorkwaveTemplateRoutingModule } from "./workwave-template-routing.module";
import { WorkwaveTemplateComponent } from "./workwave-template.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListWorkwaveTemplateComponent} from "./list/list.component";
import {TitleListWorkwaveTemplateComponent} from "./list/list-title/list-title.component";
import {WorkwaveListWorkwaveTemplateComponent} from "./list/list-workwave/list-workwave.component";

@NgModule({
  declarations: [WorkwaveTemplateComponent, ListWorkwaveTemplateComponent, TitleListWorkwaveTemplateComponent, WorkwaveListWorkwaveTemplateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    WorkwaveTemplateRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    MatRadioModule
  ],
  entryComponents: [ListWorkwaveTemplateComponent, TitleListWorkwaveTemplateComponent, WorkwaveListWorkwaveTemplateComponent]
})
export class WorkwaveTemplateModule {}
