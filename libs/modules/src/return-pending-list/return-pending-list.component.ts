import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material";
import {ReturnService} from "../../../services/src/lib/endpoint/return/return.service";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import Return = ReturnModel.Return;
import SearchParameters = ReturnModel.SearchParameters;
import SearchResponse = ReturnModel.SearchResponse;
import Filters = ReturnModel.Filters;
import Order = ReturnModel.Order;
import Pagination = ReturnModel.Pagination;
import {BrandModel} from "../../../services/src/models/endpoints/Brand";
import Brand = BrandModel.Brand;
import FilterOptions = ReturnModel.FilterOptions;
import FilterOptionsResponse = ReturnModel.FilterOptionsResponse;
import {Router} from "@angular/router";
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";
import {AuthenticationService, UserModel} from "@suite/services";
import User = UserModel.User;

@Component({
  selector: 'suite-return-pending-list',
  templateUrl: './return-pending-list.component.html',
  styleUrls: ['./return-pending-list.component.scss']
})
export class ReturnPendingListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  returns: Return[];
  filterOptions: FilterOptions = {
    ids: [],
    typeIds: [],
    providerIds: [],
    brandIds: [],
    datesLimit: [],
    warehouseIds: [],
    statuses: [],
    datesLastStatus: [],
    userIdsLastStatus: [],
    unitsPrepared: []
  };
  filters: Filters = {
    ids: [],
    typeIds: [],
    providerIds: [],
    brandIds: [],
    datesLimit: [],
    warehouseIds: [],
    statuses: [],
    datesLastStatus: [],
    userIdsLastStatus: [],
    unitsPrepared: []
  };
  order: Order = {
    field: 'id',
    direction: 'ASC'
  };
  pagination: Pagination = {
    limit: 10,
    page: 1
  };
  showFilters: boolean = false;
  allowedWarehouseIds: number[] = [];

  constructor(
    private router: Router,
    private returnService: ReturnService,
    private toolbarProvider: ToolbarProvider,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit() {
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
    const user = await this.authenticationService.getCurrentUser();
    if (user.hasWarehouse) {
      this.allowedWarehouseIds = [(await this.authenticationService.getStoreCurrentUser()).id]
    } else {
      for(let permit of user.permits){
        this.allowedWarehouseIds.push(permit.warehouse.id);
      }
    }
    if(this.allowedWarehouseIds.length == 0){
      this.allowedWarehouseIds = [0];
    }
    this.paginator.pageSizeOptions = [10, 30, 100];
    this.loadFilters();
    await this.loadReturns();
    this.paginator.page.subscribe(paginator => {
      this.pagination.limit = paginator.pageSize;
      this.pagination.page = paginator.pageIndex + 1;
      this.loadReturns();
    });
  }

  loadFilters(){
    this.returnService.getFilterOptions().then((response: FilterOptionsResponse) => {
      if(response.code == 200){
        this.filterOptions = {
          ids: response.data.ids.map(data => {
            return {
              id: data,
              value: data,
              checked: false,
              hide: false
            }
          }),
          typeIds: response.data.types.map(data => {
            const type = JSON.parse(data);
            return {
              id: type.id,
              value: type.name,
              checked: false,
              hide: false
            }
          }),
          providerIds: response.data.providers.map(data => {
            const provider = JSON.parse(data);
            return {
              id: provider.id,
              value: provider.name,
              checked: false,
              hide: false
            }
          }),
          brandIds: (function() {
            const brandGroups: any[] = response.data.brands.map(data => JSON.parse(data));
            let brands = [];
            for(let group of brandGroups){
              for(let brand of group){
                brands.push(brand);
              }
            }
            brands = brands.map(brand => JSON.stringify(brand));
            brands = brands.filter((v,i) => brands.indexOf(v) === i).map(brand => JSON.parse(brand));
            return brands.map(brand => {
              return {
                id: brand.id,
                value: brand.name,
                checked: false,
                hide: false
              }
            })
          })(),
          datesLimit: response.data.datesLimit.map(data => {
            const date = JSON.parse(data);
            return {
              id: date,
              value: this.getFormattedDate(date),
              checked: false,
              hide: false
            }
          }),
          warehouseIds: response.data.warehouses.map(data => {
            const warehouse = JSON.parse(data);
            return {
              id: warehouse.id,
              value: warehouse.reference,
              checked: false,
              hide: false
            }
          }),
          statuses: response.data.statuses.map(data => {
            return {
              id: data,
              value: this.getStatusName(data),
              checked: false,
              hide: false
            }
          }),
          datesLastStatus: response.data.datesLastStatus.map(data => {
            const dateLastStatus = JSON.parse(data);
            return {
              id: dateLastStatus,
              value: this.getFormattedDate(dateLastStatus),
              checked: false,
              hide: false
            }
          }),
          userIdsLastStatus: response.data.usersLastStatus.map(data => {
            const userLastStatus = JSON.parse(data);
            return {
              id: userLastStatus.id,
              value: userLastStatus.name,
              checked: false,
              hide: false
            }
          }),
          unitsPrepared: response.data.unitsPrepared.map(data => {
            return {
              id: data,
              value: data,
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
    this.filters.statuses = [2, 3, 4, 5];
    this.filters.warehouseIds = this.allowedWarehouseIds.length > 0 ? this.allowedWarehouseIds : [0];
    const parameters: SearchParameters = {
      filters: this.filters,
      order: this.order,
      pagination: this.pagination
    };
    this.returnService.postSearch(parameters).then((response: SearchResponse) => {
      if (response.code == 200) {
        this.returns = response.data.result;
        this.paginator.length = response.data.count;
      } else {
        console.error(response);
      }
    }).catch(console.error);
  }

  orderBy(column: string){
    if(this.order.field == column){
      this.order.direction == 'ASC' ? this.order.direction = 'DESC' : this.order.direction = 'ASC';
    }else{
      this.order.field = column;
    }
    this.loadReturns();
  }

  applyFilters(event, column: string){
    const values = [];
    for(let item of event.filters){
      if(item.checked){
        values.push(item.id);
      }
    }
    this.filters[column] = values.length < this.filterOptions[column].length ? values : [];
    this.loadReturns();
  }

  getStatusName(status: number): string{
    switch(status){
      case 0:
        return '';
      case 1:
        return 'Orden devolución';
      case 2:
        return 'Pendiente';
      case 3:
        return 'En proceso';
      case 4:
        return 'Preparado';
      case 5:
        return 'Pendiente recogida';
      case 6:
        return 'Recogido';
      case 7:
        return 'Facturado';
      default:
        return 'Desconocido'
    }
  }

  getFormattedDate(value: string): string{
    if(value && value != ''){
      const date = new Date(value);
      return date.getDay()+'/'+date.getMonth()+'/'+date.getFullYear();
    }else{
      return '';
    }
  }

  reset(){
    this.returns = [];
    this.filterOptions = {
      ids: [],
      typeIds: [],
      providerIds: [],
      brandIds: [],
      datesLimit: [],
      warehouseIds: [],
      statuses: [],
      datesLastStatus: [],
      userIdsLastStatus: [],
      unitsPrepared: []
    };
    this.filters = {
      ids: [],
      typeIds: [],
      providerIds: [],
      brandIds: [],
      datesLimit: [],
      warehouseIds: [],
      statuses: [],
      datesLastStatus: [],
      userIdsLastStatus: [],
      unitsPrepared: []
    };
    this.order = {
      field: 'id',
      direction: 'ASC'
    };
    this.pagination = {
      limit: 10,
      page: 1
    };
    this.showFilters = false;
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.loadFilters();
    this.loadReturns();
  }

}
