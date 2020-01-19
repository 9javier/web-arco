import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListasProductosComponent } from './listas-productos/listas-productos.component';

@NgModule({
  declarations: [ListasProductosComponent],
  exports:[ListasProductosComponent],
  imports: [
    CommonModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ListaModule { }
