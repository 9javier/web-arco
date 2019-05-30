import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReversePipe } from "./reverse/reverse.pipe";

@NgModule({
  imports: [CommonModule],
  providers: [ReversePipe],
  exports: [ReversePipe],
  declarations: [ReversePipe]
})
export class PipesModule {}
