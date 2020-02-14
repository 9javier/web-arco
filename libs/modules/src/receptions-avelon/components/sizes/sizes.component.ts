import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReceptionAvelonModel, ReceptionsAvelonService } from '@suite/services';

@Component({
  selector: 'suite-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {

  @Output() seleccionado = new EventEmitter()
  datos: Array<ReceptionAvelonModel.Data> = [];
  constructor(private receptions: ReceptionsAvelonService) { }

  ngOnInit() {
    this.receptions.getSizesList().subscribe(datos => {
      this.datos = datos
      this.datos.forEach(elem => {
        if (elem.selected) {
          this.seleccionado.emit(elem)
        }else {
          this.seleccionado.emit({dato: undefined})
        }
      });

    })
  }

  selected(dato: ReceptionAvelonModel.Data) {
    setTimeout(() => {
      dato.selected = !dato.selected
      if (dato.selected) {
        this.receptions.setEmitList({dato})
      }else {
        this.receptions.setEmitList({dato})
      }
      this.datos.map(elem => {
        if (elem.id !== dato.id) {
          elem.selected = false
        }
       });
    }, 0);
     
 }

}
