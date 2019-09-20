import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Location} from "@angular/common";
import {SelectionModel, DataSource} from "@angular/cdk/collections";
import {RolModel, UserModel, WarehouseModel} from "@suite/services";
import {Observable, of} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {HallModel} from "../../../services/src/models/endpoints/Hall";
import {HallsService} from "../../../services/src/lib/endpoint/halls/halls.service";
import {ActivatedRoute} from "@angular/router";
import {ModalController, ToastController, NavParams} from "@ionic/angular";
import {WarehouseService} from "../../../services/src/lib/endpoint/warehouse/warehouse.service";
/*import {UpdateComponent} from "../update/update.component";
import { UpdateComponent as updateHall } from '../../halls/update/update.component';
import { EnableLockContainerComponent } from '../modals/enable-lock-container/enable-lock-container.component';
import {LocationsComponent} from "../locations.component";
import {MoveProductsComponent} from "../modals/move-products/move-products.component";*/
import {PrinterService} from "../../../services/src/lib/printer/printer.service";
import { CrudService } from '../../../common/ui/crud/src/lib/service/crud.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { validators } from '../utils/validators';
import { Router } from '@angular/router';
import { UpdateComponent } from './modals/update/update.component';
import { StoreComponent } from './modals/store/store.component';

@Component({
  selector: 'suite-sorter',
  templateUrl: './sorter.component.html',
  styleUrls: ['./sorter.component.scss'],
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
export class SorterComponent implements OnInit {

  displayedColumns = ['delete', 'Ntemplate', 'zona', 'nombre', 'carriles', 'active', 'dropdown'];
  dataSource = new ExampleDataSource();
  displayedColumnsWareHouse: any = ['check', 'name'];
  selectedForm: FormGroup;
  selectedFormActive: FormGroup;
  items: FormArray;

  constructor(
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalController:ModalController,
    
  ) {
    this.selectedForm = this.formBuilder.group(
      {
        selector: false,
        selects: this.formBuilder.array([ this.createSelect() ])
      },
      {
        validators: validators.haveItems('toSelect')
      }
    );
    console.log(this.selectedForm);

    this.selectedFormActive = this.formBuilder.group(
      {
        selector: false,
        selects: this.formBuilder.array([ this.createSelect() ])
      },
      {
        validators: validators.haveItems('toSelectActive')
      }
    );
  }


  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  showExpasion: boolean = false;
  warehouses: any = [];
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
            this.initSelectActive(this.warehouses);
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
    event.stopPropagation();
    this.router.navigate(['/sorter/plantilla/1']);
  }

  selectAll(event):void{
    let value = event.detail.checked;
    const controlArray = <FormArray> this.selectedForm.get('toSelect');
    controlArray.controls.forEach((control, i) => {
      control.setValue(value);
    });
  }

  initSelect(items) {
    this.selectedForm.removeControl('toSelect');
    this.selectedForm.addControl('toSelect', this.formBuilder.array(items.map(item => new FormControl(Boolean(false)))));
  }

  selectAllActive(event):void{
    let value = event.detail.checked;
    const controlArray = <FormArray> this.selectedFormActive.get('toSelectActive');
    controlArray.controls.forEach((control, i) => {
      control.setValue(value);
    });
  }

  initSelectActive(items) {
    this.selectedFormActive.removeControl('toSelectActive');
    this.selectedFormActive.addControl('toSelectActive', this.formBuilder.array(items.map(item => new FormControl(Boolean(false)))));
  }

  createSelect(): FormControl {
    return new FormControl(Boolean(false));
  }

  async update(row):Promise<void>{
    let modal = (await this.modalController.create({
      component:UpdateComponent,
      componentProps:{
        template:row
      }
    }));
    modal.onDidDismiss().then(()=>{
      //this.getAgencies();
    })
    modal.present();
  }

  async store(row):Promise<void>{
    let modal = (await this.modalController.create({
      component:StoreComponent
    }));
    modal.onDidDismiss().then(()=>{
      //this.getAgencies();
    })
    modal.present();
  }

  activeDelete() {
    event.stopPropagation();
  }

  delete() {
    console.log('delete')
  }

}

export class ExampleDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  data = [
    { icon: '', Ntemplate: 1, zona: 2, dropdown: false, nombre:'template1', carriles: 20 },
    { icon: '', Ntemplate: 2, zona: 2, dropdown: false, nombre:'template2', carriles: 23 },
    { icon: '', Ntemplate: 3, zona: 2, dropdown: false, nombre:'template3', carriles: 26 },
  ];
  connect(): Observable<Element[]> {
    const rows = [];
    this.data.forEach(element => rows.push(element, { detailRow: true, element }));
    console.log(rows);
    return of(rows);
  }

  disconnect() { }
}