import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RailsConfigurationComponent } from './rails-configuration.component';
import { IonicModule } from '@ionic/angular';
import { MatTableModule } from '@angular/material'  
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [RailsConfigurationComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatTableModule,
    MatGridListModule
  ],
  entryComponents:[RailsConfigurationComponent],
  exports:[
    RailsConfigurationComponent
  ]
})
export class RailsConfigurationModule { }
