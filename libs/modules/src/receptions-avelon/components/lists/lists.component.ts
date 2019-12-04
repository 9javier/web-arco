import { ReceptionAvelonModel } from '@suite/services';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'suite-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {


  @Input('data') datos: Array<ReceptionAvelonModel.Data> = []
  @Input('type') type: string
  @Output() seleccionado = new EventEmitter()


  constructor() { }

  ngOnInit() {
    console.log(this.datos); 
    this.datos.forEach(elem => {
      if (elem.selected) {
        this.seleccionado.emit(elem)
      }else {
        this.seleccionado.emit({dato: undefined})
      }
    });
  }
  
  selected(dato: ReceptionAvelonModel.Data) {
     dato.selected = !dato.selected
     if (dato.selected) {
       this.seleccionado.emit({ type: this.type, dato})
     }else{
      this.seleccionado.emit({ type: this.type, dato: undefined})
     }
     this.datos.map(elem => {
      if (elem.id !== dato.id) {
        elem.selected = false
      }
     });
     console.log(dato.selected)
  }
}
