import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { IntermediaryService } from '@suite/services';
import { SelectionModel } from '@angular/cdk/collections';
import { OplTransportExpeditionService } from '../../../services/src/lib/endpoint/opl-transport-expedition/opl-transport-expedition.service';
import {CreateTransportComponent} from './create-transport/create-transport.component';
import {ModalController, AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {TableEmitter } from './../../../services/src/models/tableEmitterType';

@Component({
  selector: 'transports-expeditions',
  templateUrl: './transports-expeditions.component.html',
  styleUrls: ['./transports-expeditions.component.scss'],
})
export class TransportsExpeditionsComponent implements OnInit {

  columnsData = [
    {
      name: 'name',
      title:'Nombre',
      field: ['name'],
      filters:true,
      type:'text'
    },
    {
      name: 'logistic_internal',
      title:'Logistica interna',
      field: ['logistic_internal'],
      filters:true,
      type: 'checkbox'
    } 
  ];

  
  
  displayedColumns: string[] = ['select', 'name','log_internal'];
  dataSource: MatTableDataSource<any>;
  pagerValues = [10, 20, 100];

  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagination;
  filtersData;
  

 
form: FormGroup = this.formBuilder.group({
  name: [],
  logistic_internal: [],
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
    private opTransportService: OplTransportExpeditionService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private modalCtrl: ModalController,

  ) { }

  ngOnInit() {
    this.getList(this.form);
    this.getFilters();
  }

  async getList(form?: FormGroup) {
    this.intermediaryService.presentLoading("Cargando Transportes...");
    await this.opTransportService.getOpTransports(this.form.value).subscribe((resp: any) => {
      console.log("Resultado");
      console.log(resp);
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
    this.opTransportService.getFiltersOpTransport().subscribe((entities) => {
      
      this.filtersData = entities;
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
      }, 0);
    }, (error) => {
      console.log(error);
    })
  }

  initEntity() {
    this.entities = {
      name: [],
      logistic_internal: [],
    }
  }

  initForm() {
    this.form.patchValue({
      name: [],
      logistic_internal: [],
    })
  }



  async newTransport(transport, update) {
    let modal = (await this.modalCtrl.create({
      component: CreateTransportComponent,
      componentProps: {
        transport: transport,
        update: update
      }
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

  async delete(selected) {
    let observable = new Observable(observer => observer.next());
    selected.forEach(trasnport => {
      observable = observable.pipe(switchMap(response => {
        return this.opTransportService.deleteTransport(trasnport.id);
      }))
    });
    this.intermediaryService.presentLoading();
    observable.subscribe(
      () => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess(
          'Transportes borrados con exito'
        );
        this.refresh();
      },
      () => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError('No se puede borrar el transporte, por que esta asignado a una expedición');
      }
    );
  }


  emitMain(e) {
    switch (e.event) {
      case TableEmitter.BtnAdd:
        /**Add function*/
        this.createTransport();
        break;
      case TableEmitter.BtnSend:
        /**Send function */
        let selectSend = e.value;
        console.log(selectSend);
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
        let row = e.value;
        console.log(row);
        this.openRow(row);
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
      case TableEmitter.BtnDelete:
        let select = e.value;
        this.delete(select);
        break;
    }

  }

}
