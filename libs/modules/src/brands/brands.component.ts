import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { IntermediaryService } from '@suite/services';
import { SelectionModel } from '@angular/cdk/collections';
import { BrandsService } from '../../../services/src/lib/endpoint/brands/brandsServices';
import {NewBrandComponent} from './new-brand/new-brand.component';
import {ModalController, AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {TableEmitter } from './../../../services/src/models/tableEmitterType';
import { BODY } from 'config/base';

@Component({
  selector: 'brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit {
  displayedColumns=['brand','model','reference','group','edit'];
  dataSource: MatTableDataSource<any>;
  pagerValues = [10, 20, 100];
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterButtonBrand') filterButtonBrand: FilterButtonComponent;
  isFilteringBrand: number = 0;
  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagination;
  filtersData=[];
  brand: Array<TagsInputOption> = [];

  columnsData = [
    {
      name: 'brand',
      title:'Marca',
      field: ['brand','name'],
      filters:true,
      type:'text'
    },
    {
      name: 'model',
      title:'Modelo',
      field: ['model','name'],
      filters:true,
      type: 'text'
    }, 
    {
      name: 'reference',
      title:'Referencia',
      field: ['model','reference'],
      filters:true,
      sorter:true,
      type: 'text'
    },
    {
      name: 'Grupo',
      title:'Grupo',
      field: ['numberGroups'],
      filters:false,
      sorter:false,
      type: 'text'
    }  
  ];

  
  
 
  

 
form: FormGroup = this.formBuilder.group({
  brand: [],
  model: [],
  reference: [],
  pagination: this.formBuilder.group({
    page: 1,
    limit: this.pagerValues[0]
  }),
  orderby: this.formBuilder.group({
    type: 1,
    order: "asc"
  })
});

length: any;

  constructor(
    private brandsService: BrandsService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private modalCtrl: ModalController,

  ) { }

  ngOnInit() {
    this.getList(this.form);
    this.getFilters();
  }

  async getList(form?: FormGroup) {
    this.intermediaryService.presentLoading("Cargando Marcas...");
    await this.brandsService.getBrands(form.value).subscribe((resp: any) => {
      this.intermediaryService.dismissLoading()
      this.dataSource = new MatTableDataSource<any>(resp);
     console.log(resp.pagination)
      this.pagination = resp.pagination;
    },
      async err => {
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.dismissLoading()
      })
  }

 

  getFilters() {
    this.brandsService.getFiltersBrands().subscribe((entities) => {
      
      this.filtersData = entities;
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
      }, 0);
    }, (error) => {
      console.log(error);
    })
  }


  async newTransport(row) {
    let modal = (await this.modalCtrl.create({
      component: NewBrandComponent,
      componentProps: {update: false}
    }));

    modal.onDidDismiss().then(() => {
      this.refresh();
    });

    modal.present();
  }

  async editSizes(row) {
    let modal = (await this.modalCtrl.create({
      component: NewBrandComponent,
      componentProps: {
      update: true,
      data:row}
    }));

    modal.onDidDismiss().then(() => {
      this.refresh();
    });

    modal.present();
  }

  log_internals(logInt) {
    if (logInt == 1 || logInt == true) {
      return "SI"
    } else {
      return "NO"
    }
  }

  createTransport() {
    let body = [];
    this.newTransport(body);
  }

  openRow(row) {
    this.newTransport(row);
  }

  refresh() {
    this.getList(this.form);
    this.getFilters();
  }

  edit(row){
    this.editSizes(row);
  }
  delete(select:Array<any>){
    let selectedId=[];
    select.map(element=>{
      selectedId.push(element.id);
    });
    const body ={matchingBrandId:selectedId}
    this.deleteSelected(body);
  }

 async deleteSelected(body){
    this.intermediaryService.presentLoading("Eliminando Registro...");
    await this.brandsService.deleteUpdateMatchingBrand(body).subscribe(result =>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Registros elimindo exitosamente.");
      this.refresh();
    },(error)=>{
      this.intermediaryService.presentToastError("Error al eliminar Registros.");
      this.intermediaryService.dismissLoading();
      console.log(error);
    }); 
  }
  

  emitMain(e) {
    switch (e.event) {
      case TableEmitter.BtnAdd:
        /**Add function*/
        this.createTransport();
        break;
      case TableEmitter.BtnSend:
        /**Send function */
        
        // let selectSend = e.value;
        // console.log(selectSend);
        break;
      case TableEmitter.BtnRefresh:
        /**Refresh funtion*/
         this.refresh();
        break;
      case TableEmitter.Filters:
        let entity = e.value.entityName;
        let filters = e.value.filters;
        this.form.get(entity).patchValue(filters);
        this.getList(this.form);
        break;
      case TableEmitter.OpenRow:
        // let row = e.value;
        // console.log(row);
        // this.openRow(row);
        break;
      case TableEmitter.Pagination:
        let pagination = e.value;
        this.form.value.pagination = pagination;
        this.getList(this.form);
        break;
      case TableEmitter.Sorter:
        let orderby = e.value;
        this.form.value.orderby = orderby;
        this.getList(this.form);
        break;
      case TableEmitter.iconEdit:
        console.log(e.value);
        this.edit(e.value);
        break;
      case TableEmitter.BtnDelete:
        let select = e.value;
        console.log(select);
        this.delete(select);
        break;
    }

  }

}
