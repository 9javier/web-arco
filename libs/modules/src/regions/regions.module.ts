import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatCheckboxModule, MatPaginatorModule, MatListModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { IonicModule } from '@ionic/angular';
import { RegionsComponent } from './regions.component';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './modal/store/store.component';
import { UpdateComponent } from './modal/update/update.component';
import { InfoComponent } from './modal/info/info.component';


const routes: Routes = [
  {
    path: '',
    component: RegionsComponent,
  }
];
@NgModule({
  declarations: [RegionsComponent, StoreComponent,UpdateComponent, InfoComponent],
  entryComponents: [RegionsComponent, StoreComponent,UpdateComponent, InfoComponent],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    CdkTableModule,
    MatPaginatorModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule.forChild(routes),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegionsModule { }
