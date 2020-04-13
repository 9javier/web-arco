import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UnfitOnlineProductsComponent } from './unfit-online-products.component';
import { CdkTableModule } from "@angular/cdk/table";
import { MatExpansionModule, MatGridListModule, MatPaginatorModule, MatTooltipModule } from "@angular/material";
import { TagsInputModule} from "../components/tags-input/tags-input.module";
import { RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: UnfitOnlineProductsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CdkTableModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    MatGridListModule,
    MatPaginatorModule,
    TagsInputModule,
    MatTooltipModule
  ],
  declarations: [UnfitOnlineProductsComponent]
})
export class UnfitOnlineProductsModule {}
