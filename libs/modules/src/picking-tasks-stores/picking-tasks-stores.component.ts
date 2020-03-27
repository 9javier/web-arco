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
        }
        this.allRequestsSelected = true;
        this.amountRequestsSelected = this.requests.length;
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
    return this.amountRequestsSelected > 0;
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
        if(request.selected){
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
          })
        }
        if(!filters.colors.map(color => color.id).includes(request.model.color.id)){
          filters.colors.push({
            id: request.model.color.id,
            name: request.model.color.name
          })
        }
        if(!filters.models.map(model => model.id).includes(request.model.id)){
          filters.models.push({
            id: request.model.id,
            name: request.model.name,
            reference: request.model.reference
          })
        }
        if(!filters.sizes.map(size => size.id).includes(request.size.id)){
          filters.sizes.push({
            id: request.size.id,
            name: request.size.name,
            reference: request.size.reference
          })
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

}
