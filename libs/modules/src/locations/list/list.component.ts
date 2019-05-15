import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Location} from "@angular/common";
import {SelectionModel} from "@angular/cdk/collections";
import {RolModel, UserModel} from "@suite/services";
import {Observable, of} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {HallModel} from "../../../../services/src/models/endpoints/Hall";
import {HallsService} from "../../../../services/src/lib/endpoint/halls/halls.service";
import {ActivatedRoute} from "@angular/router";
import {ModalController, ToastController} from "@ionic/angular";
import {WarehouseService} from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import {UpdateComponent} from "../update/update.component";

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
    private toastController: ToastController,
    private warehouseService: WarehouseService,
    private modalController: ModalController
  ) {

  }

  @Input() title: string;
  @Input() apiEndpoint: string;
  @Input() dataColumns: string[];
  @Input() displayedColumns: string[];
  @Input() routePath: string;
  @Input() origin: string;

  dataSource: any[] = [];
  selection = new SelectionModel<UserModel.User | RolModel.Rol>(true, []);
  showDeleteButton = false;

  parentPage: string = 'Almacenes';
  paramsReceived;
  warehouseSelected: number = 1;

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any = null;

  locationsSelected: any = {};
  countLocationsSelected: number = 0;
  listRowsExpanded: any = {};

  private intervalReload = null;

  ngOnInit() {
    this.route.paramMap.subscribe((params: any )=> {
      this.paramsReceived = params;
      this.initHalls();
    });
    if (this.origin == 'manage') {
      this.setIntervalForReload(1);
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalReload);
    this.intervalReload = null;
  }

  initHalls() {
    this.warehouseSelected = this.paramsReceived.params.id;
    if (this.origin == 'manage') {
      this.warehouseSelected = this.warehouseService.idWarehouseMain;
      this.parentPage = null;
    }
    this.hallsService
      .getIndex(this.warehouseSelected)
      .then(
        (
          data: Observable<
            HttpResponse<HallModel.ResponseIndex>
            >
        ) => {
          data.subscribe(
            (
              res: HttpResponse<
                HallModel.ResponseIndex
                >
            ) => {
              this.dataSource = res.body.data
                .map(hall => {
                  let expanded = false;
                  let dropdown_icon = 'ios-arrow-down';
                  if (this.expandedElement && this.expandedElement.id == hall.id) {
                    expanded = true;
                    dropdown_icon = 'ios-arrow-up';
                  }
                  return {
                    id: hall.id,
                    hall: hall.hall+' . '+hall.columns+' . '+hall.rows,
                    columns: hall.columns,
                    rows: hall.rows,
                    use: '',
                    expanded: expanded,
                    dropdown_icon: dropdown_icon
                  }
                });


              const rows = [];
              this.dataSource.forEach(element => {
                this.hallsService
                  .getShow(element.id)
                  .then((data: Observable<HttpResponse<HallModel.ResponseShow>>) => {
                    data.subscribe(((res: HttpResponse<HallModel.ResponseShow>) => {
                      element.container = [];
                      let totalLocations = res.body.data.length;
                      let freeLocations = 0;
                      element.totalContainers = totalLocations;
                      res.body.data.forEach(containers => {
                        let rowIndex = containers.row - 1;
                        containers.selected = false;
                        if (typeof element.container[rowIndex] == 'undefined') {
                          element.container[rowIndex] = [];
                        }
                        element.container[rowIndex].push(containers);
                        if (containers.enabled && containers.items <= 0) {
                          freeLocations++;
                        }
                        if (containers.incidence) {
                          if (!element.incidence || (element.incidence && element.incidence != 'serious')) {
                            element.incidence = containers.incidence;
                          }
                        }
                      });
                      element.freeLocations = freeLocations;
                      element.locations = freeLocations+'/'+totalLocations+' libres';
                      if (element.expanded) {
                        this.expandedElement = element;
                      }
                    }));
                  });

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

  goPreviousPage () {
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
      if (rowData.id != row.id) {
        rowData.expanded = false;
        rowData.dropdown_icon = 'ios-arrow-down';
      }
    }
  }

  selectLocation(event, data, row, column, iRow, iColumn) {
    if (this.origin == 'list') {
      if (!this.locationsSelected[column.id]) {
        this.locationsSelected[column.id] = {data: data, row: row, column: column, iRow: iRow, iColumn: iColumn};
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

  rangeFromValue(value) {
    let items = [];
    for(var i = 1; i <= value; i++){
      items.push(i);
    }
    return items;
  }

  selectAllLocations() {
    if (this.expandedElement.totalContainers != this.countLocationsSelected) {
      for (let row of this.expandedElement.container) {
        for (let container of row) {
          if (!container.selected) {
            container.selected = true;
            this.locationsSelected[container.id] = {row: row, column: container};
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

  printReferencesLocations() {

  }

  disableLocations() {
    for (let idLocation in this.locationsSelected) {
      let container = this.locationsSelected[idLocation].column;
      if (container.enabled) {
        this.hallsService
          .updateDisable(container.id)
          .then((data: Observable<HttpResponse<HallModel.ResponseUpdateDisable>>) => {
            data.subscribe(((res: HttpResponse<HallModel.ResponseUpdateDisable>) => {
              this.presentToast('Posición desactivada', null);
            }));
          }, (errorResponse: HttpErrorResponse) => {
            this.presentToast('Error - Errores no estandarizados', 'danger');
          });
      } else {
        this.hallsService
          .updateEnable(container.id)
          .then((data: Observable<HttpResponse<HallModel.ResponseUpdateEnable>>) => {
            data.subscribe(((res: HttpResponse<HallModel.ResponseUpdateEnable>) => {
              this.presentToast('Posición activada', null);
            }));
          }, (errorResponse: HttpErrorResponse) => {
            this.presentToast('Error - Errores no estandarizados', 'danger');
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

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3750,
      color: color || "primary"
    });
    toast.present();
  }

  setIntervalForReload(source) {
    if (!this.intervalReload) {
      this.intervalReload = setInterval(() => {
        this.reloadData();
      }, 10 * 1000);
    }
  }
}
