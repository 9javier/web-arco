import { Component, OnInit } from '@angular/core';
import {LoadingController, ModalController, ToastController} from "@ionic/angular";
import {WarehouseService} from "../../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import {WarehouseMapsModel, WarehouseMapsService} from "@suite/services";
import {interval} from "rxjs";
import {InventoryService} from "../../../../../services/src/lib/endpoint/inventory/inventory.service";
import {InventoryModel} from "../../../../../services/src/models/endpoints/Inventory";

@Component({
  selector: 'suite-move-products',
  templateUrl: './move-products.component.html',
  styleUrls: ['./move-products.component.scss']
})
export class MoveProductsComponent implements OnInit {

  title: string;

  listHalls: any[] = [];
  listHallsOriginal: any = {};
  listRows: any[] = [];
  listRowsOriginal: any = {};
  listColumns: any[] = [];
  listColumnsOriginal: any = {};
  listReferences: any = {};

  hallSelected: number;
  rowSelected: number;
  columnSelected: number;
  referenceContainer: string = '';

  listWarehousesOrigin: any[] = [];
  listPossibleMovements: any[] = [];
  listLocationsWarehouseOrigin: WarehouseMapsModel.LocationWarehouse[] = [];
  possibleMovementSelectedOrigin: number;
  warehouseSelectedOrigin: number;
  positionSelectedOrigin: any;
  hallSelectedOrigin: number;
  columnSelectedOrigin: number;
  rowSelectedOrigin: number;

  listWarehousesDestiny: any[] = [];
  listHallsDestiny: any[] = [];
  listColumnsDestiny: any[] = [];
  listRowsDestiny: any[] = [];
  listLocationsWarehouseDestiny: WarehouseMapsModel.LocationWarehouse[] = [];
  warehouseSelectedDestiny: any = null;
  positionSelectedDestiny: any;
  hallSelectedDestiny: number;
  columnSelectedDestiny: number;
  rowSelectedDestiny: number;

  public loading = null;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private warehouseService: WarehouseService,
    private warehouseMapsService: WarehouseMapsService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.title = 'Reubicar Productos';

    this.listWarehousesOrigin = this.warehouseService.listWarehouses;
    this.listWarehousesDestiny = this.warehouseService.listWarehouses;
    console.debug('Test::ListWarehousesDestiny -> ', this.listWarehousesDestiny);
    this.listHallsOriginal = this.warehouseService.listHalls;
    this.listRowsOriginal = this.warehouseService.listRows;
    this.listColumnsOriginal = this.warehouseService.listColumns;
    this.listReferences = this.warehouseService.listReferences;

    this.listPossibleMovements = [
      // Remove below comment to enable products movement by warehouse
      // {name: 'Almacén', value: 1},
      {name: 'Ubicación', value: 2},
      {name: 'Pasillo', value: 3},
      {name: 'Columna', value: 4},
      {name: 'Altura', value: 5},
    ];
    this.possibleMovementSelectedOrigin = this.listPossibleMovements[0].value;

    this.warehouseSelectedOrigin = this.warehouseService.idWarehouseMain;
    this.changeSelect(1);
    this.warehouseMapsService
      .getLocations(this.warehouseService.idWarehouseMain)
      .subscribe((res: WarehouseMapsModel.LocationWarehouse[]) => {
        this.listLocationsWarehouseOrigin = res;
      });
  }

  goToList() {
    this.modalController.dismiss();
  }

  public possibleMovementChange() {
    this.warehouseSelectedOrigin = this.warehouseService.idWarehouseMain;
    this.positionSelectedOrigin = null;
    this.hallSelectedOrigin = 0;
    this.columnSelectedOrigin = 0;
    this.rowSelectedOrigin = 0;
  }

  public changeSelect(source) {
    switch (source) {
      case 1:
        this.listHalls = this.listHallsOriginal[this.warehouseSelectedOrigin];
        this.hallSelectedOrigin = this.listHalls[this.listHalls.length-1].id;
        this.listRows = this.listRowsOriginal[this.warehouseSelectedOrigin][this.hallSelectedOrigin];
        this.rowSelectedOrigin = this.listRows[0].row;
        this.listColumns = this.listColumnsOriginal[this.warehouseSelectedOrigin][this.hallSelectedOrigin][this.rowSelectedOrigin];
        this.columnSelectedOrigin = this.listColumns[0].column;
        break;
      case 2:
        this.listRows = this.listRowsOriginal[this.warehouseSelectedOrigin][this.hallSelectedOrigin];
        let rowSelectedForColumn = this.listRows[0].row;
        this.rowSelectedOrigin = this.listRows[0].id;
        this.listColumns = this.listColumnsOriginal[this.warehouseSelectedOrigin][this.hallSelectedOrigin][rowSelectedForColumn];
        this.columnSelectedOrigin = this.listColumns[0].id;
        break;
    }
  }

  public changeLocation(source) {
    let referenceContainer = '';
    switch (source) {
      case 1:
        this.listHalls = this.listHallsOriginal[this.warehouseSelectedOrigin];
        let indexHall = 0;
        for (let iRack in this.listHalls) {
          if (this.listHalls[iRack].id == this.positionSelectedOrigin.rack.id) indexHall = parseInt(iRack);
        }
        this.hallSelectedOrigin = this.listHalls[indexHall].id;
        this.listRows = this.listRowsOriginal[this.warehouseSelectedOrigin][this.hallSelectedOrigin];
        this.rowSelectedOrigin = this.listRows[this.positionSelectedOrigin.row-1].row;
        this.listColumns = this.listColumnsOriginal[this.warehouseSelectedOrigin][this.hallSelectedOrigin][this.rowSelectedOrigin];
        this.columnSelectedOrigin = this.listColumns[this.positionSelectedOrigin.column-1].column;
        break;
      case 2:
        this.listRows = this.listRowsOriginal[this.warehouseSelectedOrigin][this.hallSelectedOrigin];
        this.rowSelectedOrigin = this.listRows[0].row;
        this.listColumns = this.listColumnsOriginal[this.warehouseSelectedOrigin][this.hallSelectedOrigin][this.rowSelectedOrigin];
        this.columnSelectedOrigin = this.listColumns[0].column;
        referenceContainer = this.listReferences[this.warehouseSelectedOrigin][this.hallSelectedOrigin][this.rowSelectedOrigin][this.columnSelectedOrigin];
        for (let container of this.listLocationsWarehouseOrigin) {
          if (container.reference == referenceContainer) this.positionSelectedOrigin = container;
        }
        break;
      case 3:
        this.listRows = this.listRowsOriginal[this.warehouseSelectedOrigin][this.hallSelectedOrigin];
        this.rowSelectedOrigin = this.listRows[0].row;
        referenceContainer = this.listReferences[this.warehouseSelectedOrigin][this.hallSelectedOrigin][this.rowSelectedOrigin][this.columnSelectedOrigin];
        for (let container of this.listLocationsWarehouseOrigin) {
          if (container.reference == referenceContainer) this.positionSelectedOrigin = container;
        }
        break;
      case 4:
        referenceContainer = this.listReferences[this.warehouseSelectedOrigin][this.hallSelectedOrigin][this.rowSelectedOrigin][this.columnSelectedOrigin || 1];
        for (let container of this.listLocationsWarehouseOrigin) {
          if (container.reference == referenceContainer) this.positionSelectedOrigin = container;
        }
        break;
    }
  }

  public changeDestiny(source) {
    let referenceContainer = '';
    switch (source) {
      case 1:
        if (this.warehouseSelectedDestiny.has_racks) {
          this.warehouseMapsService
            .getLocations(this.warehouseSelectedDestiny.id)
            .subscribe((res: WarehouseMapsModel.LocationWarehouse[]) => {
              this.listLocationsWarehouseDestiny = res;
            });
          this.listHallsDestiny = this.listHallsOriginal[this.warehouseSelectedDestiny.id];
          this.hallSelectedDestiny = 0;
          this.rowSelectedDestiny = 0;
          this.columnSelectedDestiny = 0;
        }
        this.positionSelectedDestiny = null;
        break;
      case 2:
        this.listHallsDestiny = this.listHallsOriginal[this.warehouseSelectedDestiny.id];
        let indexHall = 0;
        for (let iRack in this.listHallsDestiny) {
          if (this.listHallsDestiny[iRack].id == this.positionSelectedDestiny.rack.id) indexHall = parseInt(iRack);
        }
        this.hallSelectedDestiny = this.listHallsDestiny[indexHall].id;
        this.listRowsDestiny = this.listRowsOriginal[this.warehouseSelectedDestiny.id][this.hallSelectedDestiny];
        this.rowSelectedDestiny = this.listRowsDestiny[this.positionSelectedDestiny.row-1].row;
        this.listColumnsDestiny = this.listColumnsOriginal[this.warehouseSelectedDestiny.id][this.hallSelectedDestiny][this.rowSelectedDestiny];
        this.columnSelectedDestiny = this.listColumnsDestiny[this.positionSelectedDestiny.column-1].column;
        break;
      case 3:
        this.listRowsDestiny = this.listRowsOriginal[this.warehouseSelectedDestiny.id][this.hallSelectedDestiny];
        this.rowSelectedDestiny = this.listRowsDestiny[0].row;
        this.listColumnsDestiny = this.listColumnsOriginal[this.warehouseSelectedDestiny.id][this.hallSelectedDestiny][this.rowSelectedDestiny];
        this.columnSelectedDestiny = this.listColumnsDestiny[0].column;
        referenceContainer = this.listReferences[this.warehouseSelectedDestiny.id][this.hallSelectedDestiny][this.rowSelectedDestiny][this.columnSelectedDestiny];
        for (let container of this.listLocationsWarehouseDestiny) {
          if (container.reference == referenceContainer) this.positionSelectedDestiny = container;
        }
        break;
      case 4:
        this.listRowsDestiny = this.listRowsOriginal[this.warehouseSelectedDestiny.id][this.hallSelectedDestiny];
        this.rowSelectedDestiny = this.listRowsDestiny[0].row;
        referenceContainer = this.listReferences[this.warehouseSelectedDestiny.id][this.hallSelectedDestiny][this.rowSelectedDestiny][this.columnSelectedDestiny];
        for (let container of this.listLocationsWarehouseDestiny) {
          if (container.reference == referenceContainer) {
            this.positionSelectedDestiny = container;
          }
        }
        break;
      case 5:
        referenceContainer = this.listReferences[this.warehouseSelectedDestiny.id][this.hallSelectedDestiny][this.rowSelectedDestiny][this.columnSelectedDestiny || 1];
        for (let container of this.listLocationsWarehouseDestiny) {
          if (container.reference == referenceContainer) {
            this.positionSelectedDestiny = container;
          }
        }
        break;
    }
  }

  moveProducts() {
    let containersToMoveProducts: InventoryModel.InventoryProcessGlobal = {
      origin: {
        warehouseId: this.warehouseSelectedOrigin
      },
      destination: {
        warehouseId: this.warehouseSelectedDestiny.id
      }
    };

    switch (this.possibleMovementSelectedOrigin) {
      case 2:
        containersToMoveProducts.origin.containerReference = this.positionSelectedOrigin.reference;
        break;
      case 3:
        containersToMoveProducts.origin.rackId = this.hallSelectedOrigin;
        break;
      case 4:
        containersToMoveProducts.origin.rackId = this.hallSelectedOrigin;
        containersToMoveProducts.origin.column = this.columnSelectedOrigin;
        break;
      case 5:
        containersToMoveProducts.origin.rackId = this.hallSelectedOrigin;
        containersToMoveProducts.origin.row = this.rowSelectedOrigin;
        break;
    }

    if (this.warehouseSelectedDestiny.has_racks) {
      containersToMoveProducts.destination.containerReference = this.positionSelectedDestiny.reference;
    }

    this.showLoading('Reubicando productos...').then(() => {
      this.inventoryService
        .postGlobal(containersToMoveProducts)
        .subscribe((res: InventoryModel.ResponseGlobal) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
            this.goToList();
          }
          if (res.code == 200 || res.code == 201) {
            this.presentToast('Productos reubicados', 'success');
          } else {
            this.presentToast(res.message, 'danger');
          }
        }, (error: InventoryModel.ErrorResponse) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
            this.goToList();
          }
          this.presentToast(error.message, 'danger');
        });
    });
  }

  workwaveOk() {
    if (
      (
        (this.possibleMovementSelectedOrigin == 1 && this.warehouseSelectedOrigin)
        || (this.possibleMovementSelectedOrigin == 2 && this.positionSelectedOrigin)
        || (this.possibleMovementSelectedOrigin == 3 && this.hallSelectedOrigin)
        || (this.possibleMovementSelectedOrigin == 4 && this.hallSelectedOrigin && this.columnSelectedOrigin)
        || (this.possibleMovementSelectedOrigin == 5 && this.hallSelectedOrigin && this.rowSelectedOrigin)
      )
      && (
        (this.warehouseSelectedDestiny && this.warehouseSelectedDestiny.has_racks && this.positionSelectedDestiny)
        || (this.warehouseSelectedDestiny && !this.warehouseSelectedDestiny.has_racks)
      )
    ) {
      return false;
    }
    return true;
  }

  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3750,
      color: color || "primary"
    });
    toast.present();
  }

}
