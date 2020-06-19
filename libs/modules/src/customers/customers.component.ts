import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {  MatSort, Sort ,MatTableDataSource, MatCheckboxChange } from '@angular/material';
import { PredistributionModel } from '../../../services/src/models/endpoints/Predistribution';
import Predistribution = PredistributionModel.Predistribution;
import { IntermediaryService } from '../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PredistributionsService } from '../../../services/src/lib/endpoint/predistributions/predistributions.service';
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import * as Filesave from 'file-saver';
import { catchError } from 'rxjs/operators';
import { from, Observable } from "rxjs";
import { of } from 'rxjs';
import { CustomersService } from '../../../services/src/lib/endpoint/customers/customers.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {TableEmitter } from './../../../services/src/models/tableEmitterType';
import {ModalController} from '@ionic/angular';
import {EditCustomerComponent} from './edit-customer/edit-customer.component'
import { Router } from '@angular/router';
import * as _ from "lodash";

@Component({
  selector: 'customer',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  columnsData = [
    {
      name: 'name',
      title:'Nombre',
      field: ['firstName'],
      filters:true,
      type:'text'
    },

  ];
  dataSource;
  filtersData;
  entities;
  pagerValues = [10, 20, 80,100,500];
  pagination;

  form: FormGroup = this.formBuilder.group({
    name:[],
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
    private intermediaryService: IntermediaryService,
    private customersService: CustomersService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,

  ) {}

  ngOnInit(): void {
    this.getListCustomers(this.form);
    this.getFilters();
  }

 

  async getListCustomers(form) {
    this.intermediaryService.presentLoading("Cargando clientes..");
    await this.customersService.getIndex(form.value).subscribe((resp: any) => {  
       if (resp.results) {
        this.dataSource = new MatTableDataSource<any>(resp);
        this.pagination = resp.pagination;

       }
      this.intermediaryService.dismissLoading();
    },
      async err => {
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.dismissLoading()
      })
  }

  getFilters() {
    this.customersService.getFiltersCustomer().subscribe((entities) => {
      
      this.filtersData = entities;
    },(error)=>{
      console.log(error);
    })
  }

  refresh(){
    this.getListCustomers(this.form);
    this.getFilters();
  }

  emitMain(e) {
    switch (e.event) {
      case TableEmitter.BtnAdd:
        /**Add function*/
        break;
      case TableEmitter.BtnExcell:
        /** Excell download Function*/
        //this.fileExcell();
        break;
      case TableEmitter.BtnSend:
        /**Send function */
        let selectSend = e.value;
        break;
      case TableEmitter.BtnRefresh:
        /**Refresh funtion*/
        this.getListCustomers(this.form);
        this.getFilters();
        break;
      case TableEmitter.Filters:
        let entity = e.value.entityName;
        let filters = e.value.filters;
        this.form.get(entity).patchValue(filters);
        this.getListCustomers(this.form);
        break;
      case TableEmitter.OpenRow:
        let row = e.value;
        //this.goDetails(row);
        break;
      case TableEmitter.Pagination:
        let pagination = e.value;
        this.form.value.pagination = pagination;
        this.getListCustomers(this.form);
        break;
      case TableEmitter.Sorter:
        let orderby = e.value;
        this.form.value.orderby = orderby;
        this.getListCustomers(this.form);
        break;
      case TableEmitter.iconEdit:
        let customer = e.value;
        console.log("edit", customer);
        this.editCustomer(customer)
        break;
    }

  }

  async editCustomer(customer) {
    event.stopPropagation();
    event.preventDefault();

    let modal = await this.modalCtrl.create({
      component: EditCustomerComponent,
      componentProps: {
        customer: customer,
      }
    });

    modal.onDidDismiss().then((p) => {
      if (p && p.data) {
        this.refresh();
      }
    });

    modal.present();
  }

}

