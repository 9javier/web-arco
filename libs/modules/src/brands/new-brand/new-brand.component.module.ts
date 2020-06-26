import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewBrandComponent } from './new-brand.component';
import { MatListModule } from '@angular/material';
import { MatCheckboxModule, MatSortModule, MatTableModule,MatRippleModule, MatPaginatorModule } from '@angular/material';
import { FilterButtonModule } from "../../components/filter-button/filter-button.module";
import { PaginatorComponentModule } from '../../components/paginator/paginator.component.module';
import {MatChipsModule, MatDividerModule, MatIconModule, MatSelectModule} from "@angular/material";
import { MatExpansionModule, MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [NewBrandComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatListModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatExpansionModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatTableModule,
    MatRippleModule,
  ],
  exports:[NewBrandComponent],
  entryComponents:[],
  providers:[]
})
export class NewBrandModule { }
