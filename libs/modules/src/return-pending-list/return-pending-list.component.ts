import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material";
import {ReturnService} from "../../../services/src/lib/endpoint/return/return.service";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import Return = ReturnModel.Return;
import SearchParameters = ReturnModel.SearchParameters;
import SearchResponse = ReturnModel.SearchResponse;
import Order = ReturnModel.Order;
import Pagination = ReturnModel.Pagination;
import FilterOptionsResponse = ReturnModel.FilterOptionsResponse;
import {Router} from "@angular/router";
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";
import {AuthenticationService} from "@suite/services";
import {TagsInputOption} from "../components/tags-input/models/tags-input-option.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'suite-return-pending-list',
  templateUrl: './return-pending-list.component.html',
  styleUrls: ['./return-pending-list.component.scss']
})
export class ReturnPendingListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  returns: Return[];
  filterOptions: {
    ids: TagsInputOption[],
    providerIds: TagsInputOption[],
    datesLimit: TagsInputOption[],
    warehouseIds: TagsInputOption[],
    statuses: TagsInputOption[],
    unitsPrepared: TagsInputOption[],
    unitsSelected: TagsInputOption[]
  } = {
    ids: [],
    providerIds: [],
    datesLimit: [],
    warehouseIds: [],
    statuses: [],
    unitsPrepared: [],
    unitsSelected: []
  };
  filters: FormGroup = this.formBuilder.group({
    ids: [],
    providerIds: [],
    datesLimit: [],
    warehouseIds: [],
    statuses: [],
    unitsPrepared: [],
    unitsSelected: []
  });
  order: Order = {
    field: 'id',
      direction: 'DESC'
  };
  pagination: Pagination = {
    limit: 10,
    page: 1
  };
  showFilters: boolean = false;
  allowedWarehouses: number[] = [];

  private ReturnStatus = ReturnModel.Status;
  private ReturnStatusNames = ReturnModel.StatusNames;

  constructor(
    private router: Router,
    private returnService: ReturnService,
    private toolbarProvider: ToolbarProvider,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private dateTimeParserService: DateTimeParserService
  ) {}

  ionViewWillEnter() {
    this.toolbarProvider.currentPage.next('Devoluciones Pendientes');
    this.toolbarProvider.optionsActions.next([
      {
        icon: 'refresh',
        label: 'Recargar',
        action: () => this.reset()
      },
      {
        icon: 'funnel',
        label: 'Filtros',
        action: () => this.showFilters = !this.showFilters
      }
    ]);
  }

  async ngOnInit() {
    const user = await this.authenticationService.getCurrentUser();
    if (user.hasWarehouse) {
      this.allowedWarehouses = [(await this.authenticationService.getStoreCurrentUser()).id]
    } else {
      for(let permit of user.permits){
        this.allowedWarehouses.push(permit.warehouse.id);
      }
    }
    if(this.allowedWarehouses.length == 0){
      this.allowedWarehouses = [0];
    }
    this.paginator.pageSizeOptions = [10, 30, 100];
    this.paginator.pageSize = 10;
    this.loadFilters();
    await this.loadReturns();
    this.paginator.page.subscribe(async paginator => {
      this.pagination.limit = paginator.pageSize;
      this.pagination.page = paginator.pageIndex + 1;
      await this.loadReturns();
    });
  }

  loadFilters(){
    this.returnService.getFilterOptions().then((response: FilterOptionsResponse) => {
      if(response.code == 200){
        this.filterOptions = {
          ids: response.data.ids.map(data => {
            return {
              id: data,
              name: String(data),
              value: String(data),
              checked: false,
              hide: false
            }
          }),
          providerIds: response.data.providers.map(data => {
            const provider = JSON.parse(data);
            return {
              id: provider.id,
              name: provider.name,
              value: provider.name,
              checked: false,
              hide: false
            }
          }),
          datesLimit: response.data.datesReturnBefore.map(data => {
            const date = JSON.parse(data);
            return {
              id: date,
              name: this.getFormattedDate(date),
              value: this.getFormattedDate(date),
              checked: false,
              hide: false
            }
          }),
          warehouseIds: response.data.warehouses.map(data => {
            const warehouse = JSON.parse(data);
            return {
              id: warehouse.id,
              name: warehouse.reference,
              value: warehouse.reference,
              checked: false,
              hide: false
            }
          }),
          statuses: response.data.statuses.map(data => {
            return {
              id: data,
              name: this.getStatusName(data),
              value: this.getStatusName(data),
              checked: false,
              hide: false
            }
          }),
          unitsPrepared: response.data.unitsPrepared.map(data => {
            return {
              id: data,
              name: String(data),
              value: String(data),
              checked: false,
              hide: false
            }
          }),
          unitsSelected: response.data.unitsSelected.map(data => {
            return {
              id: data,
              name: String(data),
              value: String(data),
              checked: false,
              hide: false
            }
          })
        }
      }else{
        console.error(response);
      }
    }).catch(console.error);
  }

  async loadReturns() {
    if (!this.filters.value.statuses || this.filters.value.statuses.length <= 0) {
      this.filters.value.statuses = [this.ReturnStatus.RETURN_ORDER, this.ReturnStatus.IN_PROCESS, this.ReturnStatus.PREPARED, this.ReturnStatus.PENDING_PICKUP]
    }
    this.filters.value.warehouseIds = this.allowedWarehouses.length > 0 ? this.allowedWarehouses : [0];
    const parameters: SearchParameters = {
      filters: this.filters.value,
      order: this.order,
      pagination: this.pagination,
      isAl: true
    };
    this.returnService.postSearchHistoricFalse(parameters).then((response: SearchResponse) => {
      if (response.code == 200) {
        this.returns = response.data.result;
        this.paginator.length = response.data.count;
      } else {
        console.error(response);
      }
    }).catch(console.error);
  }

  getStatusName(status: number): string {
    const returnItem = this.ReturnStatusNames.find(r => r.id == status);
    if (returnItem) {
      return returnItem.name;
    }

    return 'Desconocido';
  }

  getFormattedDate(value: string): string {
    if (value && value != '') {
      return this.dateTimeParserService.dateMonthYear(value);
    } else {
      return '';
    }
  }

  async reset() {
    this.returns = [];
    this.filterOptions = {
      ids: [],
      providerIds: [],
      datesLimit: [],
      warehouseIds: [],
      statuses: [],
      unitsPrepared: [],
      unitsSelected: []
    };
    this.filters = this.formBuilder.group({
      ids: [],
      providerIds: [],
      datesLimit: [],
      warehouseIds: [],
      statuses: [],
      unitsPrepared: [],
      unitsSelected: []
    });
    this.order= {
      field: 'id',
      direction: 'DESC'
    };
    this.pagination = {
      limit: 10,
      page: 1
    };
    this.showFilters = false;
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.loadFilters();
    await this.loadReturns();
  }

}
