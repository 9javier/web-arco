import {Component, OnInit, ViewChild} from '@angular/core';
import {DeliveryRequestModel} from "../../../services/src/models/endpoints/DeliveryRequest";
import DeliveryRequest = DeliveryRequestModel.DeliveryRequest;
import {PickingStoreService} from "../../../services/src/lib/endpoint/picking-store/picking-store.service";
import ExpiredReservesResponse = DeliveryRequestModel.ExpiredReservesResponse;
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {MatPaginator} from "@angular/material";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import Pagination = ReturnModel.Pagination;
import {PickingProvider} from "../../../services/src/providers/picking/picking.provider";
import {PickingStoreModel} from "../../../services/src/models/endpoints/PickingStore";
import Filters = PickingStoreModel.Filters;
import {ReservesService} from "../../../services/src/lib/scandit/Reserves/reserves.service";

@Component({
  selector: 'suite-free-expired-reserves',
  templateUrl: './free-expired-reserves.component.html',
  styleUrls: ['./free-expired-reserves.component.scss'],
})
export class FreeExpiredReservesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  selected: boolean = true;
  reserves: DeliveryRequest[] = [];
  pagination: Pagination = {
    limit: 10,
    page: 1
  };

  constructor(
    private pickingStoreService: PickingStoreService,
    private dateTimeParserService: DateTimeParserService,
    private pickingProvider: PickingProvider,
    private reservesScanditService: ReservesService
  ) {}

  ngOnInit() {
    this.paginator.pageSizeOptions = [10, 30, 100];
    this.paginator.pageSize = 10;
    this.load();
    this.paginator.page.subscribe(async paginator => {
      this.pagination.limit = paginator.pageSize;
      this.pagination.page = paginator.pageIndex + 1;
      this.load();
    });
  }

  load(){
    this.pickingStoreService.getExpiredReserves({pagination: this.pagination}).then((response: ExpiredReservesResponse) => {
      if(response.code == 200){
        this.reserves = response.data[0];
        this.paginator.length = response.data[1];
        for(let reserve of this.reserves){
          reserve.selected = true;
        }
      }else{
        console.error(response);
      }
    }).catch(console.error)
  }

  refresh(){
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.load();
  }

  checkboxChange(){
    let anySelected: boolean = false;
    for(let reserve of this.reserves){
      if(reserve.selected){
        anySelected = true;
        break;
      }
    }
    this.selected = this.reserves.length > 0 && anySelected;
  }

  free(){
    if((<any>window).cordova) {
      //get selected reserves
      const selectedReserves: DeliveryRequest[] = [];
      for(let reserve of this.reserves){
        if(reserve.selected) {
          selectedReserves.push(reserve);
        }
      }
      //get filters
      const filters: Filters = {
        brands: [],
        colors: [],
        models: [],
        ordertypes: [
          {
            id: 1,
            name: 'Color',
          },
          {
            id: 2,
            name: 'Talla',
          },
          {
            id: 3,
            name: 'Ref. modelo',
          },
          {
            id: 4,
            name: 'Fecha',
          },
          {
            id: 5,
            name: 'Marca',
          },
          {
            id: 6,
            name: 'Nombre modelo',
          },
        ],
        sizes: [],
        types: [
          {
            id: 1,
            name: 'Tiendas',
          },
          {
            id: 2,
            name: 'Online Domicilio',
          },
          {
            id: 3,
            name: 'Online Tienda',
          },
        ]
      };
      for(let reserve of selectedReserves){
        if(!filters.brands.map(brand => brand.name).includes(reserve.model.brand.name)){
          filters.brands.push({
            id: reserve.model.brand.id,
            name: reserve.model.brand.name
          });
        }
        if(!filters.colors.map(color => color.name).includes(reserve.model.color.name)){
          filters.colors.push({
            id: reserve.model.color.id,
            name: reserve.model.color.name
          });
        }
        if(!filters.models.map(model => model.id).includes(reserve.model.id)){
          filters.models.push({
            id: reserve.model.id,
            name: reserve.model.name,
            reference: reserve.model.reference
          });
        }
        if(!filters.sizes.map(size => size.name).includes(reserve.size.name)){
          filters.sizes.push({
            id: reserve.size.id,
            name: reserve.size.name,
            reference: reserve.size.reference
          });
        }
      }
      filters.brands = filters.brands.sort((a, b) => a.name.localeCompare(b.name));
      filters.colors = filters.colors.sort((a, b) => a.name.localeCompare(b.name));
      filters.models = filters.models.sort((a, b) => a.reference.localeCompare(b.reference));
      filters.sizes = filters.sizes.sort((a, b) => a.name.localeCompare(b.name));
      //set picking provider
      this.pickingProvider.selectedReserves = selectedReserves;
      this.pickingProvider.freedReserves = [];
      this.pickingProvider.requestFilters = filters;
      //init scandit service
      this.reservesScanditService.freeReserves().catch(console.error);
    }else{
      console.error('Esta función requiere ser lanzada en móvil, ya que utiliza la cámara.')
    }
  }

}
