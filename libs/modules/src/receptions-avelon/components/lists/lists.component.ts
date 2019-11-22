import { ReceptionAvelonModel } from '@suite/services';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'suite-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {


  @Input('data') datos: Array<ReceptionAvelonModel.Data>

  constructor() { }

  ngOnInit() {
  }

  selected(dato: ReceptionAvelonModel.Data) {
     dato.selected = !dato.selected
     console.log(dato.selected)
  }
}
