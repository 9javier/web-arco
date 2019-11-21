import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'suite-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {


  @Input('data') datos: Array<Datos>

  constructor() { }

  ngOnInit() {
  }

}

interface Datos {
  id: string;
  name: string;
  selected: string;
}
