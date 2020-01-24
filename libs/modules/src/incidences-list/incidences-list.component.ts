import {Component, OnInit, ViewChild} from '@angular/core';
import {IncidencesService} from "../../../services/src/lib/endpoint/incidences/incidences.service";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {IncidenceModel} from "../../../services/src/models/endpoints/Incidence";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {PageEvent} from "@angular/material";
import {animate, state, style, transition, trigger} from "@angular/animations";
import { IntermediaryService, TypeModel } from '@suite/services';
import AttendedOption = IncidenceModel.AttendedOption;
import { PaginatorComponent } from '../components/paginator/paginator.component';

@Component({
  selector: 'incidences-list',
  templateUrl: './incidences-list.component.html',
  styleUrls: ['./incidences-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IncidencesListComponent implements OnInit {

  public displayedColumns = ['id', 'type', 'process', 'date', 'time', 'user', 'code', 'model', 'size', 'brand', 'model-name', 'color', 'lifestyle', 'season', 'warehouse', 'location', 'destiny', 'sorter-way', 'history', 'status', 'user-status', 'date-status', 'time-status'];
  public incidences: Incidences[] = [];

  public expandedElement: IncidenceModel.Incidence | null;
  private actualPageFilter: IncidenceModel.SearchParameters;
  public typeSelected: TypeModel.Type;
  public listAttendedOptions: AttendedOption[];
  public attendedSelected: AttendedOption;
  public textToSearch: string;
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

  constructor(
    public incidencesService: IncidencesService,
    private dateTimeParserService: DateTimeParserService,
    private intermediaryService: IntermediaryService
  ) {}

  ngOnInit() {
    this.incidences = [
      {
        id: 1,
        type: 'Nuevo artículo registrado',
        process: 'Ubicación',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Pendiente',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 2,
        type: 'Ubicación desactivada',
        process: 'Gestión almacén',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Gestionado',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 3,
        type: 'Ubicación activada',
        process: 'Gestión almacén',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Pendiente',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 4,
        type: 'Movimiento global',
        process: 'Gestión almacén',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Gestionado',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 5,
        type: 'Ubicación bloqueada',
        process: 'Gestión almacén',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Pendiente',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 6,
        type: 'Ubicación desbloqueada',
        process: 'Gestión almacén',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Gestionado',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 7,
        type: 'Producto reetiquetado',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Pendiente',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 8,
        type: 'Calle errónea',
        process: 'Sorter',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Gestionado',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 9,
        type: 'Sin escaneo de entrada',
        process: 'Sorter',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Pendiente',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 10,
        type: 'Jaula vaciada',
        process: 'Ubicación',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Pendiente',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 11,
        type: 'Jaula vaciada',
        process: 'Picking',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Gestionado',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 12,
        type: 'Jaula vaciada',
        process: 'Vaciado sorter',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Gestionado',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      },
      {
        id: 13,
        type: 'Productos no encontrados',
        process: 'Picking',
        user: {
          id: 1,
          name: 'Paco'
        },
        date: '22/01/2020',
        time: '18:05',
        product: {
          reference: '001234567891234567',
          model: {
            name: 'Zapato Adidas',
            reference: '123456'
          },
          brand: 'Adidas',
          color: 'ROJO',
          size: 45,
          lifestyle: 'Hombre',
          season: 'Invierno',
          location: {
            location: 'P002A02C003',
            warehouse: '601'
          },
          destiny: '006',
          history: true,
          sorterWay: null
        },
        status: {
          date: '24/01/2020',
          time: '08:00',
          status: 'Mantener en almacén',
          user: {
            id: 2,
            name: 'Galvintec'
          }
        }
      }
    ];

    this.incidencesService.init();
    this.incidencesService.incidencesQuantityList
    this.typeSelected = this.incidencesService.listIncidencesTypes[0];
    this.listenPaginatorChanges();
    this.actualPageFilter = this.incidencesService.defaultFilters;


    this.listAttendedOptions = [
      {
        id: 0,
        value: 'Todas'
      },
      {
        id: 1,
        value: 'Atendidas'
      },
      {
        id: 2,
        value: 'No atendidas'
      }];
    this.attendedSelected = this.listAttendedOptions[0];
  }

  listenPaginatorChanges() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.actualPageFilter.page = page.pageIndex;
      this.actualPageFilter.size = page.pageSize;

      this.searchIncidences(this.actualPageFilter);
    });
    this.searchIncidences(this.actualPageFilter);
  }

  attendIncidence(event, incidence: IncidenceModel.Incidence) {
    event.stopPropagation();

    let incidenceAttended: boolean = !incidence.attended;
    let incidenceId: number = incidence.id;
    this.incidencesService
      .putUpdate(incidenceId, incidenceAttended)
      .then((data: Observable<HttpResponse<IncidenceModel.ResponseUpdate>>) => {
        data.subscribe((res: HttpResponse<IncidenceModel.ResponseUpdate>) => {
          if (res.body.code === 200 || res.body.code === 201) {
            let okMessage = '';
            if (incidenceAttended) {
              okMessage = 'La notificación se ha marcado como atendida';
            } else {
              okMessage = 'La notificación se ha marcado como desatendida';
            }

            this.intermediaryService.presentToastSuccess(okMessage);
            this.incidencesService.init(this.actualPageFilter);
          } else {
            this.intermediaryService.presentToastError(res.body.message);
          }
        });
      }, (error: HttpErrorResponse) => {
        this.intermediaryService.presentToastError(error.message);
      });
  }

  changeFilters(data: IncidenceModel.IncidenceFilters) {
    this.typeSelected = data.type;
    this.attendedSelected = data.attended;
    this.textToSearch = data.text;

    if (this.typeSelected.id === 0) {
      delete this.actualPageFilter.type;
    } else {
      this.actualPageFilter.type = this.typeSelected.id;
    }

    if (this.attendedSelected.id === 0) {
      delete this.actualPageFilter.attended;
    } else {
      this.actualPageFilter.attended = this.attendedSelected.id;
    }

    if (this.textToSearch) {
      this.actualPageFilter.text = this.textToSearch;
    } else {
      delete this.actualPageFilter.text;
    }

    this.actualPageFilter.page = 0;

    this.searchIncidences(this.actualPageFilter);
  }

  private searchIncidences(parameters: IncidenceModel.SearchParameters) {
    this.incidencesService
      .postSearch(parameters)
      .then((res: IncidenceModel.ResponseSearch) => {
        if (res.code === 200) {
          this.incidencesService.incidencesQuantityList = res.data.count_search;
          this.paginator.length = res.data.count;
          this.paginator.pageIndex = res.data.pagination ? res.data.pagination.selectPage: this.actualPageFilter.page;
          this.paginator.lastPage = res.data.pagination ? res.data.pagination.lastPage : Math.ceil(res.data.count/this.actualPageFilter.size);
          this.incidencesService.incidencesUnattendedQuantity = res.data.count;
          this.incidencesService.incidencesList = res.data.incidences;
        } else {
          console.error('Error to try search Incidences with Filters', res);
        }
      }, (error) => {
        console.error('Error to try search Incidences with Filters', error);
      });
  }

  showDateTime(dateToFormat) : string {
    return this.dateTimeParserService.dateTime(dateToFormat);
  }

}

interface Incidences {
  id: number;
  type: string,
  process?: string,
  date?: string,
  time?: string,
  user?: {
    id: number,
    name: string
  },
  product: {
    reference: string,
    model: {
      reference: string,
      name: string
    },
    size: number,
    brand: string,
    color: string,
    lifestyle: string,
    season: string,
    location: {
      warehouse: string,
      location: string
    },
    destiny: string,
    sorterWay: number,
    history: true
  },
  status: {
    status: string,
    user: {
      id: number,
      name: string
    },
    date: string,
    time: string
  }
}
