import { BehaviorSubject, of, Observable, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, Input,AfterViewInit, Output, EventEmitter, SimpleChange } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import * as Filesave from 'file-saver';
import * as _ from 'lodash';
import { parse } from 'querystring';
import { NgxFileDropModule } from  'ngx-file-drop' ;
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Platform, ModalController } from '@ionic/angular';
import { IntermediaryService, OplTransportsService } from '../../../services/src';
import {MatTabsModule} from '@angular/material/tabs';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { DefectiveRegistryModel } from '../../../services/src/models/endpoints/DefectiveRegistry';
import { SelectionModel } from '@angular/cdk/collections';
import DefectiveRegistry = DefectiveRegistryModel.DefectiveRegistry;
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { DamagedModel } from '../../../services/src/models/endpoints/Damaged';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { DefectiveRegistryService } from '../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { ExpeditionCollectedService } from '../../../services/src/lib/endpoint/expedition-collected/expedition-collected.service';
import { saveAs } from "file-saver";
import { catchError } from 'rxjs/operators';
import { InternalExpeditionModalComponent } from '../modal-info-expeditions/product-details-al/internal-expedition-modal.component';
import * as moment from 'moment';
import {TableEmitter } from './../../../services/src/models/tableEmitterType';

@Component({
  selector: 'suite-expedition-inside',
  templateUrl: './expedition-inside.component.html',
  styleUrls: ['./expedition-inside.component.scss']
})

export class ExpeditionInsideComponent implements OnInit {
  columnsData = [
    {
      name: 'package',
      title:'Bultos',
      field: ['uniqueCode'],
      filters:true,
      type:'text'
    },
    {
      name: 'origin',
      title:'Tienda Origen',
      field: ['order','origin','name'],
      filters:true,
      type: 'text'
    },
    {
      name: 'destiny',
      title:'Destinos',
      field: ['order','destiny','name'],
      filters:true,
      type:'text'
    },
    {
      name: 'deliveryRequest',
      title:'Pedido',
      field: ['order','deliveryRequestId'],
      filters:true,
      type: 'text'
    },
    {
      name: 'date',
      title:'Fechas',
      field: ['order','createdAt'],
      type:'date', 
      filters:true,
      format:'yyyy/mm/dd'
      
    }

  ];
  filtersData;
  dataSource;
  selectedIndex;
  
  entities;
  pagerValues = [10, 20, 80];
  pagination;
  form: FormGroup = this.formBuilder.group({
    package:[],
    order:[],
    deliveryRequest:[],
    origin:[],
    destiny:[],
    date:[],
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
    private defectiveRegistryService: DefectiveRegistryService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private intermediary: IntermediaryService,
    private expeditionCollectedService: ExpeditionCollectedService,
    private oplTransportsService: OplTransportsService,
    ) {
  }
  ngOnInit() {
    this.initEntity();
    this.initForm();
    this.getList(this.form);  
    this.getFilters();
    
  }
 
  initEntity() {
    this.entities = {
      package:[],
      order:[],
      deliveryRequest:[],
      origin:[],
      destiny:[],
      date:[],
    }
  }

  initForm() {
    this.form.patchValue({
      package:[],
      order:[],
      deliveryRequest:[],
      origin:[],
      destiny:[],
      date:[],
    })
  }

  

  getFilters() {
    this.expeditionCollectedService.getIncidenceInsideFilters().subscribe((entities) => {
      this.filtersData = entities;
    },(error)=>{
      console.log(error);
    })
  }

 
  async getList(form) {
    this.intermediaryService.presentLoading("Cargando bultos..");
    await this.expeditionCollectedService.getPacketsInside(form.value).subscribe((resp: any) => {  
       if (resp.results) {
        /* resp.results.forEach(data => {
            console.log(data);
            this.datesArray.push({
              date:data.order.createdAt,
              dateMoment: moment(data.order.createdAt).format('YYYY/MM/DD').toString()
            });
            // this.datesArrayMoment.push(moment(data.order.createdAt));
         });*/
        //  console.log(this.datesArray);
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





  async update(selection) {
    const data: any = selection.selected.map(function (obj) {
      var rObj = {};
      rObj['warehouse'] = obj.warehouse.id;
      rObj['expedition'] = obj.expedition;
      rObj['transport'] = obj.transport.id;
      rObj['package'] = obj.package.id;
      return rObj;
    });
    await this.intermediaryService.presentLoading();
    const transport = data[0].expedition
    this.expeditionCollectedService.updatePackage(data).subscribe(data => {
      
      this.ngOnInit();
      this.oplTransportsService.downloadPdfTransortOrders(data.order.id).subscribe(
        resp => {
          console.log(resp);
          const blob = new Blob([resp], { type: 'application/pdf' });
          saveAs(blob, 'documento.pdf')
        },
        e => {
          console.log(e.error.text);
        },
        () => this.intermediaryService.dismissLoading()
      )
      this.intermediaryService.presentToastSuccess('Los paquetes seleccionados fueron actualizados con exito');

    }, error => {
      this.intermediaryService.presentToastError('Debe Seleccionar Todos los paquetes de las expediciones');
      this.intermediaryService.dismissLoading();
    },
    () => {
      
    }
    );

  }

  refresh() {
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getList(this.form);
  }


  fileExcell(){
    this.intermediaryService.presentLoading("Descargando Archivo Excel...");
    this.expeditionCollectedService.getFileExcell(this.form.value).pipe(
      catchError(error => of(error)),
      // map(file => file.error.text)
    ).subscribe((data) => {
      this.intermediaryService.dismissLoading();

        const blob = new Blob([data], { type: 'application/octet-stream' });
        Filesave.saveAs(blob, `${Date.now()}.xlsx`);
    },
    async err => {
      await this.intermediaryService.dismissLoading()
    },
    async () => {
      await this.intermediaryService.dismissLoading()
    })

  }

  async goDetails(data){
    return (await this.modalController.create({
      component:InternalExpeditionModalComponent,
      componentProps:{
        'internal-expedition':data.order.id
      }
    })).present();
  }

  formattedDate(date) {
    return moment(date).format("DD/MM/YYYY")
  }

  uniqueDatesArray(listArray: Array<any>) {
    let uniquesArray = [];
    let counting = 0;
    let found = false;
    for (let i = 0; i < listArray.length; i++) {
      for (let y = 0; y < uniquesArray.length; y++) {
        if (listArray[i].name == uniquesArray[y].name) {
          found = true;
        }
      }
      counting++;
      if (counting == 1 && found == false) {
          uniquesArray.push(listArray[i]);
      }
      found = false;
      counting = 0;
    }
    return uniquesArray;
  }

  
  emitMain(e) {
    switch (e.event) {
      case TableEmitter.BtnAdd:
        /**Add function*/
        break;
      case TableEmitter.BtnExcell:
        /** Excell download Function*/
        this.fileExcell();
        break;
      case TableEmitter.BtnSend:
        /**Send function */
        let selectSend = e.value;
        break;
      case TableEmitter.BtnRefresh:
        /**Refresh funtion*/
        this.getList(this.form);
        this.getFilters();
        break;
      case TableEmitter.Filters:
        let entity = e.value.entityName;
        let filters = e.value.filters;
        this.form.get(entity).patchValue(filters);
        this.getList(this.form);
        break;
      case TableEmitter.OpenRow:
        let row = e.value;
        this.goDetails(row);
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
    }

  }

}
