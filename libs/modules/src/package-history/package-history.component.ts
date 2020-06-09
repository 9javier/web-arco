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
import { PackageHistoryService } from '../../../services/src/lib/endpoint/package-history/package-history.service';
// import {CreateTransportComponent} from './create-transport/create-transport.component';
import {ModalController, AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {TableEmitter } from './../../../services/src/models/tableEmitterType';
import {HistoryDetailsComponent}  from './modals/history-details.component';
import { InternOrderPackageStatus } from './enums/status.enum';
@Component({
  selector: 'package-history',
  templateUrl: './package-history.component.html',
  styleUrls: ['./package-history.component.scss'],
})
export class PackageHistoryComponent implements OnInit {

  columnsData = [
    {
      name: 'package',
      title:'Bulto',
      field: ['order', 'package', 'uniqueCode'],
      filters:true,
      type:'text'
    },
    {
      name: 'delivery',
      title:'Pedido',
      field: ['order', 'deliveryRequestExternalId'],
      filters:true,
      type:'text'
    },
    {
      name: 'origin',
      title:'Origen',
      field: ['order', 'originShop', 'nameReference'],
      filters:true,
      type:'text'
    },
    {
      name: 'destiny',
      title:'Destino',
      field: ['order', 'destinyShop', 'nameReference'],
      filters:true,
      type:'text'
    },
    {
      name: 'cant',
      title:'Cantidad',
      field: ['cant'],
      filters:false,
      type:'text'
    },
    {
      name: 'status',
      title:'Estado',
      field: ['order', 'package', 'status'],
      filters:true,
      type:'text'
    },
    {
      name: 'date',
      title:'Fecha',
      field: ['order', 'package', 'updatedAt'],
      filters:true,
      type:'date',
      format:'dd/MM/yyyy'
    },
  ];

  
  
  displayedColumns: string[] = ['package', 'delivery', 'origin', 'destiny', 'cant', 'status' ,'date'];
  dataSource: MatTableDataSource<any>;
  pagerValues = [10, 20, 100];

  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagination;
  filtersData;
  

 
form: FormGroup = this.formBuilder.group({
  package:[],
  order:[],
  date:[],
  delivery:[],
  origin:[],
  destiny:[],
  status:[],
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
    private packageHistoryService: PackageHistoryService,
  ) { }

  ngOnInit() {
    this.getList(this.form);
    this.getFilters();
  }

  async getList(form?: FormGroup) {
    this.intermediaryService.presentLoading("Cargando Bultos...");
    await this.packageHistoryService.getOpPackageHistory(form.value).subscribe((resp: any) => {
      // console.log("Resultado",resp);
      resp.results.map(data => {
        data.order.destinyShop.nameReference = data.order.destinyShop.reference + '-' + data.order.destinyShop.name;
        data.order.originShop.nameReference = data.order.originShop.reference + '-' + data.order.originShop.name;

        data.order.package.status = this.getStatus(data.order.package.status);
      });



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
    this.packageHistoryService.getFilters().subscribe((entities) => {
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

  refreshForm(){
    this.form = this.formBuilder.group({
      package:[],
      order:[],
      date:[],
      delivery:[],
      origin:[],
      destiny:[],
      status:[],
      pagination: this.formBuilder.group({
        page: 1,
        limit: this.pagerValues[0]
      }),
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
    });
  }



  async newTransport(data, update) {
    let modal = (await this.modalCtrl.create({
      component: HistoryDetailsComponent,
      componentProps: {
        order: data.order.id,
        package:data.order.package.id,
        delivery:data.order.deliveryRequestExternalId
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
    this.refreshForm()
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

  getStatus(status){
    switch (status) {
      case InternOrderPackageStatus.PENDING_COLLECTED:
        return 'Etiqueta generada';
        break;
      case InternOrderPackageStatus.COLLECTED:
        return 'Recogido';
        break;
      case InternOrderPackageStatus.SORTER_IN:
        return 'Entrada Sorter';
        break;
      case InternOrderPackageStatus.SORTER_OUT:
        return 'Salida Sorter';
        break;
      case InternOrderPackageStatus.JAIL_IN:
        return 'Ubicado embalaje';
        break;
      case InternOrderPackageStatus.SORTER_RACK_IN :
        return 'Estantería anexa Sorter';
        break;
      case InternOrderPackageStatus.RECEIVED:
        return 'Recepcionado';
      case InternOrderPackageStatus.WAREHOUSE_OUTPUT:
        return 'Salida Almacén';
        break;
    
      default:
        break;
    }

  }

}
