import {Component, OnInit} from '@angular/core';
import {StoresLineRequestsModel} from "../../../../services/src/models/endpoints/StoresLineRequests";
import {PickingScanditService} from "../../../../services/src/lib/scandit/picking/picking.service";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";
import {PickingStoreService} from "../../../../services/src/lib/endpoint/picking-store/picking-store.service";
import {PickingStoreModel} from "../../../../services/src/models/endpoints/PickingStore";
import {WarehouseModel} from "@suite/services";
import {Events} from "@ionic/angular";

@Component({
  selector: 'list-stores-picking-tasks-template',
  templateUrl: './list-stores.component.html',
  styleUrls: ['./list-stores.component.scss']
})
export class ListStoresPickingTasksTemplateComponent implements OnInit {

  public orderRequestsByStores: StoresLineRequestsModel.StoresOrderRequests[] = [];
  public stores: WarehouseModel.Warehouse[] = [];
  public lineRequests: StoresLineRequestsModel.OrderRequests[] = [];
  private allStoresSelected: boolean = false;
  private qtyStoresSelected: number = 0;
  public isLoadingData: boolean = true;
  public isPickingInitiated: boolean = false;

  constructor(
    private events: Events,
    private pickingStoreService: PickingStoreService,
    private pickingScanditService: PickingScanditService,
    private pickingProvider: PickingProvider
  ) {}

  ngOnInit() {
    this.loadRejectionReasons();
    this.loadPossibleLineRequestsByStores();
    this.allStoresSelected = false;
    this.qtyStoresSelected = 0;
  }

  private loadRejectionReasons() {
    this.pickingStoreService
      .getLoadRejectionReasons()
      .then((res: PickingStoreModel.ResponseLoadRejectionReasons) => {
        let resData: Array<PickingStoreModel.RejectionReasons> = res.data;
        this.pickingProvider.listRejectionReasonsToStorePickings = resData;
      }, (error) => {
        console.error('Error::Subscribe::pickingStoreService::getLoadRejectionReasons', error);
      })
      .catch((error) => {
        console.error('Error::Subscribe::pickingStoreService::getLoadRejectionReasons', error);
      });
  }

  private loadPossibleLineRequestsByStores() {
    this.pickingStoreService
      .getLineRequests()
      .then((res: PickingStoreModel.ResponseOrderRequests) => {
        if ((res.code == 200 || res.code == 201) && res.data && res.data.length > 0) {
          this.orderRequestsByStores = res.data;
          this.stores = [];
          this.lineRequests = [];
          this.isLoadingData = false;
          this.isPickingInitiated = false;
        } else {
          this.orderRequestsByStores = [];
          this.stores = [];
          this.lineRequests = [];
          this.isLoadingData = false;
          console.error('Error Subscribe::List line-requests by store::', res);
        }
      }, (error) => {
        this.orderRequestsByStores = [];
        this.stores = [];
        this.lineRequests = [];
        this.isLoadingData = false;
        console.error('Error Subscribe::List line-requests by store::', error);
      })
      .catch((error) => {
        this.orderRequestsByStores = [];
        this.stores = [];
        this.lineRequests = [];
        this.isLoadingData = false;
        console.error('Error Subscribe::List line-requests by store::', error);
      });
  }

  selectStore(data: StoresLineRequestsModel.StoresOrderRequestsSelected) {
    data.store.selected = data.selected;
    if (data.store.selected) {
      this.qtyStoresSelected++;
    } else {
      this.qtyStoresSelected--;
    }
    this.allStoresSelected = this.qtyStoresSelected == this.orderRequestsByStores.length;
  }

  checkLineRequestSelected(): boolean {
    let someSelected = this.orderRequestsByStores.filter((store) => {
      let returnValue = false;
      if (!store.selected) {
        returnValue = !!store.lines.find(request => request.selected);
      } else {
        returnValue = store.selected;
      }
      return returnValue;
    });
    return this.isPickingInitiated || (!this.isPickingInitiated && !!(someSelected.length));
  }

  initPicking() {
    let listStoresIdsToStorePickings: number[] = [];
    let listRequestsIdsToStorePickings: number[] = [];

    let listOrdersRequestsToStorePickings = this.orderRequestsByStores.filter((store) => store.selected);
    for (let storeLineRequest of listOrdersRequestsToStorePickings) {
      listStoresIdsToStorePickings = listStoresIdsToStorePickings.concat(storeLineRequest.warehouse.id);
      listRequestsIdsToStorePickings = listRequestsIdsToStorePickings.concat(storeLineRequest.lines.filter(orderRequest => orderRequest.selected).map(orderRequest => orderRequest.request.id));
    }
    this.pickingProvider.listStoresIdsToStorePicking = listStoresIdsToStorePickings;
    this.pickingProvider.listRequestsIdsToStorePicking = listRequestsIdsToStorePickings;

    let filtersToGetProducts: PickingStoreModel.ParamsFiltered = {
      orderbys: [],
      sizes: [],
      colors: [],
      models: [],
      brands: []
    };

    if ((<any>window).cordova) {
      this.pickingStoreService
        .postPickingStoreChangeStatus({
          status: 2,
          warehouseIds: this.pickingProvider.listStoresIdsToStorePicking,
          requestIds: this.pickingProvider.listRequestsIdsToStorePicking
        })
        .then((res: PickingStoreModel.ResponseChangeStatus) => {
          if (res.code == 200 || res.code == 201) {
            this.pickingStoreService
              .postLineRequestFiltered(filtersToGetProducts)
              .then((res: PickingStoreModel.ResponseLineRequestsFiltered) => {
                if (res.code == 200 || res.code == 201) {
                  this.pickingProvider.listProductsToStorePickings = res.data.pending;
                  this.pickingProvider.listProductsProcessedToStorePickings = res.data.processed;
                  this.pickingProvider.listFiltersPicking = res.data.filters;
                  this.pickingScanditService.picking();
                }
              });
          } else {
            console.error('Error Subscribe::Change status for picking-store::', res);
          }
        }, (error) => {
          console.error('Error Subscribe::Change status for picking-store::', error);
        })
        .catch((error) => {
          console.error('Error Subscribe::Change status for picking-store::', error);
        });
    }
  }

  selectAllStores(selected) {
    if (selected) {
      this.qtyStoresSelected = this.orderRequestsByStores.length;
    } else {
      this.qtyStoresSelected = 0;
    }

    for (let iStore in this.orderRequestsByStores) {
      this.orderRequestsByStores[iStore].selected = selected;
      for (let lineRequest of this.orderRequestsByStores[iStore].lines) {
        lineRequest.selected = selected;
      }
    }
  }

}
