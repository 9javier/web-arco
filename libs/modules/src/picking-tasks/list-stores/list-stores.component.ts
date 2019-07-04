import {Component, OnInit} from '@angular/core';
import {StoresLineRequestsModel} from "../../../../services/src/models/endpoints/StoresLineRequests";
import {PickingScanditService} from "../../../../services/src/lib/scandit/picking/picking.service";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";
import {PickingStoreService} from "../../../../services/src/lib/endpoint/picking-store/picking-store.service";
import {PickingStoreModel} from "../../../../services/src/models/endpoints/PickingStore";

@Component({
  selector: 'list-stores-picking-tasks-template',
  templateUrl: './list-stores.component.html',
  styleUrls: ['./list-stores.component.scss']
})
export class ListStoresPickingTasksTemplateComponent implements OnInit {

  public stores: StoresLineRequestsModel.StoresLineRequests[] = [];

  constructor(
    private pickingStoreService: PickingStoreService,
    private pickingScanditService: PickingScanditService,
    private pickingProvider: PickingProvider
  ) {}

  ngOnInit() {
    this.pickingStoreService
      .getLineRequests()
      .subscribe((res: PickingStoreModel.ResponseLineRequests) => {
        this.stores = res.data;
      }, (error) => {
        console.error('Error Subscribe::List line-requests by store::', error);
      });
  }

  selectStore(data: StoresLineRequestsModel.StoresLineRequestsSelected) {
    data.store.selected = data.selected;
  }

  checkLineRequestSelected(): boolean {
    let someSelected = this.stores.filter((store) => {
      return store.selected;
    });
    return !!(someSelected.length);
  }

  initPicking() {
    this.pickingProvider.listLineRequestsToStorePickings = this.stores.filter((store) => {
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

    if ((<any>window).cordova) {
      this.pickingStoreService
        .postPickingStoreChangeStatus({
          status: 2
        })
        .subscribe((res: PickingStoreModel.ResponseChangeStatus) => {
          if (res.code == 200 || res.code == 201) {
            let paramsLineRequestPending: PickingStoreModel.ListStoresIds = {
              warehouseIds: this.pickingProvider.listStoresIdsToStorePicking
            };
            this.pickingStoreService
              .postLineRequestsPending(paramsLineRequestPending)
              .subscribe((res: PickingStoreModel.ResponseLineRequestsPending) => {
                if (res.code == 200 || res.code == 201) {
                  this.pickingProvider.listProductsToStorePickings = res.data;
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

}
