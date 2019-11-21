import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PickingParametrizationProvider} from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import {Events} from "@ionic/angular";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import * as moment from 'moment';

@Component({
  selector: 'table-requests-orders',
  templateUrl: './table-requests-orders.component.html',
  styleUrls: ['./table-requests-orders.component.scss']
})
export class TableRequestsOrdersComponent implements OnInit {

  private REQUEST_ORDERS_LOADED = "request-orders-loaded";
  private DRAW_CONSOLIDATED_MATCHES = "draw-consolidated-matches";
  private FILTER_REQUEST_ID: number = 1;
  private FILTER_DATE: number = 2;
  private FILTER_ORIGIN: number = 3;
  private FILTER_DESTINY: number = 4;
  private FILTER_TYPE: number = 5;
  private FILTER_QUANTITY: number = 6;
  private FILTER_QUANTITY_LAUNCH: number = 7;

  @Output() changeRequestOrder = new EventEmitter();

  listRequestOrders: Array<WorkwaveModel.MatchLineRequest> = new Array<WorkwaveModel.MatchLineRequest>();
  listRequestOrdersFinal: Array<WorkwaveModel.MatchLineRequest> = new Array<WorkwaveModel.MatchLineRequest>();
  requestOrdersSelection: any = {};
  listRequestOrdersSelected: Array<number> = new Array<number>();
  allRequestOrdersSelected: boolean = false;

  listRequestsFilters: Array<any> = new Array<any>();
  listDateFilters: Array<any> = new Array<any>();
  listOriginFilters: Array<any> = new Array<any>();
  listDestinyFilters: Array<any> = new Array<any>();
  listTypeFilters: Array<any> = new Array<any>();
  listQuantitiesFilters: Array<any> = new Array<any>();
  listQuantitiesLaunchFilters: Array<any> = new Array<any>();

  isFilteringRequests: number = 0;
  isFilteringDate: number = 0;
  isFilteringOrigin: number = 0;
  isFilteringDestiny: number = 0;
  isFilteringType: number = 0;
  isFilteringQuantities: number = 0;
  isFilteringQuantitiesLaunch: number = 0;

  lastOrder = [true, true, true, true, true, true, true, true];
  enlarged = false;

  private listWarehousesThresholdAndSelectedQty: any = {};
  private listRequestIdWarehouseId: any = {};

  constructor(
    public events: Events,
    public pickingParametrizationProvider: PickingParametrizationProvider
  ) { }

  ngOnInit() {
    this.events.subscribe(this.REQUEST_ORDERS_LOADED, () => {
      this.listRequestOrders = this.pickingParametrizationProvider.listRequestOrders;
      this.listRequestOrdersFinal = this.pickingParametrizationProvider.listRequestOrders;

      if (this.listRequestOrders.length > 0) {
        for (let request of this.listRequestOrders) {
          this.requestOrdersSelection[request.request.id] = true;
          if (typeof this.listWarehousesThresholdAndSelectedQty[request.destinyWarehouse.id] == 'undefined') {
            this.listWarehousesThresholdAndSelectedQty[request.destinyWarehouse.id] = {max: request.destinyWarehouse.thresholdShippingStore, selected: 0, warehouse: request.destinyWarehouse.name};
          }
          this.listRequestIdWarehouseId[request.request.id] = {warehouse: request.destinyWarehouse.id, qty: request.quantityMatchWarehouse};
        }
        this.allRequestOrdersSelected = true;
      } else {
        this.requestOrdersSelection = {};
      }
      this.selectRequestOrder(false);

      this.listRequestsFilters = this.listRequestOrders.map((item) => {
        return {
          checked: true,
          value: item.request.requestId,
          id: item.request.id,
          type: this.FILTER_REQUEST_ID,
          hide: false
        };
      }).reduce((tempArray, currentItem) => {
        const x = tempArray.find(item => item.value === currentItem.value);
        if (!x) {
          return tempArray.concat([currentItem]);
        } else {
          return tempArray;
        }
      }, []);
      this.listDateFilters = this.listRequestOrders.map((item) => {
        return {
          checked: true,
          value: `${this.dateCreatedParsed(item)} ${this.timeCreatedParsed(item)}`,
          id: item.id,
          type: this.FILTER_DATE,
          hide: false
        };
      }).reduce((tempArray, currentItem) => {
        const x = tempArray.find(item => item.value === currentItem.value);
        if (!x) {
          return tempArray.concat([currentItem]);
        } else {
          return tempArray;
        }
      }, []);
      this.listOriginFilters = this.listRequestOrders.map((item) => {
        return {
          checked: true,
          value: item.originWarehouse.name,
          id: item.originWarehouse.id,
          type: this.FILTER_ORIGIN,
          hide: false
        };
      }).reduce((tempArray, currentItem) => {
        const x = tempArray.find(item => item.value === currentItem.value);
        if (!x) {
          return tempArray.concat([currentItem]);
        } else {
          return tempArray;
        }
      }, []);
      this.listDestinyFilters = this.listRequestOrders.map((item) => {
        return {
          checked: true,
          value: item.destinyWarehouse.name,
          id: item.destinyWarehouse.id,
          type: this.FILTER_DESTINY,
          hide: false
        };
      }).reduce((tempArray, currentItem) => {
        const x = tempArray.find(item => item.value === currentItem.value);
        if (!x) {
          return tempArray.concat([currentItem]);
        } else {
          return tempArray;
        }
      }, []);
      this.listTypeFilters = this.listRequestOrders.map((item) => {
        return {
          checked: true,
          value: item.preparationLinesTypes.name,
          id: item.preparationLinesTypes.id,
          type: this.FILTER_TYPE,
          hide: false
        };
      }).reduce((tempArray, currentItem) => {
        const x = tempArray.find(item => item.value === currentItem.value);
        if (!x) {
          return tempArray.concat([currentItem]);
        } else {
          return tempArray;
        }
      }, []);
      this.listQuantitiesFilters = this.listRequestOrders.map((item) => {
        return {
          checked: true,
          value: item.quantityOrder,
          id: item.id,
          type: this.FILTER_QUANTITY,
          hide: false
        };
      }).reduce((tempArray, currentItem) => {
        const x = tempArray.find(item => item.value === currentItem.value);
        if (!x) {
          return tempArray.concat([currentItem]);
        } else {
          return tempArray;
        }
      }, []);
      this.listQuantitiesLaunchFilters = this.listRequestOrders.map((item) => {
        return {
          checked: true,
          value: item.quantityMatchWarehouse,
          id: item.id,
          type: this.FILTER_QUANTITY_LAUNCH,
          hide: false
        };
      }).reduce((tempArray, currentItem) => {
        const x = tempArray.find(item => item.value === currentItem.value);
        if (!x) {
          return tempArray.concat([currentItem]);
        } else {
          return tempArray;
        }
      }, []);

      this.isFilteringRequests = this.listRequestsFilters.length;
      this.isFilteringDate = this.listDateFilters.length;
      this.isFilteringOrigin = this.listOriginFilters.length;
      this.isFilteringDestiny = this.listDestinyFilters.length;
      this.isFilteringType = this.listTypeFilters.length;
      this.isFilteringQuantities = this.listQuantitiesFilters.length;
      this.isFilteringQuantitiesLaunch = this.listQuantitiesLaunchFilters.length;

    });

    this.events.subscribe(this.DRAW_CONSOLIDATED_MATCHES, (data: Array<WorkwaveModel.AssignationsByRequests>) => {
      for (let requestOrder of this.listRequestOrders) {
        let matchedForRequest = data.find(match => match.requestId == requestOrder.request.id);
        if (matchedForRequest) {
          requestOrder.quantityMatchWarehouse = parseInt(matchedForRequest.quantityShoes);
        }
      }
    })
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.REQUEST_ORDERS_LOADED);
    this.events.unsubscribe(this.DRAW_CONSOLIDATED_MATCHES);
  }

  selectAllRequestOrder() {
    for (let iRequest in this.requestOrdersSelection) {
      this.requestOrdersSelection[iRequest] = this.allRequestOrdersSelected;
    }
    this.selectRequestOrder(true);
  }

  selectRequestOrder(incrementTeamCounter: boolean) {
    if (incrementTeamCounter) {
      this.pickingParametrizationProvider.loadingListTeamAssignations++;
    }

    for (let iObj in this.listWarehousesThresholdAndSelectedQty) {
      this.listWarehousesThresholdAndSelectedQty[iObj].selected = 0;
    }
    this.listRequestOrdersSelected = new Array<number>();
    for (let iRequest in this.requestOrdersSelection) {
      let warehouseId = this.listRequestIdWarehouseId[iRequest].warehouse;
      let qty = this.listRequestIdWarehouseId[iRequest].qty;
      let selection = this.listWarehousesThresholdAndSelectedQty[warehouseId].selected;
      if (this.requestOrdersSelection[iRequest]) {
        this.listRequestOrdersSelected.push(parseInt(iRequest));
        this.listWarehousesThresholdAndSelectedQty[warehouseId].selected = selection + qty;
      }
    }

    this.allRequestOrdersSelected = this.listRequestOrdersSelected.length == this.listRequestOrders.length;

    this.changeRequestOrder.next({listSelected: this.listRequestOrdersSelected, listThreshold: this.listWarehousesThresholdAndSelectedQty});
  }

  applyFilters(data: any) {
    for (let iFilter in data) {
      data[iFilter].hide = false;
    }

    if (data[0].type == this.FILTER_REQUEST_ID) {
      this.listRequestsFilters = data;
    } else if (data[0].type == this.FILTER_DATE) {
      this.listDateFilters = data;
    } else if (data[0].type == this.FILTER_ORIGIN) {
      this.listOriginFilters = data;
    } else if (data[0].type == this.FILTER_DESTINY) {
      this.listDestinyFilters = data;
    } else if (data[0].type == this.FILTER_TYPE) {
      this.listTypeFilters = data;
    }
    else if (data[0].type == this.FILTER_QUANTITY) {
      this.listQuantitiesFilters = data;
    }else if (data[0].type == this.FILTER_QUANTITY_LAUNCH) {
      this.listQuantitiesLaunchFilters = data;
    }

    this.isFilteringRequests = 0;
    this.isFilteringDate = 0;
    this.isFilteringOrigin = 0;
    this.isFilteringDestiny = 0;
    this.isFilteringType = 0;
    this.isFilteringQuantities = 0;
    this.isFilteringQuantitiesLaunch = 0;

    let listRequestOrdersTemp = this.listRequestOrdersFinal.filter((item) => {
      let isOk = false;

      for (let filter in this.listRequestsFilters) {
        if (this.listRequestsFilters[filter].value == item.request.requestId && this.listRequestsFilters[filter].checked) {
          isOk = true;
          break;
        }
      }

      return isOk;
    });
    listRequestOrdersTemp = listRequestOrdersTemp.filter((item) => {
      let isOk = false;

      for (let filter in this.listDateFilters) {
        if (this.listDateFilters[filter].value == (`${this.dateCreatedParsed(item)} ${this.timeCreatedParsed(item)}`) && this.listDateFilters[filter].checked) {
          isOk = true;
          break;
        }
      }

      return isOk;
    });
    listRequestOrdersTemp = listRequestOrdersTemp.filter((item) => {
      let isOk = false;

      for (let filter in this.listOriginFilters) {
        if (this.listOriginFilters[filter].value == item.originWarehouse.name && this.listOriginFilters[filter].checked) {
          isOk = true;
          break;
        }
      }

      return isOk;
    });
    listRequestOrdersTemp = listRequestOrdersTemp.filter((item) => {
      let isOk = false;

      for (let filter in this.listDestinyFilters) {
        if (this.listDestinyFilters[filter].value == item.destinyWarehouse.name && this.listDestinyFilters[filter].checked) {
          isOk = true;
          break;
        }
      }

      return isOk;
    });
    listRequestOrdersTemp = listRequestOrdersTemp.filter((item) => {
      let isOk = false;

      for (let filter in this.listTypeFilters) {
        if (this.listTypeFilters[filter].value == item.preparationLinesTypes.name && this.listTypeFilters[filter].checked) {
          isOk = true;
          break;
        }
      }

      return isOk;
    });
    listRequestOrdersTemp = listRequestOrdersTemp.filter((item) => {
      let isOk = false;

      for (let filter in this.listQuantitiesFilters) {
        if (this.listQuantitiesFilters[filter].value == item.quantityOrder && this.listQuantitiesFilters[filter].checked) {
          isOk = true;
          break;
        }
      }

      return isOk;
    });
    listRequestOrdersTemp = listRequestOrdersTemp.filter((item) => {
      let isOk = false;

      for (let filter in this.listQuantitiesLaunchFilters) {
        if (this.listQuantitiesLaunchFilters[filter].value == item.quantityMatchWarehouse && this.listQuantitiesLaunchFilters[filter].checked) {
          isOk = true;
          break;
        }
      }

      return isOk;
    });

    this.isFilteringRequests = (this.listRequestsFilters.filter(filter => filter.checked)).length;
    this.isFilteringDate = (this.listDateFilters.filter(filter => filter.checked)).length;
    this.isFilteringOrigin = (this.listOriginFilters.filter(filter => filter.checked)).length;
    this.isFilteringDestiny = (this.listDestinyFilters.filter(filter => filter.checked)).length;
    this.isFilteringType = (this.listTypeFilters.filter(filter => filter.checked)).length;
    this.isFilteringQuantities = (this.listQuantitiesFilters.filter(filter => filter.checked)).length;
    this.isFilteringQuantitiesLaunch = (this.listQuantitiesLaunchFilters.filter(filter => filter.checked)).length;

    this.listRequestOrders = listRequestOrdersTemp;

    for (let iRequest in this.requestOrdersSelection) {
      this.requestOrdersSelection[iRequest] = true;
    }
    this.selectRequestOrder(true);
  }

  dateCreatedParsed(requestOrder) : string {
    moment.locale('es');
    return moment(requestOrder.request.date).format('ddd, DD/MM/YYYY');
  }

  timeCreatedParsed(requestOrder) : string {
    moment.locale('es');
    return moment(requestOrder.request.date).format('LT');
  }

}
