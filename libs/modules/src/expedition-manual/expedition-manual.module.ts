import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule } from '@angular/material';
import { RouterModule, Routes } from "@angular/router";
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { FilterButtonModule } from "../components/filter-button/filter-button.module";
import { MatTooltipModule } from "@angular/material";
import { ExpeditionManualComponent } from './expedition-manual.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ListManualModule } from './list-manual/list-manual.module';
import { IncidencesManualModule } from './incidences-manual/incidences-manual.module';
import { LogisticOperatorModule } from './logistic-operator/logistic-operator.module';
import { LogisticOperatorComponent } from './logistic-operator/logistic-operator.component';
import { NewIncidenceComponent } from './new-incidence/new-incidence.component';
import { NewIncidenceModule } from './new-incidence/new-incidence.module';
import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { NgxFileDropModule } from  'ngx-file-drop' ;
const routes: Routes = [
  {
    path: '',
    component: ExpeditionManualComponent
  }
];



@NgModule({
  entryComponents: [LogisticOperatorComponent, NewIncidenceComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
    TagsInputModule,
    PaginatorComponentModule,
    FilterButtonModule,
    MatTooltipModule,
    FormsModule,
    MatCheckboxModule,
    MatRippleModule,
    MatSortModule,
    NgxFileDropModule,
    MatTabsModule,
    ListManualModule,
    IncidencesManualModule,
    LogisticOperatorModule,
    NewIncidenceModule
  ],
  declarations: [ExpeditionManualComponent]
})
export class ExpeditionManualModule { }
