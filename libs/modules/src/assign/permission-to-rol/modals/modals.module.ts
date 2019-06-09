import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateComponent } from './update/update.component';
import { ComponentsModule } from '../components/components.module';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule as SuiteComponents } from '@suite/common-modules';

@NgModule({
  entryComponents:[UpdateComponent],
  declarations: [UpdateComponent],
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    SuiteComponents
  ],
  exports:[UpdateComponent]
})
export class ModalsModule { }
