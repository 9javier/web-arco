import {Component, OnInit, ViewChild} from '@angular/core';
import {IncidencesReceptionService} from "../../../services/src/lib/endpoint/incidences-reception/incidences-reception.service";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {IncidenceModel} from "../../../services/src/models/endpoints/Incidence";
import {MatSort, PageEvent, Sort} from "@angular/material";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {IntermediaryService, InventoryService} from '@suite/services';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import {FilterButtonComponent} from "../components/filter-button/filter-button.component";
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import * as Filesave from 'file-saver';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, of, Observable } from 'rxjs';

@Component({
  selector: 'incidences-reception-list',
  templateUrl: './incidences-reception-list.component.html',
  styleUrls: ['./incidences-reception-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IncidencesReceptionListComponent implements OnInit {

  public displayedColumns = ['id', 'type', 'process', 'date', 'time', 'user', 'code', 'model', 'size', 'brand', 'model-name', 'color', 'lifestyle', 'season', 'warehouse', 'location', 'destiny', 'sorter-way', /*'history',*/ 'status', 'user-status', 'date-status', 'time-status'];
  public incidences: IncidenceModel.Incidence[] = [];
  public typeFilters = IncidenceModel.TypeFilters;
  public listAvailableStatus: any[] = [];

  public paginatorPagerValues = [20, 50, 100];
  private currentPageFilter: IncidenceModel.SearchParameters;
  form: FormGroup = this.formBuilder.group({
    filters: {},
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.paginatorPagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: '',
      order: 'DESC'
    })
  });

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('btnFilterTypes') btnFilterTypes: FilterButtonComponent;
  @ViewChild('btnFilterProcesses') btnFilterProcesses: FilterButtonComponent;
  @ViewChild('btnFilterDatesReport') btnFilterDatesReport: FilterButtonComponent;
  @ViewChild('btnFilterTimesReport') btnFilterTimesReport: FilterButtonComponent;
  @ViewChild('btnFilterUsersReport') btnFilterUsersReport: FilterButtonComponent;
  @ViewChild('btnFilterProducts') btnFilterProducts: FilterButtonComponent;
  @ViewChild('btnFilterModelReferences') btnFilterModelReferences: FilterButtonComponent;
  @ViewChild('btnFilterSizes') btnFilterSizes: FilterButtonComponent;
  @ViewChild('btnFilterBrands') btnFilterBrands: FilterButtonComponent;
  @ViewChild('btnFilterModelNames') btnFilterModelNames: FilterButtonComponent;
  @ViewChild('btnFilterColors') btnFilterColors: FilterButtonComponent;
  @ViewChild('btnFilterLifestyles') btnFilterLifestyles: FilterButtonComponent;
  @ViewChild('btnFilterSeasons') btnFilterSeasons: FilterButtonComponent;
  @ViewChild('btnFilterLocationWarehouses') btnFilterLocationWarehouses: FilterButtonComponent;
  @ViewChild('btnFilterLocations') btnFilterLocations: FilterButtonComponent;
  @ViewChild('btnFilterDestinyWarehouses') btnFilterDestinyWarehouses: FilterButtonComponent;
  @ViewChild('btnFilterLocationSorterWays') btnFilterLocationSorterWays: FilterButtonComponent;
  @ViewChild('btnFilterStatus') btnFilterStatus: FilterButtonComponent;
  @ViewChild('btnFilterUsersManage') btnFilterUsersManage: FilterButtonComponent;
  @ViewChild('btnFilterDatesManage') btnFilterDatesManage: FilterButtonComponent;
  @ViewChild('btnFilterTimesManage') btnFilterTimesManage: FilterButtonComponent;

  private textsTypedInFilters: any = {};

  constructor(
    public incidencesReceptionService: IncidencesReceptionService,
    private dateTimeParserService: DateTimeParserService,
    private intermediaryService: IntermediaryService,
    private inventoryService: InventoryService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.currentPageFilter = {
      order: {
        field: 'id',
        direction: 'DESC'
      },
      filters: {},
      page: 0,
      size: this.paginatorPagerValues[0]
    };
    this.form = this.formBuilder.group({
      filters: {},
      pagination: this.formBuilder.group({
        page: 1,
        limit: this.paginatorPagerValues[0]
      }),
      orderby: this.formBuilder.group({
        type: 'id',
        order: 'DESC'
      })
    });
    this.listenPaginatorChanges();
  }

  copyValuesToForm(){
    this.form = this.formBuilder.group({
      filters: this.currentPageFilter.filters,
      pagination: this.formBuilder.group({
        page: this.currentPageFilter.page,
        limit: this.currentPageFilter.size
      }),
      orderby: this.formBuilder.group({
        type: this.currentPageFilter.order.field,
        order: this.currentPageFilter.order.direction
      })
    });
  }

  listenPaginatorChanges() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.intermediaryService.presentLoading('Cargando incidencias...').then(() => {
        this.currentPageFilter.page = page.pageIndex;
        this.currentPageFilter.size = page.pageSize;

        this.copyValuesToForm();
        this.searchIncidences(this.currentPageFilter);
      });
    });
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.intermediaryService.presentLoading('Cargando incidencias...').then(() => {
        if (sort.direction == '') {
        this.currentPageFilter.order = {
          field: 'id',
          direction: 'ASC'
        };
      } else {
        this.currentPageFilter.order = {
          field: sort.active,
          direction: sort.direction.toUpperCase()
        };
      }
        this.copyValuesToForm();
        this.searchIncidences(this.currentPageFilter);
      });
    });
    this.intermediaryService.presentLoading('Cargando incidencias...').then(() => {
      this.searchIncidences(this.currentPageFilter);
    });
  }

  // TODO METODO LLAMAR ARCHIVO EXCELL
  /**
   * @description Eviar parametros y recibe un archivo excell
   */
  async fileExcell() {
    this.intermediaryService.presentLoading('Descargando Archivo Excel').then(()=>{
      const formToExcel = this.getFormValueCopy();
      this.incidencesReceptionService.getFileExcell(this.sanitize(formToExcel)).pipe(
        catchError(error => of(error)),
        // map(file => file.error.text)
      ).subscribe((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        Filesave.saveAs(blob, `${Date.now()}.xlsx`);
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess('Archivo descargado')
      }, error => console.log(error));
    });
  }

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  /**
   * clear empty values of objecto to sanitize it
   * @param object Object to sanitize
   * @return the sanitized object
   */
  sanitize(object) {
    /**mejorable */
    object = JSON.parse(JSON.stringify(object));
    if (!object.orderby.type) {
      delete object.orderby.type;
    } else {
      object.orderby.type = object.orderby.type;
    }
    if (!object.orderby.order) delete object.orderby.order;
    Object.keys(object).forEach(key => {
      if (object[key] instanceof Array) {
        if (object[key][0] instanceof Array) {
          object[key] = object[key][0];
        } else {
          for (let i = 0; i < object[key].length; i++) {
            if (object[key][i] === null || object[key][i] === "") {
              object[key].splice(i, 1);
            }
          }
        }
      }
      if (object[key] === null || object[key] === "") {
        delete object[key];
      }
    });
    return object;
  }

  private searchIncidences(parameters: IncidenceModel.SearchParameters) {
    this.incidencesReceptionService
      .postSearch(parameters)
      .then((res: IncidenceModel.ResponseSearch) => {
        this.intermediaryService.dismissLoading();
        if (res.code === 200) {
          this.listAvailableStatus = res.data.listAvailableStatus;
          this.incidences = res.data.incidences;
          this.incidencesReceptionService.incidencesQuantityList = res.data.count_search;
          this.paginator.length = res.data.count_search;
          this.paginator.pageIndex = res.data.pagination ? res.data.pagination.selectPage: this.currentPageFilter.page;
          this.paginator.lastPage = res.data.pagination ? res.data.pagination.lastPage : Math.ceil(res.data.count_search/this.currentPageFilter.size);
          this.incidencesReceptionService.incidencesUnattendedQuantity = res.data.count_search;
          this.incidencesReceptionService.incidencesList = res.data.incidences;
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar cargar las incidencias';
          if (res.errors) {
            errorMessage = res.errors;
          }
          this.intermediaryService.presentToastError(errorMessage);
        }
      }, (error) => {
        this.intermediaryService.dismissLoading();
        let errorMessage = 'Ha ocurrido un error al intentar cargar las incidencias';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        this.intermediaryService.presentToastError(errorMessage);
      });
  }

  filterAppliedForType(type: number): boolean {
    return !!this.currentPageFilter.filters[type];
  }

  applyFilters(event, type) {
    this.intermediaryService.presentLoading('Cargando incidencias...').then(() => {
      const filters = event.filters;
      this.currentPageFilter.filters[type] = filters.filter(f => f.checked);
      if (this.currentPageFilter.filters[type].length == filters.length) {
        delete this.currentPageFilter.filters[type];
      }
      this.textsTypedInFilters[type] = event.typedFilter;
      this.copyValuesToForm();
      this.searchIncidences(this.currentPageFilter);
    });
  }

  openFilterPopover(event, type) {
    let btnFiltersToUse: FilterButtonComponent = null;
    let typedTextForType: string = this.textsTypedInFilters[type];
    let currentFilter: any[] = this.currentPageFilter.filters[type];

    switch (type) {
      case 1:
        btnFiltersToUse = this.btnFilterTypes;
        break;
      case 2:
        btnFiltersToUse = this.btnFilterProcesses;
        break;
      case 3:
        btnFiltersToUse = this.btnFilterDatesReport;
        break;
      case 4:
        btnFiltersToUse = this.btnFilterTimesReport;
        break;
      case 5:
        btnFiltersToUse = this.btnFilterUsersReport;
        break;
      case 6:
        btnFiltersToUse = this.btnFilterProducts;
        break;
      case 7:
        btnFiltersToUse = this.btnFilterModelReferences;
        break;
      case 8:
        btnFiltersToUse = this.btnFilterSizes;
        break;
      case 9:
        btnFiltersToUse = this.btnFilterBrands;
        break;
      case 10:
        btnFiltersToUse = this.btnFilterModelNames;
        break;
      case 11:
        btnFiltersToUse = this.btnFilterColors;
        break;
      case 12:
        btnFiltersToUse = this.btnFilterLifestyles;
        break;
      case 13:
        btnFiltersToUse = this.btnFilterSeasons;
        break;
      case 14:
        btnFiltersToUse = this.btnFilterLocationWarehouses;
        break;
      case 15:
        btnFiltersToUse = this.btnFilterLocations;
        break;
      case 16:
        btnFiltersToUse = this.btnFilterDestinyWarehouses;
        break;
      case 17:
        btnFiltersToUse = this.btnFilterLocationSorterWays;
        break;
      case 18:
        btnFiltersToUse = this.btnFilterStatus;
        break;
      case 19:
        btnFiltersToUse = this.btnFilterUsersManage;
        break;
      case 20:
        btnFiltersToUse = this.btnFilterDatesManage;
        break;
      case 21:
        btnFiltersToUse = this.btnFilterTimesManage;
        break;
    }

    if (btnFiltersToUse) {
      this.incidencesReceptionService
        .postGetFilters({ type, currentFilter})
        .then((res: IncidenceModel.ResponseGetFilters) => {
          if (res.code == 200) {
            btnFiltersToUse.listItems = res.data;
            btnFiltersToUse.openFilterPopover(event, typedTextForType);
          }
        })
        .catch((error) => {
          console.error('catch error', error);
        });
    }
  }

  changeIncidenceStatus(incidence: IncidenceModel.Incidence) {
    const originalStatus = JSON.parse(JSON.stringify(incidence.status));
    setTimeout(() => {
      incidence.status.status = incidence.status.available_status.find(s => s.id == incidence.status.status.id);
      this.incidencesReceptionService
        .postChangeStatus(incidence.info.id, { newStatus: incidence.status.status.id })
        .then(async (res: IncidenceModel.ResponseChangeStatus) => {
          if (res.code == 201 && res.data.status) {
            incidence.status = res.data.status;
            await this.intermediaryService.presentToastSuccess(`Estado de la incidencia #${res.data.info.id} actualizado.`);
          } else if (res.code == 201) {
            await this.intermediaryService.presentToastSuccess(`Estado de la incidencia #${res.data.info.id} actualizado.`);
            this.intermediaryService.presentLoading('Recargando incidencias...').then(() => {
              this.searchIncidences(this.currentPageFilter);
            });
          } else {
            incidence.status = originalStatus;
            let errorMessage = 'Ha ocurrido un error al intentar actualizar el estado de la incidencia.';
            if (res.errors) {
              errorMessage = res.errors;
            }
            await this.intermediaryService.presentToastError(errorMessage);
          }
        }, async (error) => {
          incidence.status = originalStatus;
          let errorMessage = 'Ha ocurrido un error al intentar actualizar el estado de la incidencia.';
          if (error.error && error.error.errors) {
            errorMessage = error.error.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
        });
    }, 500);
  }
}
