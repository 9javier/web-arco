import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Location} from "@angular/common";
import {SelectionModel, DataSource} from "@angular/cdk/collections";
import {RolModel, UserModel, WarehouseModel} from "@suite/services";
import {Observable, of} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {HallModel} from "../../../../services/src/models/endpoints/Hall";
import {HallsService} from "../../../../services/src/lib/endpoint/halls/halls.service";
import {ActivatedRoute} from "@angular/router";
import {ModalController, ToastController, NavParams} from "@ionic/angular";
import {WarehouseService} from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
/*import {UpdateComponent} from "../update/update.component";
import { UpdateComponent as updateHall } from '../../halls/update/update.component';
import { EnableLockContainerComponent } from '../modals/enable-lock-container/enable-lock-container.component';
import {LocationsComponent} from "../locations.component";
import {MoveProductsComponent} from "../modals/move-products/move-products.component";*/
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";
import { CrudService } from '../../../../common/ui/crud/src/lib/service/crud.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { validators } from '../../utils/validators';



@Component({
  selector: 'suite-list-sorter',
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

  displayedColumns = ['icon', 'Ntemplate', 'zona', 'dropdown'];
  dataSource = new ExampleDataSource();
  warehouses: any = [];
  displayedColumnsWareHouse: any = ['check', 'name'];
  selectedForm: FormGroup;
  items: FormArray;

  constructor(
    private crudService: CrudService,
    private formBuilder: FormBuilder
  ) {
    this.selectedForm = this.formBuilder.group(
      {
        selector: false,
        selects: this.formBuilder.array([ this.createSelect() ])
      },
      {
        validators: validators.haveItems('selects')
      }
    );
    console.log(this.selectedForm)
  }


  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  showExpasion: boolean = false;
  
  ngOnInit() {
    this.crudService
      .getIndex('Warehouses')
      .then(
        (
          data: Observable<
            HttpResponse<UserModel.ResponseIndex | RolModel.ResponseIndex>
          >
        ) => {
          data.subscribe(
            (
              res: HttpResponse<
                UserModel.ResponseIndex | RolModel.ResponseIndex
              >
            ) => {
              this.warehouses = res.body.data;
              console.log(this.warehouses);
              this.initSelect(this.warehouses);
            },
            (err) => {
              console.log(err)
            }, () => {

            }
          );
        }
      );
  }

  clickShowExpasion(row: any) {
    console.log(row)
    this.expandedElement = row;
    this.showExpasion = !this.showExpasion;
    row.dropdown = this.showExpasion;
  }

  selectAll(event):void{
    let value = event.detail.checked;
    const controlArray = <FormArray> this.selectedForm.get('selects');
    controlArray.controls.forEach((control, i) => {
      control.setValue(value);
    });
  }

  initSelect(items) {
    this.selectedForm.removeControl('selects');
    this.selectedForm.addControl('selects', this.formBuilder.array(items.map(item => new FormControl(Boolean(false)))));
  }

  createSelect(): FormControl {
    return new FormControl(Boolean(false));
  }
}

export class ExampleDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  data = [
    { icon: '', Ntemplate: 1, zona: 2, dropdown: false },
    { icon: '', Ntemplate: 2, zona: 2, dropdown: false },
    { icon: '', Ntemplate: 3, zona: 2, dropdown: false },
  ];
  connect(): Observable<Element[]> {
    const rows = [];
    this.data.forEach(element => rows.push(element, { detailRow: true, element }));
    console.log(rows);
    return of(rows);
  }

  disconnect() { }
}