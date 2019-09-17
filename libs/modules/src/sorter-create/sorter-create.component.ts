import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { UpdateComponent } from './modals/update/update.component';
import { CreateComponent } from './modals/create/create.component';
import { DataSource } from '@angular/cdk/table';
import { Observable, of } from 'rxjs';
import { CrudService } from '@suite/common/ui/crud';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { validators } from '../utils/validators';
import { HttpResponse } from '@angular/common/http';
import { UserModel, RolModel } from '@suite/services';

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

  displayedColumns = ['delete', 'Ntemplate', 'zona', 'nombre', 'carriles', 'active', 'dropdown'];
  dataSource = new ExampleDataSource();
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
    event.stopPropagation();
    this.router.navigate(['/sorter/plantilla/1'])
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
      component:CreateComponent
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

