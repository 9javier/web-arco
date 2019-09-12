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

  public lineRequestsByStores: StoresLineRequestsModel.StoresLineRequests[] = [];
  public stores: WarehouseModel.Warehouse[] = [];
  public lineRequests: StoresLineRequestsModel.LineRequests[] = [];
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
    this.loadPickingInitiated();

    this.events.subscribe('picking-stores:refresh', () => {
      this.loadPickingInitiated();
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('picking-stores:refresh');
  }

  private loadPickingInitiated() {
    this.isLoadingData = true;
    this.pickingStoreService
      .getInitiated()
      .subscribe((res: PickingStoreModel.ResponseInitiated) => {
        if (res.code == 200 && res.data && res.data.status == 2 && res.data.destinationWarehouses && res.data.linesPending) {
          this.lineRequestsByStores = [];
          this.stores = res.data.destinationWarehouses;
          this.lineRequests = res.data.linesPending.results;
          this.isLoadingData = false;
          this.isPickingInitiated = true;
        } else {
          this.loadPossibleLineRequestsByStores();
        }
      }, (error) => {
        this.loadPossibleLineRequestsByStores();
      });
  }

  private loadPossibleLineRequestsByStores() {
    this.pickingStoreService
      .getLineRequests()
      .subscribe((res: PickingStoreModel.ResponseLineRequests) => {
        if ((res.code == 200 || res.code == 201) && res.data && res.data.length > 0) {
          this.lineRequestsByStores = res.data;
          this.stores = [];
          this.lineRequests = [];
          this.isLoadingData = false;
          this.isPickingInitiated = false;
        } else {
          this.lineRequestsByStores = [];
          this.stores = [];
          this.lineRequests = [];
          this.isLoadingData = false;
          console.error('Error Subscribe::List line-requests by store::', res);
        }
      }, (error) => {
        this.lineRequestsByStores = [];
        this.stores = [];
        this.lineRequests = [];
        this.isLoadingData = false;
        console.error('Error Subscribe::List line-requests by store::', error);
      });
  }

  selectStore(data: StoresLineRequestsModel.StoresLineRequestsSelected) {
    data.store.selected = data.selected;
    if (data.store.selected) {
      this.qtyStoresSelected++;
    } else {
      this.qtyStoresSelected--;
    }
    if (this.qtyStoresSelected == this.lineRequestsByStores.length) {
      this.allStoresSelected = true;
    } else {
      this.allStoresSelected = false;
    }
  }

  checkLineRequestSelected(): boolean {
    let someSelected = this.lineRequestsByStores.filter((store) => {
      return store.selected;
    });
    return this.isPickingInitiated || (!this.isPickingInitiated && !!(someSelected.length));
  }

  initPicking() {
    if (this.isPickingInitiated) {
      this.pickingProvider.listLineRequestsToStorePickings = [];
      this.pickingProvider.listProductsToStorePickings = this.lineRequests;
      this.pickingProvider.listStoresIdsToStorePicking = this.stores.map((store) => {
        return store.id;
      });
      this.pickingProvider.listProductsProcessedToStorePickings = [];
    } else {
      this.pickingProvider.listLineRequestsToStorePickings = this.lineRequestsByStores.filter((store) => {
        return store.selected;
      });

      let listProductsToStorePickings: StoresLineRequestsModel.LineRequests[] = [];
      let listStoresIdsToStorePickings: number[] = [];
      for (let storeLineRequest of this.pickingProvider.listLineRequestsToStorePickings) {
        listProductsToStorePickings = listProductsToStorePickings.concat(storeLineRequest.lines);
        listStoresIdsToStorePickings = listStoresIdsToStorePickings.concat(storeLineRequest.warehouse.id);
      }
      this.pickingProvider.listProductsToStorePickings = listProductsToStorePickings;
      this.pickingProvider.listStoresIdsToStorePicking = listStoresIdsToStorePickings;
      this.pickingProvider.listProductsProcessedToStorePickings = [];
    }

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
          warehouseIds: this.pickingProvider.listStoresIdsToStorePicking
        })
        .subscribe((res: PickingStoreModel.ResponseChangeStatus) => {
          if (res.code == 200 || res.code == 201) {
            this.pickingStoreService
              .postLineRequestFiltered(filtersToGetProducts)
              .subscribe((res: PickingStoreModel.ResponseLineRequestsFiltered) => {
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
        });
    }
  }

  selectAllStores() {
    for (let iStore in this.lineRequestsByStores) {
      this.lineRequestsByStores[iStore].selected = !this.allStoresSelected;
    }
  }

}
