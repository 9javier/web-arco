import {Component, OnInit} from '@angular/core';
import {StoresLineRequestsModel} from "../../../../services/src/models/endpoints/StoresLineRequests";
import {PickingScanditService} from "../../../../services/src/lib/scandit/picking/picking.service";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";

@Component({
  selector: 'list-stores-picking-tasks-template',
  templateUrl: './list-stores.component.html',
  styleUrls: ['./list-stores.component.scss']
})
export class ListStoresPickingTasksTemplateComponent implements OnInit {

  public stores: StoresLineRequestsModel.StoresLineRequests[] = [];

  constructor(
    private pickingScanditService: PickingScanditService,
    private pickingProvider: PickingProvider
  ) {}

  ngOnInit() {
    this.stores = [
      {
        id: 1,
        name: 'Prueba 1',
        reference: '258',
        line_requests: null
      },
      {
        id: 2,
        name: 'Prueba 2',
        reference: '572',
        line_requests: [
          {
            reference: '123213',
            product: {
              id: 1,
              model: {
                reference: '123123',
                name: 'Prueba',
                createdAt: null,
                updatedAt: null,
                id: 1,
                datasetHash: null,
                hash: null,
                color: {
                  id: 1,
                  name: 'Red',
                  createdAt: null,
                  updatedAt: null,
                  avelonId: '1',
                  datasetHash: null,
                  colorHex: null,
                  description: null
                },
              },
              size: {
                createdAt: null,
                updatedAt: null,
                id: 1,
                reference: '12',
                number: '36',
                name: '36',
                description: null,
                datasetHash: null
              },
              reference: '546789123546789123',
              initialWarehouseReference: null
            }
          },
          {
            reference: '543167',
            product: {
              id: 1,
              model: {
                reference: '123123',
                name: 'Prueba',
                createdAt: null,
                updatedAt: null,
                id: 1,
                datasetHash: null,
                hash: null,
                color: {
                  id: 1,
                  name: 'Red',
                  createdAt: null,
                  updatedAt: null,
                  avelonId: '1',
                  datasetHash: null,
                  colorHex: null,
                  description: null
                },
              },
              size: {
                createdAt: null,
                updatedAt: null,
                id: 1,
                reference: '12',
                number: '36',
                name: '36',
                description: null,
                datasetHash: null
              },
              reference: '546789123546789123',
              initialWarehouseReference: null
            }
          }
        ]
      },
      {
        id: 3,
        name: 'Prueba 3',
        reference: '567',
        line_requests: [
          {
            reference: '543167',
            product: {
              id: 1,
              model: {
                reference: '123123',
                name: 'Prueba',
                createdAt: null,
                updatedAt: null,
                id: 1,
                datasetHash: null,
                hash: null,
                color: {
                  id: 1,
                  name: 'Red',
                  createdAt: null,
                  updatedAt: null,
                  avelonId: '1',
                  datasetHash: null,
                  colorHex: null,
                  description: null
                },
              },
              size: {
                createdAt: null,
                updatedAt: null,
                id: 1,
                reference: '12',
                number: '36',
                name: '36',
                description: null,
                datasetHash: null
              },
              reference: '546789123546789123',
              initialWarehouseReference: null
            }
          }
        ]
      }
    ]
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
    for (let storeLineRequest of this.pickingProvider.listLineRequestsToStorePickings) {
      listProductsToStorePickings = listProductsToStorePickings.concat(storeLineRequest.line_requests);
    }
    this.pickingProvider.listProductsToStorePickings = listProductsToStorePickings;

    if ((<any>window).cordova) {
      this.pickingScanditService.picking();
    }
  }

}
