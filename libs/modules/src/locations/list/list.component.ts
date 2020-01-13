import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Location } from "@angular/common";
import { SelectionModel } from "@angular/cdk/collections";
import { IntermediaryService, RolModel, UserModel, WarehouseModel } from '@suite/services';
import { Observable, of } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { HallModel } from "../../../../services/src/models/endpoints/Hall";
import { HallsService } from "../../../../services/src/lib/endpoint/halls/halls.service";
import { ActivatedRoute } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { WarehouseService } from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import { UpdateComponent } from "../update/update.component";
import { UpdateComponent as updateHall } from '../../halls/update/update.component';
import { EnableLockContainerComponent } from '../modals/enable-lock-container/enable-lock-container.component';
import { LocationsComponent } from "../locations.component";
import { MoveProductsComponent } from "../modals/move-products/move-products.component";
import { PrinterService } from "../../../../services/src/lib/printer/printer.service";


@Component({
  selector: 'suite-list-locations',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateY(0)' })),
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.17s ease-in-out')
      ]),
      transition(':leave', [
        animate('0.17s ease-in-out', style({ transform: 'translateY(100%)' }))
      ])
    ]),
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', visibility: 'hidden', padding: '0' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('0ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('0ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class ListComponent implements OnInit {

  constructor(
    private location: Location,
    private hallsService: HallsService,
    private route: ActivatedRoute,
    private intermediaryService: IntermediaryService,
    private warehouseService: WarehouseService,
    private modalController: ModalController,
    private changeDetector: ChangeDetectorRef,
    private printerService: PrinterService
  ) {
  }

  @Input() title: string;
  @Input() apiEndpoint: string;
  @Input() dataColumns: string[];
  @Input() displayedColumns: string[];
  @Input() routePath: string;
  @Input() origin: string;

  warehouse: WarehouseModel.Warehouse;

  flagRequestList = false;

  dataSource: any[] = [];
  selection = new SelectionModel<UserModel.User | RolModel.Rol>(true, []);
  showDeleteButton = false;

  parentPage: string = 'Almacenes';
  paramsReceived;
  warehouseSelected: number;

  // warehouse list
  warehouses: Array<WarehouseModel.Warehouse> = [];


  dd(event, row) {
    event.preventDefault();
    event.stopPropagation();
    this.selectRowToExpand(row);
  }
  async toUpdate(event, row) {
    event.preventDefault();
    event.stopPropagation();
    let updateComponent = updateHall;
    if (updateComponent) {
      const modal = await this.modalController.create({
        component: updateComponent,
        componentProps: { id: row.id, row: row, routePath: this.routePath }
      });
      modal.onDidDismiss()
        .then(() => {
          this.initHalls();
          if (this.routePath === '/warehouses') {
            this.warehouseService
              .init()
              .then((data: Observable<HttpResponse<any>>) => {
                data.subscribe((res: HttpResponse<any>) => {
                  // Load of main warehouse in memory
                  this.warehouseService.idWarehouseMain = res.body.data.id;
                });
              });
          }
        });

      return await modal.present();
    }
  }
  isMainWarehouseManagementSection = (): boolean =>
    this.origin === LocationsComponent.MAIN_WAREHOUSE_MANAGEMENT_SECTION_PATH;
  isWarehouseListSection = (): boolean =>
    this.origin === LocationsComponent.WAREHOUSE_LIST_SECTION_PATH;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any = null;

  locationsSelected: any = {};
  countLocationsSelected: number = 0;
  listRowsExpanded: any = {};

  private intervalReload = null;

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.paramsReceived = params;
      this.initHalls();
    });
    if (this.isMainWarehouseManagementSection()) {
      this.setIntervalForReload(1);
    }

    this.getWarehouses();
  }

  /**
   * Open enable lock container modal
   */
  async openEnableLockContainer(): Promise<any> {
    let modal = await this.modalController.create({
      component: EnableLockContainerComponent,
      componentProps: { warehouseId: this.paramsReceived.params.id }
    });
    modal.onDidDismiss()
      .then(data => {
        if (data && data.data && data.data.reload) {
          this.initHalls();
        }
      });
    return modal.present();
  }

  ngOnDestroy() {
    clearInterval(this.intervalReload);
    this.intervalReload = null;
  }

  initHalls() {
    this.warehouseSelected = this.paramsReceived.params.id;
    if (this.isMainWarehouseManagementSection()) {
      this.warehouseSelected = this.warehouseService.idWarehouseMain;
      this.parentPage = null;
    }

    this.warehouseService.getShow(this.warehouseSelected).subscribe(warehouse => {
      this.warehouse = warehouse
    });

    this.hallsService
      .getFullIndex(this.warehouseSelected)
      .then(
        (
          data: Observable<
            HttpResponse<HallModel.ResponseFullIndex>
          >
        ) => {
          data.subscribe(
            (
              res: HttpResponse<
                HallModel.ResponseFullIndex
              >
            ) => {
              this.flagRequestList = true;
              this.dataSource = res.body.data
                .map(hall => {
                  let expanded = false;
                  let dropdown_icon = 'ios-arrow-down';
                  if (this.expandedElement && this.expandedElement.id === hall.id) {
                    expanded = true;
                    dropdown_icon = 'ios-arrow-up';
                  }
                  return {
                    id: hall.id,
                    hall: hall.hall,
                    columns: hall.columns,
                    rows: hall.rows,
                    containers: hall.containers,
                    use: '',
                    expanded: expanded,
                    dropdown_icon: dropdown_icon
                  }
                });


              const rows = [];
              this.dataSource.forEach(element => {

                element.container = [];
                let totalLocations = element.containers.length;
                let freeLocations = 0;
                let enabledLocations = 0;
                element.totalContainers = totalLocations;
                element.containers.forEach(containers => {
                  let rowIndex = containers.row - 1;
                  containers.selected = false;
                  if (typeof element.container[rowIndex] === 'undefined') {
                    element.container[rowIndex] = [];
                  }
                  element.container[rowIndex].push(containers);
                  if (containers.enabled) {
                    enabledLocations++;
                    if (containers.items <= 0) {
                      freeLocations++;
                    }
                  }
                  if (containers.incidence) {
                    if (!element.incidence || (element.incidence && element.incidence !== 'serious')) {
                      element.incidence = containers.incidence;
                    }
                  }
                });
                element.freeLocations = freeLocations;
                element.locations = freeLocations + '/' + enabledLocations + ' libres';
                element.hallEnabled = enabledLocations > 0;
                if (element.expanded) {
                  this.expandedElement = element;
                }

                return rows.push(element, { detailRow: true, element });
              });
              this.dataSource = rows;
            }
          );
        }
      );
    this.selection = new SelectionModel<UserModel.User | RolModel.Rol>(
      true,
      []
    );
    this.showDeleteButton = false;
  }

  goPreviousPage() {
    this.location.back();
  }

  selectRowToExpand(row) {
    row.expanded = !row.expanded;
    if (row.expanded) {
      this.listRowsExpanded[row.id] = row;
      row.dropdown_icon = 'ios-arrow-up';
    } else {
      delete this.listRowsExpanded[row.id];
      row.dropdown_icon = 'ios-arrow-down';
    }
    this.expandedElement = row;
    for (let containerIndex in this.locationsSelected) {
      this.locationsSelected[containerIndex].column.selected = false;
    }
    this.locationsSelected = {};
    this.countLocationsSelected = 0;
    for (let rowData of this.dataSource) {
      if (rowData.id !== row.id) {
        rowData.expanded = false;
        rowData.dropdown_icon = 'ios-arrow-down';
      }
    }
  }

  selectLocation(event, data, row, column, iRow, iColumn) {
    if (this.isWarehouseListSection()) {
      if (!this.locationsSelected[column.id]) {
        this.locationsSelected[column.id] = { data: data, row: row, column: column, iRow: iRow, iColumn: iColumn };
        this.expandedElement.container[iRow][iColumn].selected = true;
        this.countLocationsSelected++;
      } else {
        this.expandedElement.container[iRow][iColumn].selected = false;
        delete this.locationsSelected[column.id];
        this.countLocationsSelected--;
      }
    } else {
      this.editLocation(column);
    }
  }

  selectColumn(event, data, rows, iColumn) {
    if (this.isWarehouseListSection()) {
      rows.forEach((row, iRow) => {
        this.selectLocation(event, data, row, row[iColumn], iRow, iColumn);
      });
    }
  }

  selectRow(event, data, row, iRow) {
    if (this.isWarehouseListSection()) {
      row.forEach((column, iColumn) => {
        this.selectLocation(event, data, row, column, iRow, iColumn);
      });
    }
  }

  rangeFromValue(value) {
    let items = [];
    for (var i = 1; i <= value; i++) {
      items.push(i);
    }
    return items;
  }

  selectAllLocations() {
    if (this.isWarehouseListSection()) {
      if (this.expandedElement.totalContainers !== this.countLocationsSelected) {
        for (let row of this.expandedElement.container) {
          for (let container of row) {
            if (!container.selected) {
              container.selected = true;
              this.locationsSelected[container.id] = { row: row, column: container };
              this.countLocationsSelected++;
            }
          }
        }
      } else {
        this.locationsSelected = {};
        this.countLocationsSelected = 0;
        for (let row of this.expandedElement.container) {
          for (let container of row) {
            container.selected = false;
          }
        }
      }
    }
  }

  async printReferencesLocations() {
    if ((<any>window).cordova) {
      for (let idLocation in this.locationsSelected) {
        let container = this.locationsSelected[idLocation].column;
        await this.printerService.print({text: [container.reference], type: 0})
        // stop errors and attempt to print next tag
          .catch(reason => {});
      }
    } else {
      let referencesToPrint: Array<string> = [];
      for (let idLocation in this.locationsSelected) {
        let container = this.locationsSelected[idLocation].column;
        referencesToPrint.push(container.reference);
      }
      if (referencesToPrint.length > 0) {
        await this.printerService.printBarcodesOnBrowser(referencesToPrint);
      }
    }
  }

  disableLocations() {
    for (let idLocation in this.locationsSelected) {
      let container = this.locationsSelected[idLocation].column;
      if (container.enabled) {
        this.hallsService
          .updateDisable(container.id)
          .then((data: Observable<HttpResponse<HallModel.ResponseUpdateDisable>>) => {
            data.subscribe(((res: HttpResponse<HallModel.ResponseUpdateDisable>) => {
              this.intermediaryService.presentToastPrimary('Posición desactivada');
            }), (errorResponse: HttpErrorResponse) => {
              this.intermediaryService.presentToastError(errorResponse.error.errors);
            });
          }, (errorResponse: HttpErrorResponse) => {
            this.intermediaryService.presentToastError('Error - Errores no estandarizados');
          });
      } else {
        this.hallsService
          .updateEnable(container.id)
          .then((data: Observable<HttpResponse<HallModel.ResponseUpdateEnable>>) => {
            data.subscribe(((res: HttpResponse<HallModel.ResponseUpdateEnable>) => {
              this.intermediaryService.presentToastPrimary('Posición activada');
            }), (errorResponse: HttpErrorResponse) => {
              this.intermediaryService.presentToastError(errorResponse.error.errors);
            });
          }, (errorResponse: HttpErrorResponse) => {
            this.intermediaryService.presentToastError('Error - Errores no estandarizados');
          });
      }
    }
    this.reloadData();
  }

  lockLocations() {
    for (let idLocation in this.locationsSelected) {
      let container = this.locationsSelected[idLocation].column;
      if (container.lock) {
        this.hallsService
          .updateUnlock(container.id)
          .then((data: Observable<HttpResponse<HallModel.ResponseUpdateEnable>>) => {
            data.subscribe(((res: HttpResponse<HallModel.ResponseUpdateEnable>) => {
              this.intermediaryService.presentToastPrimary('Posición desbloqueada');
            }), (errorResponse: HttpErrorResponse) => {
              this.intermediaryService.presentToastError(errorResponse.error.errors);
            });
          }, (errorResponse: HttpErrorResponse) => {
            this.intermediaryService.presentToastError('Error - Errores no estandarizados');
          });
      } else {
        this.hallsService
          .updateLock(container.id)
          .then((data: Observable<HttpResponse<HallModel.ResponseUpdateDisable>>) => {
            data.subscribe(((res: HttpResponse<HallModel.ResponseUpdateDisable>) => {
              this.intermediaryService.presentToastPrimary('Posición bloqueada');
            }), (errorResponse: HttpErrorResponse) => {
              this.intermediaryService.presentToastError(errorResponse.error.errors);
            });
          }, (errorResponse: HttpErrorResponse) => {
            this.intermediaryService.presentToastError('Error - Errores no estandarizados');
          });
      }
    }
    this.reloadData();
  }

  async editLocation(container) {
    const modal = await this.modalController.create({
      component: UpdateComponent,
      componentProps: { container: container, warehouseId: this.warehouseSelected }
    });

    modal.onDidDismiss()
      .then(() => {
        this.reloadData();
        this.setIntervalForReload(2);
      });

    clearInterval(this.intervalReload);
    this.intervalReload = null;

    return await modal.present();
  }

  reloadData() {
    for (let containerIndex in this.locationsSelected) {
      this.locationsSelected[containerIndex].column.selected = false;
    }
    this.locationsSelected = {};
    this.countLocationsSelected = 0;
    this.initHalls();
  }

  setIntervalForReload(source) {
    if (!this.intervalReload) {
      this.intervalReload = setInterval(() => {
        this.reloadData();
      }, 60 * 1000);
    }
  }

  async openModalMoveProducts() {
    const modal = await this.modalController.create({
      component: MoveProductsComponent
    });

    modal.onDidDismiss()
      .then(() => {
        this.reloadData();
        this.setIntervalForReload(2);
      });

    clearInterval(this.intervalReload);
    this.intervalReload = null;

    return await modal.present();
  }

  getWarehouses() {
    this.warehouseService.getIndex().then(observable => {
      observable.subscribe(response => {
        this.warehouses = (<any>response.body).data;
      })
    })
  }

  warehouseChange(event) {
    this.warehouseService.idWarehouseMain = this.warehouseSelected;
    this.initHalls();
  }

  existWarehouses() {
    return this.warehouse > 0;
  }
}
