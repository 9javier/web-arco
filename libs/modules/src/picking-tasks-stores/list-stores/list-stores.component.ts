import {Component, OnInit} from '@angular/core';
import {StoresLineRequestsModel} from "../../../../services/src/models/endpoints/StoresLineRequests";
import {PickingScanditService} from "../../../../services/src/lib/scandit/picking/picking.service";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";
import {PickingStoreService} from "../../../../services/src/lib/endpoint/picking-store/picking-store.service";
import {PickingStoreModel} from "../../../../services/src/models/endpoints/PickingStore";
import {Events} from "@ionic/angular";
import RequestGroup = StoresLineRequestsModel.RequestGroup;
import OrderRequests = StoresLineRequestsModel.OrderRequests;
import {DeliveryRequestModel} from "../../../../services/src/models/endpoints/DeliveryRequest";
import DeliveryRequest = DeliveryRequestModel.DeliveryRequest;
import Filters = PickingStoreModel.Filters;

@Component({
  selector: 'list-stores-picking-tasks-template',
  templateUrl: './list-stores.component.html',
  styleUrls: ['./list-stores.component.scss']
})
export class ListStoresPickingTasksTemplateComponent implements OnInit {

  requestGroups: {
    store: RequestGroup,
    onlineHome: RequestGroup,
    onlineStore: RequestGroup
  };
  allGroupsSelected: boolean;
  amountGroupsSelected: number;
  isLoadingData: boolean;
  isPickingInitiated: boolean;

  constructor(
    private events: Events,
    private pickingStoreService: PickingStoreService,
    private pickingScanditService: PickingScanditService,
    private pickingProvider: PickingProvider
  ) {}

  ngOnInit() {
    this.requestGroups = {
      store: {
        name: 'Tiendas',
        lines: [],
        selected: false
      },
      onlineHome: {
        name: 'Online Domicilio',
        lines: [],
        selected: false
      },
      onlineStore: {
        name: 'Online Tienda',
        lines: [],
        selected: false
      }
    };
    this.allGroupsSelected = true;
    this.amountGroupsSelected = 0;
    this.isLoadingData = true;
    this.isPickingInitiated = false;
    this.loadRejectionReasons();
    this.loadRequestGroups();
  }

  private loadRejectionReasons() {
    this.pickingStoreService.getLoadRejectionReasons().then((response: PickingStoreModel.ResponseLoadRejectionReasons) => {
      if(response.code == 200){
        this.pickingProvider.listRejectionReasonsToStorePickings = response.data;
      }else{
        console.error(response);
      }
    },error => console.error(error)).catch(error => console.error(error));
  }

  private loadRequestGroups() {
    this.pickingStoreService.getLineRequestsStoreOnline().then((response: PickingStoreModel.StoreOnlineRequests) => {
      if (response.code == 200 || response.code == 201) {
        if(response.data.store.lines.length > 0) {
          this.requestGroups.store.lines = response.data.store.lines;
          this.requestGroups.store.selected = response.data.store.selected;
          if(!this.requestGroups.store.selected){
            this.allGroupsSelected = false;
          }
        }
        if(response.data.onlineHomeRequests.length > 0){
          this.requestGroups.onlineHome.selected = true;
          for(let request of response.data.onlineHomeRequests){
            request.selected = true;
            this.requestGroups.onlineHome.lines.push(request);
          }
        }
        if(response.data.onlineStoreRequests.length > 0){
          this.requestGroups.onlineStore.selected = true;
          for(let request of response.data.onlineStoreRequests){
            request.selected = true;
            this.requestGroups.onlineStore.lines.push(request);
          }
        }
        this.isLoadingData = false;
      } else {
        console.error(response);
      }
    }, error => console.error(error)).catch(error => console.error(error));
  }

  selectGroup(requestGroupSelected: StoresLineRequestsModel.RequestGroupSelected) {
    requestGroupSelected.requestGroup.selected = requestGroupSelected.selected;
    if (requestGroupSelected.requestGroup.selected) {
      this.amountGroupsSelected++;
    } else {
      this.amountGroupsSelected--;
    }
    this.allGroupsSelected = this.amountGroupsSelected == 3;
  }

  checkRequestSelected(): boolean {
    let anySelected: boolean = false;
    if (this.requestGroups.store.selected || this.requestGroups.onlineHome.selected || this.requestGroups.onlineStore.selected) {
      anySelected = true;
    }else{
      for(let line of this.requestGroups.store.lines){
        if(line.selected){
          anySelected = true;
          break;
        }
      }
      if(!anySelected){
        for(let line of this.requestGroups.onlineHome.lines){
          if(line.selected){
            anySelected = true;
            break;
          }
        }
        if(!anySelected){
          for(let line of this.requestGroups.onlineStore.lines){
            if(line.selected){
              anySelected = true;
              break;
            }
          }
        }
      }
    }
    return this.isPickingInitiated || (!this.isPickingInitiated && anySelected);
  }

  async initPicking() {
    const homeDeliveryRequests: DeliveryRequest[] = [];
    this.requestGroups.onlineHome.lines.forEach((request: DeliveryRequest) => {
      if(request.selected){
        homeDeliveryRequests.push(request);
      }
    });
    this.pickingProvider.deliveryRequestsHome = homeDeliveryRequests;

    const storeDeliveryRequests: DeliveryRequest[] = [];
    this.requestGroups.onlineStore.lines.forEach((request: DeliveryRequest) => {
      if(request.selected){
        storeDeliveryRequests.push(request);
      }
    });
    this.pickingProvider.deliveryRequestsStore = storeDeliveryRequests;

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
      sizes: []
    };
    for(let request of homeDeliveryRequests){
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
    for(let request of storeDeliveryRequests){
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
    this.pickingProvider.listFiltersPicking = filters;

    if (this.requestGroups.store.lines.length > 0 && this.requestGroups.store.selected) {

      this.pickingProvider.listStoresIdsToStorePicking = this.requestGroups.store.lines.filter(line => line.selected).map((line: OrderRequests) => line.warehouseId);
      this.pickingProvider.listRequestsIdsToStorePicking = this.requestGroups.store.lines.filter(line => line.selected).map((line: OrderRequests) => line.request.id);

      let filtersToGetProducts: PickingStoreModel.ParamsFiltered = {
        orderbys: [],
        sizes: [],
        colors: [],
        models: [],
        brands: []
      };

      if ((<any>window).cordova) {
        this.pickingStoreService.postPickingStoreChangeStatus({
          status: 2,
          warehouseIds: this.pickingProvider.listStoresIdsToStorePicking,
          requestIds: this.pickingProvider.listRequestsIdsToStorePicking
        }).then((response: PickingStoreModel.ResponseChangeStatus) => {
          if (response.code == 200 || response.code == 201) {
            this.pickingStoreService.postLineRequestFiltered(filtersToGetProducts).then(async (res: PickingStoreModel.ResponseLineRequestsFiltered) => {
              if (res.code == 200 || res.code == 201) {
                this.pickingProvider.listProductsToStorePickings = res.data.pending;
                this.pickingProvider.listProductsProcessedToStorePickings = res.data.processed;
                this.pickingProvider.listFiltersPicking.brands = this.pickingProvider.listFiltersPicking.brands.concat(res.data.filters.brands.filter(newValue => {
                  return !this.pickingProvider.listFiltersPicking.brands.map(value => value.name).includes(newValue.name);
                })).sort((a, b) => a.name.localeCompare(b.name));
                this.pickingProvider.listFiltersPicking.colors = this.pickingProvider.listFiltersPicking.colors.concat(res.data.filters.colors.filter(newValue => {
                  return !this.pickingProvider.listFiltersPicking.colors.map(value => value.name).includes(newValue.name);
                })).sort((a, b) => a.name.localeCompare(b.name));
                this.pickingProvider.listFiltersPicking.models = this.pickingProvider.listFiltersPicking.models.concat(res.data.filters.models.filter(newValue => {
                  return !this.pickingProvider.listFiltersPicking.models.map(value => value.reference).includes(newValue.reference);
                })).sort((a, b) => a.reference.localeCompare(b.reference));
                this.pickingProvider.listFiltersPicking.sizes = this.pickingProvider.listFiltersPicking.sizes.concat(res.data.filters.sizes.filter(newValue => {
                  return !this.pickingProvider.listFiltersPicking.sizes.map(value => value.name).includes(newValue.name);
                })).sort((a, b) => a.name.localeCompare(b.name));
                await this.pickingScanditService.picking();
              } else {
                console.error(res);
              }
            }, error => console.error(error)).catch(error => console.error(error));
          } else {
            console.error(response);
          }
        }, error => console.error(error)).catch(error => console.error(error));
      }
    } else {
      await this.pickingScanditService.picking();
    }
  }

  selectAllGroups(selected: boolean) {
    if (selected) {
      this.amountGroupsSelected = 3;
    } else {
      this.amountGroupsSelected = 0;
    }
    this.requestGroups.store.selected = selected;
    for(let line of this.requestGroups.store.lines){
      line.selected = selected;
    }
    this.requestGroups.onlineHome.selected = selected;
    for(let line of this.requestGroups.onlineHome.lines){
      line.selected = selected;
    }
    this.requestGroups.onlineStore.selected = selected;
    for(let line of this.requestGroups.onlineStore.lines){
      line.selected = selected;
    }
  }

}
