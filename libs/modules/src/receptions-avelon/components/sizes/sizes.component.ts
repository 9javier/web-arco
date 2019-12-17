import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReceptionAvelonModel } from '@suite/services';

@Component({
  selector: 'suite-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {

  @Input('data') datos: Array<ReceptionAvelonModel.Data>
  @Output() seleccionado = new EventEmitter()
  constructor() { }

  ngOnInit() {
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
    console.log(dato.selected);
    
    if (dato.selected) {
      this.seleccionado.emit(dato)
    }else {
      this.seleccionado.emit({dato: undefined})
    }
    this.datos.map(elem => {
      if (elem.id !== dato.id) {
        elem.selected = false
      }
     });
 }

}
