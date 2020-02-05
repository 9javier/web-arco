import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatListModule,
  MatDatepickerModule, MatInputModule, MatTooltipModule, MatIconModule, MatSortModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { JailRoutingModule } from './jail-routing.module';
import { JailComponent } from './jail.component';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import { DataModule } from './data/data.module';
import { BreadcrumbModule } from '../../../modules/src/components/breadcrumb/breadcrumb.module';
import { SendComponent } from './send/send.component';
import { MatFormFieldModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { SendPackingComponent } from './send-packing/send-packing.component';
import { ShowDestinationsComponent } from './show-destionations/show-destinations.component';
import { SendJailComponent } from './send-jail/send-jail.component';
import { AddDestinyComponent } from './add-destiny/add-destiny.component';
import { MultipleDestinationsComponent } from './multiple-destinations/multiple-destinations.component';
import { HistoryModalComponent } from './history-modal/history-modal.component';
import { HistoryWarehouseComponent } from './history-warehouse/history-warehouse.component';
import { HistoryWarehouseNMComponent } from './history-warehouse-no-modal/history-warehouse-no-modal.component';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    JailComponent,
    StoreComponent,
    UpdateComponent,
    SendComponent,
    SendPackingComponent,
    ShowDestinationsComponent,
    SendJailComponent,
    HistoryModalComponent,
    HistoryWarehouseComponent,
    HistoryWarehouseNMComponent,
    MultipleDestinationsComponent,
    AddDestinyComponent
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    JailRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    DataModule,
    MatPaginatorModule,
    MatListModule,
    FormsModule,
    BreadcrumbModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatSortModule
  ],
  entryComponents: [
    StoreComponent,
    SendComponent,
    SendPackingComponent,
    ShowDestinationsComponent,
    SendJailComponent,
    HistoryModalComponent,
    MultipleDestinationsComponent
  ],
  providers: [
    DatePipe,
    AddDestinyComponent,
    MultipleDestinationsComponent,
    HistoryModalComponent,

  ]
})
export class JailModule { }
