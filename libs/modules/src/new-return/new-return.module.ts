import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from '@ionic/angular';
import { NewReturnComponent } from './new-return.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectConditionComponent} from "./select-condition/select-condition.component";
import {MatTooltipModule, MatRippleModule, MatCardModule} from "@angular/material";
import {SelectableListComponent} from "./modals/selectable-list/selectable-list.component";
import {SingleSelectListModule} from "../components/single-select-list/single-select-list.module";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {NewReturnUnitiesComponent} from "../new-return-unities/new-return-unities.component";
import {MatTableModule} from "@angular/material/table";
import {DefectiveProductsComponent} from "../new-return-unities/defective-products/defective-products.component";
import {ProductsComponent} from "../new-return-unities/products/products.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";

const routes: Routes = [{
    path: '',
    component: NewReturnComponent
}, {
    path: 'unities/:id',
    component: NewReturnUnitiesComponent
}];

@NgModule({
  declarations: [NewReturnComponent, SelectConditionComponent, SelectableListComponent, NewReturnUnitiesComponent, DefectiveProductsComponent, ProductsComponent],
  entryComponents: [SelectConditionComponent, SelectableListComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatTooltipModule,
    SingleSelectListModule,
    MatRippleModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ]
})

export class NewReturnModule {}
