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
  brands: Array<ReceptionAvelonModel.Data> = [];
  models: Array<ReceptionAvelonModel.Data> = [];
  colors: Array<ReceptionAvelonModel.Data> = [];

  constructor(private receptions: ReceptionsAvelonService) {}

  ngOnInit() {
    console.log(this.type);

    switch (this.type) {
      case 'brands':
        this.receptions.getBrandsList().subscribe(datos => {
          setTimeout(() => {
            this.brands = datos;
            console.log('brands', this.brands);
            this.brands.forEach(elem => {
              if (elem.selected) {
                this.seleccionado.emit(elem);
              } else {
                this.seleccionado.emit({ dato: undefined });
              }
            });
          }, 0);
        });
        break;
      case 'models':
        this.receptions.getModelsList().subscribe(datos => {
          setTimeout(() => {
            this.models = datos;
            console.log('models', this.models);
            this.models.forEach(elem => {
              if (elem.selected) {
                this.seleccionado.emit(elem);
              } else {
                this.seleccionado.emit({ dato: undefined });
              }
            });
          }, 0);
        });
        break;
      case 'colors':
        setTimeout(() => {
          this.receptions.getColorsList().subscribe(datos => {
            this.colors = datos;
            console.log('colors', this.colors);
            this.colors.forEach(elem => {
              if (elem.selected) {
                this.seleccionado.emit(elem);
              } else {
                this.seleccionado.emit({ dato: undefined });
              }
            });
          });
        }, 0);
        break;
    }
  }

  async selected(dato: ReceptionAvelonModel.Data) {
    setTimeout(() => {
      console.log('selected');
      
      dato.selected = !dato.selected;
      console.log(dato.selected);
      
      if (dato.selected) {
        this.receptions.setEmitList({ type: this.type, dato })
        // this.seleccionado.emit({ type: this.type, dato });
      } else {
        this.receptions.setEmitList({ type: this.type, dato })
        // this.seleccionado.emit({ type: this.type, dato: undefined });
      }
      switch (this.type) {
        case 'models':
          this.models.map(elem => {
            if (elem.id !== dato.id) {
              elem.selected = false;
            }
          });
          break;
        case 'brands':
          this.brands.map(elem => {
            if (elem.id !== dato.id) {
              elem.selected = false;
            }
          });
          break;
        case 'colors':
          this.colors.map(elem => {
            if (elem.id !== dato.id) {
              elem.selected = false;
            }
          });
          break;
      }
    }, 0);
  }
}
