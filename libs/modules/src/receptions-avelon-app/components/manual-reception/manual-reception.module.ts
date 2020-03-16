import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualReceptionComponent } from './manual-reception.component';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatRippleModule,
  MatTooltipModule
} from "@angular/material";
import {FilterItemsListModule} from "../filter-items-list/filter-items-list.module";
import {LoadingMessageModule} from "../../../components/loading-message/loading-message.module";
import {FabExtendedModule} from "../../../components/button/fab/fab-extended/fab-extended.module";
import {SizeInputModule} from "../../../components/size-input/size-input.module";
import {ModalModelImagesModule} from "../modal-model-images/modal-model-images.module";
import {ModalDestinyReceptionModule} from "../../modals/modal-model-images/destiny-reception.module";

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
    ModalModelImagesModule,
    MatTooltipModule,
    MatCardModule,
    ModalDestinyReceptionModule
  ],
  exports: [ManualReceptionComponent]
})

export class ManualReceptionModule {}
