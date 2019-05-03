import {Component, Input, OnInit} from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Location} from "@angular/common";
import {SelectionModel} from "@angular/cdk/collections";
import {RolModel, UserModel} from "@suite/services";
import {Observable, of} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {HallModel} from "../../../../../../libs/services/src/models/endpoints/Hall";
import {HallsService} from "../../../../../../libs/services/src/lib/endpoint/halls/halls.service";
import {ActivatedRoute} from "@angular/router";

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
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class ListComponent implements OnInit {

  constructor(
    private location: Location,
    private hallsService: HallsService,
    private route: ActivatedRoute
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
                  return {
                    id: hall.id,
                    hall: hall.hall+' . '+hall.columns+' . '+hall.rows,
                    columns: hall.columns,
                    rows: hall.rows,
                    use: '',
                    expanded: false,
                    dropdown_icon: 'ios-arrow-down'
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
                      res.body.data.forEach(containers => {
                        let rowIndex = containers.row - 1;
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
      row.dropdown_icon = 'ios-arrow-up';
    } else {
      row.dropdown_icon = 'ios-arrow-down';
    }
    this.expandedElement = row;
  }

  rangeFromValue(value) {
    let items = [];
    for(var i = 1; i <= value; i++){
      items.push(i);
    }
    return items;
  }
}
