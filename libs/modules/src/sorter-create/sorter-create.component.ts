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
import { UserModel, RolModel, IntermediaryService } from '@suite/services';
import { UpdateComponent } from './modals/update/update.component';
import { CreateComponent } from './modals/create/create.component';
import { SorterService } from '../../../services/src/lib/endpoint/sorter/sorter.service';
import { TemplateColorsService } from '../../../services/src/lib/endpoint/template-colors/template-colors.service';
import { SorterModel } from '../../../services/src/models/endpoints/Sorter';
import { tap, map, switchMap } from 'rxjs/operators';
import { TemplateColorsModel } from 'libs/services/src/models/endpoints/TemplateColors';

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
  sorters: SorterModel.Sorter[] = [];
  colors: TemplateColorsModel.TemplateColors[] = [];
  displayedColumnsWareHouse: any = ['check', 'name'];
  selectedForm: FormGroup;
  items: FormArray;
  toDeleteIds: number[] = [];

  constructor(
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalController:ModalController,
    private sorteService: SorterService,
    private intermediaryService:IntermediaryService,
    private templateColorsService:TemplateColorsService,
  ) {
    this.selectedForm = this.formBuilder.group(
      {
        selector: false,
        toSelect: this.formBuilder.array([ this.createSelect() ])
      },
      {
        validators: validators.haveItems('toSelect')
      }
    );
  }


  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  showExpasion: boolean = false;
  
  ngOnInit() {
    this.intermediaryService.presentLoading();
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
    this.templateColorsService.getIndex().subscribe((data) => {
      this.colors = data.data;
      console.log(data.data)
    })
    this.sorteService
      .getIndex().subscribe((data) => {
        this.intermediaryService.dismissLoading();
        this.sorters = data.data;
        console.log(this.sorters)
      });
  }

  getSorters() {
    this.intermediaryService.presentLoading();
    this.sorteService
    .getIndex().subscribe((data) => {
      this.intermediaryService.dismissLoading();
      this.sorters = data.data;
      console.log(this.sorters)
    });
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
    this.toDeleteIds = [];
    this.sorters.forEach(sorter => {
      this.toDeleteIds.push(sorter.id);
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
    const { warehouse, ...data} = row;
    let payload = data;
    /*payload = {
      warehouse: warehouse.id,
      ...payload
    };*/


    let modal = (await this.modalController.create({
      component: UpdateComponent,
      componentProps:{
        wareHouses: this.warehouses,
        sorter: payload,
        colors: this.colors,
      }
    }));
    modal.onDidDismiss().then(()=>{
      this.getSorters();
    })
    modal.present();
  }

  async store(row):Promise<void>{
    let modal = (await this.modalController.create({
      component: CreateComponent,
      componentProps: {
        wareHouses: this.warehouses,
        sorter: row,
        colors: this.colors,
      }
    }));
    modal.onDidDismiss().then(()=>{
      this.getSorters();
    })
    modal.present();
  }

  activeDelete() {
    event.stopPropagation();
  }

  toDeleteSorter(index) {
    event.stopPropagation();
    let repeat = false;
    let idToDelete = this.sorters[index].id;
    this.toDeleteIds.forEach(id => {
      if(id == idToDelete) {
        repeat = true;
      }
    })
    if(!repeat) {
      this.toDeleteIds.push(idToDelete);
    }
  }

  delete() {
    let deletions:Observable<any> =new Observable(observer=>observer.next());
    if(this.toDeleteIds.length > 0) {
      this.toDeleteIds.forEach(id => {
        deletions = deletions.pipe(switchMap(() => { 
          return (this.sorteService.deleteSorter(id))
        }))
      });
    }
   
    this.toDeleteIds = [];
    this.intermediaryService.presentLoading();

    deletions.subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.getSorters();
      this.intermediaryService.presentToastSuccess("Sorters eliminadas con exito");
      const controlArray = <FormArray> this.selectedForm.get('toSelect');
      controlArray.controls.forEach((control, i) => {
        control.setValue(false);
      });
    },()=>{
      this.intermediaryService.dismissLoading(); 
      this.getSorters();
      this.intermediaryService.presentToastError("No se pudieron eliminar algunas de las sorters");
    });
  }

}

export class SorterDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  data = [
    { nombre: 'sorter1', carriles: 25, warehouse: { id: 3, name: 'Almacén CLOUD'}, altura: 10, columna:8, colores: ['rojo', 'verde'] },
    { nombre: 'sorter2', carriles: 22, warehouse: { id: 3, name: 'Almacén CLOUD'}, altura: 10, columna:8, colores: ['amarillo', 'azul']  },
  ];
  connect(): Observable<Element[]> {
    const rows = [];
    this.data.forEach(element => rows.push(element, { detailRow: true, element }));
    console.log(rows);
    return of(rows);
  }

  disconnect() { }
}

