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
import {NavigationEnd, Router} from "@angular/router";
import {SupplierConditionModel} from "../../../services/src/models/endpoints/SupplierCondition";
import {MatTableDataSource} from "@angular/material/table";
import * as Filesave from 'file-saver';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, of, Observable } from 'rxjs';
import {IntermediaryService} from "@suite/services";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'suite-return-tracking-list',
  templateUrl: './return-tracking-list.component.html',
  styleUrls: ['./return-tracking-list.component.scss']
})
export class ReturnTrackingListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public pagerValues = [20, 50, 100];
  public dataSource = null;
  public displayedColumns: string[] = ['id', 'type', 'provider', 'brand', 'maxDate', 'warehouse', 'status', 'ueDate', 'ueUser', 'unities'];

  returns: Return[];
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
  order: Order = {
    field: 'id',
    direction: 'ASC'
  };
  pagination: Pagination = {
    limit: this.pagerValues[0],
    page: 1
  };

  constructor(
    public router: Router,
    private returnService: ReturnService,
    private intermediaryService: IntermediaryService,
    private dateTimeParserService: DateTimeParserService
  ) {
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd && val && val.url == '/return-tracking-list'){
        if(typeof this.returns !== 'undefined'){
          this.reset();
        }
      }
    });
  }

  ngOnInit() {
    this.paginator.pageSizeOptions = this.pagerValues;
    this.loadFilters();
    this.loadReturns();
    this.paginator.page.subscribe(paginator => {
      this.pagination.limit = paginator.pageSize;
      this.pagination.page = paginator.pageIndex+1;
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

  loadReturns(){
    const parameters: SearchParameters = {
      filters: this.filters,
      order: this.order,
      pagination: this.pagination
    };
    this.returnService.postSearchHistoricFalse(parameters).then((response: SearchResponse) => {
      if(response.code == 200){
        this.dataSource = new MatTableDataSource<SupplierConditionModel.SupplierCondition>(response.data.result);
        this.returns = response.data.result;
        this.paginator.length = response.data.count;
      }else{
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

  getFormattedDate(value: string): string {
    if (value && value != '') {
      return this.dateTimeParserService.dateMonthYear(value);
    } else {
      return '';
    }
  }

  getBrandNameList(brands: Brand[]): string{
    return brands.map(brand => brand.name).join('/');
  }

  reset(){
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
      limit: this.pagerValues[0],
      page: 1
    };
    this.paginator.pageSize = this.pagerValues[0];
    this.paginator.pageIndex = 0;
    this.loadFilters();
    this.loadReturns();
  }

  /**
   * @description Eviar parametros y recibe un archivo excell
   */
  async fileExcell() {
    this.intermediaryService.presentLoading('Descargando Archivo Excel').then(()=>{
      const parameters: SearchParameters = {
        filters: this.filters,
        order: this.order,
        pagination: this.pagination
      };
      this.returnService.getFileExcell(parameters).pipe(
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
}
