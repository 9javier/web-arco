import { Component, OnInit, Input } from '@angular/core';
import { ReceptionAvelonModel } from '@suite/services';

@Component({
  selector: 'suite-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {

  @Input('data') datos: Array<ReceptionAvelonModel.Data>

  constructor() { }

  ngOnInit() {
  }

  selected(dato: ReceptionAvelonModel.Data) {
    dato.selected = !dato.selected
 }

}
