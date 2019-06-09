import { NgModule } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RoleFormComponent } from './role-form/role-form.component';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatListModule } from '@angular/material/list'

@NgModule({
  entryComponents:[RoleFormComponent],
  declarations: [RoleFormComponent],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatListModule
  ],
  exports:[RoleFormComponent]
})
export class ComponentsModule { }
