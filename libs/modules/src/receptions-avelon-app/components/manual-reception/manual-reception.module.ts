import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualReceptionComponent } from './manual-reception.component';
import {MatButtonModule, MatIconModule, MatListModule, MatRippleModule} from "@angular/material";
import {FilterItemsListModule} from "../filter-items-list/filter-items-list.module";
import {LoadingMessageModule} from "../../../components/loading-message/loading-message.module";
import {FabExtendedModule} from "../../../components/button/fab/fab-extended/fab-extended.module";
import {SizeInputModule} from "../../../components/size-input/size-input.module";
import {ModalModelImagesModule} from "../modal-model-images/modal-model-images.module";

@NgModule({
  declarations: [ManualReceptionComponent],
  entryComponents: [ManualReceptionComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    FilterItemsListModule,
    LoadingMessageModule,
    FabExtendedModule,
    SizeInputModule,
    ModalModelImagesModule
  ],
  exports: [ManualReceptionComponent]
})

export class ManualReceptionModule {}
