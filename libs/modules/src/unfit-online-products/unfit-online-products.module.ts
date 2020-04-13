import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UnfitOnlineProductsComponent } from './unfit-online-products.component';
import { UnfitOnlineProductsRoutingModule } from "./unfit-online-products-routing.module";
import { CdkTableModule } from "@angular/cdk/table";
import { MatExpansionModule, MatGridListModule, MatPaginatorModule, MatTooltipModule } from "@angular/material";
import { TagsInputModule} from "../components/tags-input/tags-input.module";

@NgModule({
  declarations: [UnfitOnlineProductsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    UnfitOnlineProductsRoutingModule,
    CdkTableModule,
    FormsModule,
    MatExpansionModule,
    MatGridListModule,
    MatPaginatorModule,
    TagsInputModule,
    MatTooltipModule
  ],
  entryComponents: [UnfitOnlineProductsComponent]
})
export class UnfitOnlineProductsModule {}
