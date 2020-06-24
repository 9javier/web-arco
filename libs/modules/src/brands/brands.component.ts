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
import {CreateTransportComponent} from './create-transport/create-transport.component';

@Component({
  selector: 'brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit {

  columnsData = [
    {
      name: 'brand',
      title:'Marca',
      field: ['brand'],
      filters:false,
      sorter:false,
      type:'text'
    },
    // {
    //   name: 'subbrand',
    //   title:'Sub Marca',
    //   field: ['subbrand'],
    //   filters:false,
    //   sorter:false,
    //   type: 'text'
    // }, 
    // {
    //   name: 'group',
    //   title:'Grupo',
    //   field: ['group'],
    //   filters:false,
    //   sorter:false,
    //   type: 'text'
    // } 
  ];

  
  
  dataSource: MatTableDataSource<any>;
  pagerValues = [10, 20, 100];

  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagination;
  filtersData;
  

 
form: FormGroup = this.formBuilder.group({
  brand: [],
  subbrand: [],
  group: [],
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
    await this.brandsService.getBrands().subscribe((resp: any) => {
      console.log("Resultado");
      console.log(resp);
      this.intermediaryService.dismissLoading()
      this.dataSource = new MatTableDataSource<any>(resp);
      console.log(resp.data.pagination)
      this.pagination = resp.data.pagination;
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


  async newTransport(transport, update) {
    let modal = (await this.modalCtrl.create({
      component: NewBrandComponent,
      
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
    this.newTransport(body, false);
  }

  openRow(row) {
    this.newTransport(row, true);
  }

  refresh() {
    this.getList(this.form);
    this.getFilters();
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
        // this.refresh();
        break;
      case TableEmitter.Filters:
        // let entity = e.value.entityName;
        // let filters = e.value.filters;
        // this.form.get(entity).patchValue(filters);
        // this.getList(this.form);
        break;
      case TableEmitter.OpenRow:
        // let row = e.value;
        // console.log(row);
        // this.openRow(row);
        break;
      case TableEmitter.Pagination:
        // let pagination = e.value;
        // this.form.value.pagination = pagination;
        // this.getList(this.form);
        break;
      case TableEmitter.Sorter:
        // let orderby = e.value;
        // this.form.value.orderby = orderby;
        // this.getList(this.form);
        break;
      case TableEmitter.BtnDelete:
        // let select = e.value;
        // this.delete(select);
        break;
    }

  }

}
