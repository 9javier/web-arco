import { ReceptionAvelonModel, ReceptionsAvelonService } from '@suite/services';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'suite-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  @Input('type') type: string;
  @Output() seleccionado = new EventEmitter();

  data: Array<ReceptionAvelonModel.Data> = [];

  constructor(
    private receptions: ReceptionsAvelonService
  ) {}

  ngOnInit() {
    let list;
    switch(this.type){
      case 'brands':
        list = this.receptions.getBrandsList();
        break;
      case 'models':
        list = this.receptions.getModelsList();
        break;
      case 'colors':
        list = this.receptions.getColorsList();
    }
    list.subscribe(datos => {
      setTimeout(() => {
        this.data = datos.sort((a, b) => a.name.trim().localeCompare(b.name.trim()));
        this.data.forEach(elem => {
          if (elem.selected) {
            this.seleccionado.emit(elem);
          } else {
            this.seleccionado.emit({ dato: undefined });
          }
        });
      }, 0);
    });
  }

  selected(dato: ReceptionAvelonModel.Data) {
    setTimeout(() => {
      dato.selected = !dato.selected;
      this.receptions.setEmitList({ type: this.type, dato });
      this.data.map(elem => {
        if (elem.id !== dato.id) {
          elem.selected = false;
        }
      });
    }, 0);
  }

}
