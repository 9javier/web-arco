import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { DataSource } from '@angular/cdk/table';
import { Observable, of } from 'rxjs';
import { CrudService } from '@suite/common/ui/crud';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { validators } from '../utils/validators';
import { HttpResponse } from '@angular/common/http';
import { UserModel, RolModel } from '@suite/services';
import { UpdateComponent } from './modals/update/update.component';
import { CreateComponent } from './modals/create/create.component';

@Component({
  selector: 'suite-sorter-create',
  templateUrl: './sorter-create.component.html',
  styleUrls: ['./sorter-create.component.scss'],
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
export class SorterCreateComponent implements OnInit {

  displayedColumns = ['delete', 'nombre', 'warehouse', 'altura', 'columna', 'colores'];
  dataSource = new SorterDataSource();
  warehouses: any = [];
  displayedColumnsWareHouse: any = ['check', 'name'];
  selectedForm: FormGroup;
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
    event.stopPropagation();
    this.router.navigate(['/sorter/plantilla/1'])
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

  createSelect(): FormControl {
    return new FormControl(Boolean(false));
  }

  async update(row):Promise<void>{
    let modal = (await this.modalController.create({
      component: UpdateComponent,
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
      component: CreateComponent,
      componentProps: {
        wareHouses: this.warehouses 
      }
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

export class SorterDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  data = [
    { nombre: 'sorter1', carriles: 25, warehouse: 'Almacen Cloud', altura: 10, columna:8, colores: ['rojo', 'verde'] },
    { nombre: 'sorter2', carriles: 22, warehouse: 'Almacen Cloud', altura: 10, columna:8, colores: ['amarillo', 'azul']  },
  ];
  connect(): Observable<Element[]> {
    const rows = [];
    this.data.forEach(element => rows.push(element, { detailRow: true, element }));
    console.log(rows);
    return of(rows);
  }

  disconnect() { }
}

