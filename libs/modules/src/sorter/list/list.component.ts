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
import { StoreComponent } from './modals-zone/store/store.component';
import { UpdateComponent } from './modals-zone/update/update.component';
import { WarehousesModalComponent } from './modals-zone/warehouses-modal/warehouses-modal.component';
import { RailsConfigurationComponent } from './modals-zone/rails-configuration/rails-configuration.component';

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

  displayedColumns = ['icon', 'updateCarriles', 'delete', 'Ntemplate', 'nombre', 'carriles', 'active', 'configurarCarriles', 'warehoures'];
  dataSource = new ExampleDataSource();
  warehouses: WarehouseModel.Warehouse[] = [];
  displayedColumnsWareHouse: any = ['check', 'name'];
  selectedForm: FormGroup;
  items: FormArray;
  showRails: boolean = false;

  rails = [
    {
      height:1,
      columns:[
        {column:1, ways_number:1},
        {column:2, ways_number:2},
        {column:3, ways_number:3}
      ]
    },
    {
      height:2,
      columns:[
        {column:1, ways_number:4},
        {column:2, ways_number:5},
        {column:3, ways_number:6}
      ]
    },
    {
      height:3,
      columns:[
        {column:1, ways_number:7},
        {column:2, ways_number:8},
        {column:3, ways_number:9}
      ]
    }
  ]

  constructor(
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    private modalController:ModalController
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
        (data: Observable<HttpResponse<UserModel.ResponseIndex | RolModel.ResponseIndex>>) => {
          data.subscribe(
            (res: HttpResponse<UserModel.ResponseIndex | RolModel.ResponseIndex>) => {
              this.warehouses = res.body.data;
              this.initSelect(this.warehouses);
            },
            (err) => {
              console.log(err)
            }
          );
        }
      );
  }

  clickShowExpasion(row: any) {
    event.stopPropagation();
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

  async update(row):Promise<void>{
    let modal = (await this.modalController.create({
      component:UpdateComponent,
      componentProps:{
        zona:row
      }
    }));
    modal.present();
  }

  async store(row):Promise<void>{
    let modal = (await this.modalController.create({
      component:StoreComponent
    }));
    modal.present();
  }

  getColumn(index: number, column: number, height: number): void {
    //get right and left values
    this.rails.forEach(rail => {
      if(rail.height == height) {
       let columns = rail.columns;
       for(let i = 0; i < columns.length; i++) 
        if(column == columns[i].ways_number) {
          console.log('Current: '+column)
          if(columns[i-1]) {
            console.log('Left: '+columns[i-1].ways_number)
          }
          if(columns[i+1]) {
            console.log('Right: '+columns[i+1].ways_number)
          }
        }
      }
    })

    //get top and bottom
    for(let i = 0; i < this.rails.length; i++) {
      if(this.rails[i].height == height) {
          if(this.rails[i-1]) {
            for(let j = 0; j < this.rails[i-1].columns.length; j++) {
              if(j == index){
                console.log('Top: '+ this.rails[i-1].columns[j].ways_number)
              }
            }
          }
          if(this.rails[i+1]) {
            for(let j = 0; j < this.rails[i+1].columns.length; j++) {
              if(j == index){
                console.log('Bottom: '+ this.rails[i+1].columns[j].ways_number)
              }
            }
          }
      }
    }
  }

  activeDelete() {
    event.stopPropagation();
  }
  
  delete() {
    console.log('delete')
  }

  async openWarehousesModal() {
    event.stopPropagation();
    let modal = (await this.modalController.create({
      component:WarehousesModalComponent,
      componentProps:{
        warehouses: this.warehouses
      }
    }));
    modal.present();
  }

  async openRailsConfiguration() {
    event.stopPropagation();
    let modal = (await this.modalController.create({
      component:RailsConfigurationComponent
    }));
    modal.present();
  }

  displayRails() {
    event.stopPropagation();
    this.showRails = !this.showRails;
  }
}

export class ExampleDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  data = [
    { icon: '', Ntemplate: 1, zona: 2, nombre: 'zone1', carriles: 25, dropdown: false },
    { icon: '', Ntemplate: 2, zona: 2, nombre: 'zone2', carriles: 45, dropdown: false },
    { icon: '', Ntemplate: 3, zona: 2, nombre: 'zone3', carriles: 65, dropdown: false },
  ];
  connect(): Observable<Element[]> {
    const rows = [];
    this.data.forEach(element => rows.push(element, { detailRow: true, element }));
    console.log(rows);
    return of(rows);
  }

  disconnect() { }
}
