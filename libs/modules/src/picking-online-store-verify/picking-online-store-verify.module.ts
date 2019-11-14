import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PickingOnlineStoreVerifyComponent } from './picking-online-store-verify.component';
import {MatCheckboxModule, MatGridListModule, MatTableModule} from "@angular/material";
import {CdkTableModule} from "@angular/cdk/table";
import {PickingOnlineStoreVerifyRoutingModule} from "./picking-online-store-verify-routing.module";
import {ScannerManualModule} from "../components/scanner-manual/scanner-manual.module";

@NgModule({
  declarations: [PickingOnlineStoreVerifyComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    PickingOnlineStoreVerifyRoutingModule,
    ScannerManualModule
  ],
  entryComponents: [PickingOnlineStoreVerifyComponent]
})
export class PickingOnlineStoreVerifyModule {}
