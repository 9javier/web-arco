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

@Component({
  selector: 'suite-return-tracking-list',
  templateUrl: './return-tracking-list.component.html',
  styleUrls: ['./return-tracking-list.component.scss']
})
export class ReturnTrackingListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  returns: Return[];
  filters: Filters ={
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
    limit: 20,
    page: 1
  };

  constructor(
    private returnService: ReturnService
  ) {}

  ngOnInit() {
    this.paginator.pageSizeOptions = [20, 50, 100];
    this.loadReturns();
    this.paginator.page.subscribe(paginator => {
      this.pagination.limit = paginator.pageSize;
      this.pagination.page = paginator.pageIndex+1;
      this.loadReturns();
    });
  }

  loadReturns(){
    const parameters: SearchParameters = {
      filters: this.filters,
      order: this.order,
      pagination: this.pagination
    };
    this.returnService.postSearch(parameters).then((response: SearchResponse) => {
      if(response.code == 200){
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

  getStatusName(status: number): string{
    switch(status){
      case 1:
        return 'Orden devolución';
      case 2:
        return 'En proceso';
      case 3:
        return 'Preparado';
      case 4:
        return 'Pendiente recogida';
      case 5:
        return 'Recogido';
      case 6:
        return 'Facturado';
      default:
        return 'Desconocido'
    }
  }

  getFormattedDate(value: string): string{
    const date = new Date(value);
    return date.getDay()+'/'+date.getMonth()+'/'+date.getFullYear();
  }

  getBrandNameList(brands: Brand[]): string{
    return brands.map(brand => brand.name).join('/');
  }

}
