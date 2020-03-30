import {Component, OnInit} from '@angular/core';
import {PickingScanditService} from "../../../services/src/lib/scandit/picking/picking.service";
import {PickingProvider} from "../../../services/src/providers/picking/picking.provider";
import {PickingStoreService} from "../../../services/src/lib/endpoint/picking-store/picking-store.service";
import {PickingStoreModel} from "../../../services/src/models/endpoints/PickingStore";
import {DeliveryRequestModel} from "../../../services/src/models/endpoints/DeliveryRequest";
import {LineRequestModel} from "../../../services/src/models/endpoints/LineRequest";
import DeliveryRequest = DeliveryRequestModel.DeliveryRequest;
import Filters = PickingStoreModel.Filters;
import LineRequest = LineRequestModel.LineRequest;
import StoreOnlineRequestsResponse = PickingStoreModel.StoreOnlineRequestsResponse;
import ResponseLoadRejectionReasons = PickingStoreModel.ResponseLoadRejectionReasons;

@Component({
  selector: 'suite-picking-tasks-stores',
  templateUrl: './picking-tasks-stores.component.html',
  styleUrls: ['./picking-tasks-stores.component.scss']
})
export class PickingTasksStoresComponent implements OnInit {

  requests: Array<LineRequest | DeliveryRequest>;
  allRequestsSelected: boolean;
  amountRequestsSelected: number;
  isLoadingData: boolean;
  filtersOpen: boolean;
  filterForm: {
    date: string,
    article: string,
    brand: string,
    size: string,
    status: string,
    type: string
  };
  filterOptions: {
    dates: string[],
    articles: string[],
    brands: string[],
    sizes: string[],
    statuses: string[],
    types: string[]
  };
  orderBy: {
    options: string[],
    value: string,
    directions: string[],
    direction: string
  };

  constructor(
    private pickingStoreService: PickingStoreService,
    private pickingScanditService: PickingScanditService,
    private pickingProvider: PickingProvider
  ) {}

  ngOnInit() {
    this.requests = [];
    this.allRequestsSelected = false;
    this.amountRequestsSelected = 0;
    this.isLoadingData = true;
    this.filtersOpen = false;
    this.filterForm = {
      date: '',
      article: '',
      brand: '',
      size: '',
      status: '',
      type: ''
    };
    this.filterOptions = {
      dates: [],
      articles: [],
      brands: [],
      sizes: [],
      statuses: [],
      types: []
    };
    this.orderBy = {
      options: ['Fecha', 'Artículo', 'Marca', 'Talla', 'Estado', 'Tipo'],
      value: null,
      directions: ['Ascendente', 'Descendente'],
      direction: 'Ascendente'
    };
    this.loadRejectionReasons();
    this.loadRequests();
  }

  private loadRejectionReasons() {
    this.pickingStoreService.getLoadRejectionReasons().then((response: ResponseLoadRejectionReasons) => {
      if(response.code == 200){
        this.pickingProvider.listRejectionReasonsToStorePickings = response.data;
      }else{
        console.error(response);
      }
    },error => console.error(error)).catch(error => console.error(error));
  }

  private loadRequests() {
    this.pickingStoreService.getLineRequestsStoreOnline().then((response: StoreOnlineRequestsResponse) => {
      if (response.code == 200) {
        this.requests = response.data;
        for(let request of this.requests){
          request.selected = true;
          request.hidden = false;
        }
        this.allRequestsSelected = true;
        this.amountRequestsSelected = this.requests.length;
        for(let request of this.requests){
          if(!this.filterOptions.dates.includes(this.getDate(request))){
            this.filterOptions.dates.push(this.getDate(request));
          }
          if(!this.filterOptions.articles.includes(request.model.reference)){
            this.filterOptions.articles.push(request.model.reference);
          }
          if(!this.filterOptions.brands.includes(request.model.brand.name)){
            this.filterOptions.brands.push(request.model.brand.name);
          }
          if(!this.filterOptions.sizes.includes(request.size.name)){
            this.filterOptions.sizes.push(request.size.name);
          }
          if(!this.filterOptions.statuses.includes(this.getStatus(request))){
            this.filterOptions.statuses.push(this.getStatus(request));
          }
          if(!this.filterOptions.types.includes(this.getType(request))){
            this.filterOptions.types.push(this.getType(request));
          }
        }
        this.filterOptions.dates = this.filterOptions.dates.sort((a, b) => a.localeCompare(b));
        this.filterOptions.articles = this.filterOptions.articles.sort((a, b) => a.localeCompare(b));
        this.filterOptions.brands = this.filterOptions.brands.sort((a, b) => a.localeCompare(b));
        this.filterOptions.sizes = this.filterOptions.sizes.sort((a, b) => a.localeCompare(b));
        this.filterOptions.statuses =this.filterOptions.statuses.sort((a, b) => a.localeCompare(b));
        this.filterOptions.types = this.filterOptions.types.sort((a, b) => a.localeCompare(b));
        this.isLoadingData = false;
      } else {
        console.error(response);
      }
    }, error => console.error(error)).catch(error => console.error(error));
  }

  selectRequest(selected: boolean) {
    if(selected) {
      this.amountRequestsSelected++;
    }else{
      this.amountRequestsSelected--;
    }
    this.allRequestsSelected = this.amountRequestsSelected == this.requests.length;
  }

  checkRequestSelected(): boolean {
    let anySelectedNotHiddenRequest: boolean = false;
    for(let request of this.requests){
      if(request.selected && !request.hidden){
        anySelectedNotHiddenRequest = true;
        break;
      }
    }
    return anySelectedNotHiddenRequest;
  }

  selectAllRequests(selected: boolean) {
    for(let request of this.requests){
      request.selected = selected;
    }
    if(selected) {
      this.amountRequestsSelected = this.requests.length;
    } else {
      this.amountRequestsSelected = 0;
    }
  }

  initPicking() {
    if((<any>window).cordova) {
      //get selected requests
      const selectedPendingRequests: Array<LineRequest | DeliveryRequest> = [];
      const selectedProcessedRequests: Array<LineRequest | DeliveryRequest> = [];
      for(let request of this.requests){
        if(request.selected && !request.hidden){
          if((request.hasOwnProperty('shippingMode') && request.status == 0) || (!request.hasOwnProperty('shippingMode') && request.status == 1)){
            selectedPendingRequests.push(request);
          }else{
            selectedProcessedRequests.push(request);
          }
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
      for(let request of selectedPendingRequests.concat(selectedProcessedRequests)){
        if(!filters.brands.map(brand => brand.id).includes(request.model.brand.id)){
          filters.brands.push({
            id: request.model.brand.id,
            name: request.model.brand.name
          });
        }
        if(!filters.colors.map(color => color.id).includes(request.model.color.id)){
          filters.colors.push({
            id: request.model.color.id,
            name: request.model.color.name
          });
        }
        if(!filters.models.map(model => model.id).includes(request.model.id)){
          filters.models.push({
            id: request.model.id,
            name: request.model.name,
            reference: request.model.reference
          });
        }
        if(!filters.sizes.map(size => size.id).includes(request.size.id)){
          filters.sizes.push({
            id: request.size.id,
            name: request.size.name,
            reference: request.size.reference
          });
        }
      }
      filters.brands = filters.brands.sort((a, b) => a.name.localeCompare(b.name));
      filters.colors = filters.colors.sort((a, b) => a.name.localeCompare(b.name));
      filters.models = filters.models.sort((a, b) => a.reference.localeCompare(b.reference));
      filters.sizes = filters.sizes.sort((a, b) => a.name.localeCompare(b.name));
      //set picking provider
      this.pickingProvider.selectedPendingRequests = selectedPendingRequests;
      this.pickingProvider.selectedProcessedRequests = selectedProcessedRequests;
      this.pickingProvider.requestFilters = filters;
      //init picking service
      this.pickingScanditService.picking().catch(console.error);
    }
  }

  getDate(request: LineRequest | DeliveryRequest): string{
    return new Date(request.createdAt).toLocaleDateString('es-ES');
  }

  getStatus(request: LineRequest | DeliveryRequest): string{
    if(request.hasOwnProperty('shippingMode')){
      switch (request.status) {
        case 0:
          return 'Pendiente';
        case 3:
          return 'Pickeada';
        case 5:
          return 'Cancelada';
        default:
          return 'Desconocido';
      }
    }else{
      switch (request.status) {
        case 1:
          return 'Pendiente';
        case 3:
          return 'Pickeada';
        case 16:
          return 'Cancelada';
        default:
          return 'Desconocido';
      }
    }
  }

  getType(request: LineRequest | DeliveryRequest): string{
    if(request.hasOwnProperty('shippingMode')){
      let type: string = 'Desconocido';
      [request].forEach((delivery: DeliveryRequest) => {
        if(delivery.shippingMode == 1){
          type = 'Online Domicilio';
        }else{
          type = 'Online Tienda';
        }
      });
      return type;
    }else{
      return 'Tienda'
    }
  }

  applyFilter(){
    for(const request of this.requests){
      request.hidden = !(
        (this.getDate(request) == this.filterForm.date || this.filterForm.date == '') &&
        (request.model.reference == this.filterForm.article || this.filterForm.article == '') &&
        (request.model.brand.name == this.filterForm.brand || this.filterForm.brand == '') &&
        (request.size.name == this.filterForm.size || this.filterForm.size == '') &&
        (this.getStatus(request) == this.filterForm.status || this.filterForm.status == '') &&
        (this.getType(request) == this.filterForm.type || this.filterForm.type == '')
      );
    }
  }

  applyOrder(){
    if(this.orderBy.direction == 'Ascendente') {
      switch (this.orderBy.value) {
        case 'Fecha':
          this.requests = this.requests.sort((a, b) => new Date(a.createdAt).getTime().toString().localeCompare(new Date(b.createdAt).getTime().toString()));
          break;
        case 'Artículo':
          this.requests = this.requests.sort((a, b) => a.model.reference.localeCompare(b.model.reference));
          break;
        case 'Marca':
          this.requests = this.requests.sort((a, b) => a.model.brand.name.localeCompare(b.model.brand.name));
          break;
        case 'Talla':
          this.requests = this.requests.sort((a, b) => a.size.name.localeCompare(b.size.name));
          break;
        case 'Estado':
          this.requests = this.requests.sort((a, b) => this.getStatus(a).localeCompare(this.getStatus(b)));
          break;
        case 'Tipo':
          this.requests = this.requests.sort((a, b) => this.getType(a).localeCompare(this.getType(b)));
          break;
      }
    }else{
      switch (this.orderBy.value) {
        case 'Fecha':
          this.requests = this.requests.sort((b, a) => new Date(a.createdAt).getTime().toString().localeCompare(new Date(b.createdAt).getTime().toString()));
          break;
        case 'Artículo':
          this.requests = this.requests.sort((b, a) => a.model.reference.localeCompare(b.model.reference));
          break;
        case 'Marca':
          this.requests = this.requests.sort((b, a) => a.model.brand.name.localeCompare(b.model.brand.name));
          break;
        case 'Talla':
          this.requests = this.requests.sort((b, a) => a.size.name.localeCompare(b.size.name));
          break;
        case 'Estado':
          this.requests = this.requests.sort((b, a) => this.getStatus(a).localeCompare(this.getStatus(b)));
          break;
        case 'Tipo':
          this.requests = this.requests.sort((b, a) => this.getType(a).localeCompare(this.getType(b)));
          break;
      }
    }
  }

}
