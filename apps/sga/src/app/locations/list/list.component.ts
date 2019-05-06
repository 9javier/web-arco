import {Component, Input, OnInit} from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Location} from "@angular/common";
import {SelectionModel} from "@angular/cdk/collections";
import {RolModel, UserModel} from "@suite/services";
import {Observable, of} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {HallModel} from "../../../../../../libs/services/src/models/endpoints/Hall";
import {HallsService} from "../../../../../../libs/services/src/lib/endpoint/halls/halls.service";
import {ActivatedRoute} from "@angular/router";
import {ToastController} from "@ionic/angular";

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
    private toastController: ToastController
  ) {

  }

  @Input() title: string;
  @Input() apiEndpoint: string;
  @Input() dataColumns: string[];
  @Input() displayedColumns: string[];
  @Input() routePath: string;

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

  ngOnInit() {
    this.route.paramMap.subscribe((params: any )=> {
      this.paramsReceived = params;
      this.initHalls();
    });
  }

  initHalls() {
    this.warehouseSelected = this.paramsReceived.params.id;
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
                        if (containers.enabled) {
                          freeLocations++;
                        }
                      });
                      element.locations = freeLocations+'/'+totalLocations+' libres';
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
    if (this.expandedElement) {
      for (let rowContainer of this.expandedElement.container) {
        for (let container of rowContainer) {
          if (!container.selected) {
            container.selected = true;
          }
        }
      }
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
    // column.selected = !column.selected;
    if (!this.locationsSelected[column.id]) {
      this.locationsSelected[column.id] = {data: data, row: row, column: column, iRow: iRow, iColumn: iColumn};
      this.countLocationsSelected++;
    } else {
      delete this.locationsSelected[column.id];
      this.countLocationsSelected--;
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

  editLocation() {

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
}
