import {Component, OnInit, ViewChild} from '@angular/core';
import {IncidencesService} from "../../../services/src/lib/endpoint/incidences/incidences.service";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {IncidenceModel} from "../../../services/src/models/endpoints/Incidence";
import {MatSort, PageEvent, Sort} from "@angular/material";
import {animate, state, style, transition, trigger} from "@angular/animations";
import { IntermediaryService } from '@suite/services';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import {FilterButtonComponent} from "../components/filter-button/filter-button.component";

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

  public displayedColumns = ['id', 'type', 'process', 'date', 'time', 'user', 'code', 'model', 'size', 'brand', 'model-name', 'color', 'lifestyle', 'season', 'warehouse', 'location', 'destiny', 'sorter-way', /*'history',*/ 'status', 'user-status', 'date-status', 'time-status'];
  public incidences: IncidenceModel.Incidence[] = [];
  public typeFilters = IncidenceModel.TypeFilters;
  public listAvailableStatus: any[] = [];

  public paginatorPagerValues = [20, 50, 100];
  private currentPageFilter: IncidenceModel.SearchParameters;

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
    public incidencesService: IncidencesService,
    private dateTimeParserService: DateTimeParserService,
    private intermediaryService: IntermediaryService
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
    this.listenPaginatorChanges();
  }

  listenPaginatorChanges() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.intermediaryService.presentLoading('Cargando incidencias...').then(() => {
        this.currentPageFilter.page = page.pageIndex;
        this.currentPageFilter.size = page.pageSize;

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
      this.searchIncidences(this.currentPageFilter);
      });
    });
    this.intermediaryService.presentLoading('Cargando incidencias...').then(() => {
      this.searchIncidences(this.currentPageFilter);
    });
  }

  private searchIncidences(parameters: IncidenceModel.SearchParameters) {
    this.incidencesService
      .postSearch(parameters)
      .then((res: IncidenceModel.ResponseSearch) => {
        this.intermediaryService.dismissLoading();
        if (res.code === 200) {
          this.listAvailableStatus = res.data.listAvailableStatus;
          this.incidences = res.data.incidences;
          this.incidencesService.incidencesQuantityList = res.data.count_search;
          this.paginator.length = res.data.count_search;
          this.paginator.pageIndex = res.data.pagination ? res.data.pagination.selectPage: this.currentPageFilter.page;
          this.paginator.lastPage = res.data.pagination ? res.data.pagination.lastPage : Math.ceil(res.data.count_search/this.currentPageFilter.size);
          this.incidencesService.incidencesUnattendedQuantity = res.data.count_search;
          this.incidencesService.incidencesList = res.data.incidences;
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
      this.incidencesService
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
      this.incidencesService
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
