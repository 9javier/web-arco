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

@Component({
  selector: 'suite-expedition-inside',
  templateUrl: './expedition-inside.component.html',
  styleUrls: ['./expedition-inside.component.scss']
})

export class ExpeditionInsideComponent implements OnInit {
  fake = [
    {
      bultos:"12321321",
      origen:"dsadsa",
      destino:"Puerto Vallarta",
      pedido:"12321321",
      orden:"dsadsadsa",
      fecha:"05/05/2020"
    },
    {
      bultos:"12321321",
      origen:"dsadsa",
      destino:"Puerto Vallarta",
      pedido:"12321321",
      orden:"dsadsadsa",
      fecha:"05/05/2020"
    },
    {
      bultos:"12321321",
      origen:"dsadsa",
      destino:"Puerto Vallarta",
      pedido:"12321321",
      orden:"dsadsadsa",
      fecha:"05/05/2020"
    },
    {
      bultos:"12321321",
      origen:"dsadsa",
      destino:"Puerto Vallarta",
      pedido:"12321321",
      orden:"dsadsadsa",
      fecha:"05/05/2020"
    },
    {
      bultos:"12321321",
      origen:"dsadsa",
      destino:"Puerto Vallarta",
      pedido:"12321321",
      orden:"dsadsadsa",
      fecha:"05/05/2020"
    },
    {
      bultos:"12321321",
      origen:"dsadsa",
      destino:"Puerto Vallarta",
      pedido:"12321321",
      orden:"dsadsadsa",
      fecha:"05/05/2020"
    },
    {
      bultos:"12321321",
      origen:"dsadsa",
      destino:"Puerto Vallarta",
      pedido:"12321321",
      orden:"dsadsadsa",
      fecha:"05/05/2020"
    },
    {
      bultos:"12321321",
      origen:"dsadsa",
      destino:"Puerto Vallarta",
      pedido:"12321321",
      orden:"dsadsadsa",
      fecha:"05/05/2020"
    },
    {
      bultos:"12321321",
      origen:"dsadsa",
      destino:"Puerto Vallarta",
      pedido:"12321321",
      orden:"dsadsadsa",
      fecha:"05/05/2020"
    },
  ];
  selectedIndex;
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterButtonPackage') filterButtonPackage: FilterButtonComponent;
  @ViewChild('filterButtonOrigin') filterButtonOrigin: FilterButtonComponent;
  @ViewChild('filterButtonDestiny') filterButtonDestiny: FilterButtonComponent;
  @ViewChild('filterButtonDeliveryRequest') filterButtonDeliveryRequest: FilterButtonComponent;
  @ViewChild('filterButtonOrder') filterButtonOrder: FilterButtonComponent;
  @ViewChild('filterButtonDate') filterButtonDate: FilterButtonComponent;
  // @ViewChild('filterButtonExpeditions') filterButtonExpeditions: FilterButtonComponent;
  // @ViewChild('filterButtonShops') filterButtonShops:FilterButtonComponent;

  /**Filters */
  package: Array<TagsInputOption> = [];
  order: Array<TagsInputOption> = [];
  deliveryRequest: Array<TagsInputOption> = [];
  origin: Array<TagsInputOption> = [];
  destiny: Array<TagsInputOption> = [];
  date: Array<TagsInputOption> = [];

  displayedColumns: string[] = ['package', 'origin', 'destiny', 'delivery', 'date'];
  dataSource;
  button:boolean = false;
  subscriptionRefresh: Subscription;
  buttonSendEmiter: Subscription;
  selection = new SelectionModel<any>(true, []);


  toDelete: FormGroup = this.formBuilder.group({
    jails: this.formBuilder.array([])
  });

  isFilteringUniqueCode: number = 0;
  isFilteringExpeditions: number = 0;
  isFilteringShops: number = 0;
  datesArray = [
    {
      date:'',
      dateMoment:''
    }
  ];


  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagerValues = [10, 20, 80];

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
    this.getFilters();
    this.getList(this.form);
    this.listenChanges();
  
    
  }
  // ngOnChanges(changes: { [property: string]: SimpleChange }){
  //   let change: SimpleChange = changes['sendEvent'];
  //     if(this.stateUpdate() == true){
  //       this.update();
  //   } 
  // }

  // initEventsEmmiter(){
  //   this.getRefreshStatus();
  // }

  // public async getRefreshStatus() {
  //   this.subscriptionRefresh =  await this.expeditionCollectedService.getData().subscribe((id: any) => {
  //     if(this.id == id){
  //       this.id = id;
  //       this.form.get('idTransport').patchValue(this.id);
  //       this.refresh();
  //       this.getFilters(this.id);
  //     }
  //       },(error)=>{
  //         console.log(error);
  //       });
  // }



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

  listenChanges() {
    let previousPageSize = this.form.value.pagination.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      /**true if only change the number of results */
      let flag = previousPageSize === page.pageSize;
      previousPageSize = page.pageSize;
      this.form.value.pagination = {
        limit: page.pageSize,
        page: flag ? page.pageIndex : 1
      };
      this.getList(this.form)
    });

  }

  getFilters() {
    this.expeditionCollectedService.getIncidenceInsideFilters().subscribe((entities) => {
      console.log('Filtros',entities);
      this.package = this.updateFilterSource(entities.package, 'package');
      this.origin = this.updateFilterSource(entities.origin,'origin');
      this.destiny = this.updateFilterSource(entities.destiny,'destiny');
      this.order = this.updateFilterSource(entities.order,'order');
      this.deliveryRequest = this.updateFilterSource(entities.deliveryRequest,'deliveryRequest');
      // this.date = this.uniqueDatesArray(entities.date);
      this.date = this.updateFilterDate(this.uniqueDatesArray(entities.date),'date');
      console.log(this.date);
      this.reduceFilters(entities);
      
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
      }, 0);
    },(error)=>{
      console.log(error);
    })
  }

  private updateFilterSource(dataEntity: FiltersModel.Default[], entityName: string) {
    let resultEntity;
    
    this.pauseListenFormChange = true;
    let dataValue = this.form.get(entityName).value;

    resultEntity = dataEntity ? dataEntity.map(entity => {
      entity.id = <number>(<unknown>entity.id);
      entity.name = entity.name;
      entity.value = entity.name;
      entity.checked = true;
      entity.hide = false;
      return entity;
    }) : [];
   
    if (dataValue && dataValue.length) {
      this.form.get(entityName).patchValue(dataValue, { emitEvent: false });
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);

    return resultEntity;
  }

  private updateFilterDate(dataEntity: FiltersModel.Default[], entityName: string) {
    let resultEntity;
    
    this.pauseListenFormChange = true;
    let dataValue = this.form.get(entityName).value;

    resultEntity = dataEntity ? dataEntity.map(entity => {
      entity.id = <number>(<unknown>entity.id);
      entity.name = entity.id+"";
      entity.value = entity.id+"";
      entity.checked = true;
      entity.hide = false;
      return entity;
    }) : [];

    if (dataValue && dataValue.length) {
      this.form.get(entityName).patchValue(dataValue, { emitEvent: false });
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
    return resultEntity;
  }

  private reduceFilters(entities) {
    this.filterButtonPackage.listItems = this.reduceFilterEntities(this.package, entities, 'package');
    this.filterButtonOrigin.listItems = this.reduceFilterEntities(this.origin, entities, 'origin');
    this.filterButtonDestiny.listItems = this.reduceFilterEntities(this.destiny, entities, 'destiny');
    this.filterButtonDeliveryRequest.listItems = this.reduceFilterEntities(this.deliveryRequest, entities, 'deliveryRequest');
    this.filterButtonOrder.listItems = this.reduceFilterEntities(this.order, entities, 'order');
    this.filterButtonDate.listItems = this.reduceFilterEntities(this.date, entities, 'date');
  }


  private reduceFilterEntities(arrayEntity: any[], entities: any, entityName: string) {
    if(this.lastUsedFilter !== entityName){

      let filteredEntity = entities[entityName] as unknown as string[];

      arrayEntity.forEach((item) => {
        item.hide = filteredEntity.includes(item.value);
      });

      return arrayEntity;
    }
  }

  async sortData($event: Sort) {
    console.log($event.active);
    if($event.active == "package"){
      this.form.value.orderby.type = 1;
    }
    if($event.active == "order"){
      this.form.value.orderby.type = 2;
    }
    if($event.active == "delivery"){
      this.form.value.orderby.type = 3;
    }
    if($event.active == "origin"){
      this.form.value.orderby.type = 4;
    }
    if($event.active == "destiny"){
      this.form.value.orderby.type = 5;
    }
    if($event.active == "date"){
      this.form.value.orderby.type = 6;
    }
    this.form.value.orderby.order = $event.direction !== '' ? $event.direction : 'asc';
    this.getList(this.form);
  }

 

  async getList(form) {
    this.intermediaryService.presentLoading("Cargando bultos..");
    await this.expeditionCollectedService.getPacketsInside(form.value).subscribe((resp: any) => {  
       console.log(resp.results); 
       if (resp.results) {
         resp.results.forEach(data => {
            console.log(data);
            this.datesArray.push({
              date:data.order.createdAt,
              dateMoment: moment(data.order.createdAt).format('YYYY/MM/DD').toString()
            });
            // this.datesArrayMoment.push(moment(data.order.createdAt));
         });
        //  console.log(this.datesArray);
        this.dataSource = new MatTableDataSource<any>(resp.results);
         const paginator = resp.pagination;

         this.paginator.length = paginator.totalResults;
         this.paginator.pageIndex = paginator.selectPage;
         this.paginator.lastPage = paginator.lastPage;
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilters(filtersResult, filterType) {
    const filters = filtersResult.filters;
    switch (filterType) {
     case 'packages':
       let packagesFiltered: string[] = [];
       for (let uniquecodes of filters) {

         if (uniquecodes.checked) packagesFiltered.push(uniquecodes.id);
       }
       if (packagesFiltered.length >= this.package.length) {
         this.form.value.package = [];
         this.isFilteringUniqueCode = this.package.length;
       } else {
         if (packagesFiltered.length > 0) {
           this.form.value.package = packagesFiltered;
           this.isFilteringUniqueCode = packagesFiltered.length;
         } else {
           this.form.value.package = [];
           this.isFilteringUniqueCode = this.package.length;
         }
       }
       break;
     case 'origin':
       let originFiltered: string[] = [];
       for (let uniquecodes of filters) {

         if (uniquecodes.checked) originFiltered.push(uniquecodes.id);
       }
       if (originFiltered.length >= this.origin.length) {
         this.form.value.origin = [];
         this.isFilteringUniqueCode = this.origin.length;
       } else {
         if (originFiltered.length > 0) {
           this.form.value.origin = originFiltered;
           this.isFilteringUniqueCode = originFiltered.length;
         } else {
           this.form.value.origin = [];
           this.isFilteringUniqueCode = this.origin.length;
         }
       }
       break;
     case 'destiny':
       let destinyFiltered: string[] = [];
       for (let uniquecodes of filters) {

         if (uniquecodes.checked) destinyFiltered.push(uniquecodes.id);
       }
       if (destinyFiltered.length >= this.destiny.length) {
         this.form.value.destiny = [];
         this.isFilteringUniqueCode = this.destiny.length;
       } else {
         if (destinyFiltered.length > 0) {
           this.form.value.destiny = destinyFiltered;
           this.isFilteringUniqueCode = destinyFiltered.length;
         } else {
           this.form.value.destiny = [];
           this.isFilteringUniqueCode = this.destiny.length;
         }
       }
       break;
     case 'deliveryRequest':
       let deliveryRequestFiltered: string[] = [];
       for (let uniquecodes of filters) {

         if (uniquecodes.checked) deliveryRequestFiltered.push(uniquecodes.id);
       }
       if (deliveryRequestFiltered.length >= this.deliveryRequest.length) {
         this.form.value.deliveryRequest = [];
         this.isFilteringUniqueCode = this.deliveryRequest.length;
       } else {
         if (deliveryRequestFiltered.length > 0) {
           this.form.value.deliveryRequest = deliveryRequestFiltered;
           this.isFilteringUniqueCode = deliveryRequestFiltered.length;
         } else {
           this.form.value.deliveryRequest = [];
           this.isFilteringUniqueCode = this.deliveryRequest.length;
         }
       }
       break;
     case 'order':
       let ordersFiltered: string[] = [];
       for (let uniquecodes of filters) {

         if (uniquecodes.checked) ordersFiltered.push(uniquecodes.id);
       }
       if (ordersFiltered.length >= this.order.length) {
         this.form.value.order = [];
         this.isFilteringUniqueCode = this.order.length;
       } else {
         if (ordersFiltered.length > 0) {
           this.form.value.order = ordersFiltered;
           this.isFilteringUniqueCode = ordersFiltered.length;
         } else {
           this.form.value.order = [];
           this.isFilteringUniqueCode = this.order.length;
         }
       }
       break;
     case 'date':
       let datesFiltered: string[] = [];
       let array = [];
       for (let uniquecodes of filters) {
         let data = moment(uniquecodes.id).format('YYYY-MM-DD');
         if (uniquecodes.checked) datesFiltered.push(data);
       }
       if (datesFiltered.length >= this.date.length) {
         this.form.value.date = [];
         this.isFilteringUniqueCode = this.date.length;
       } else {

         if (datesFiltered.length > 0) {
           this.form.value.date = datesFiltered;
           this.isFilteringUniqueCode = datesFiltered.length;
         } else {
           this.form.value.date = [];
           this.isFilteringUniqueCode = this.date.length;
         }
       }
       break;
    }
    this.lastUsedFilter = filterType;
    this.getList(this.form);
  }



  async update() {
    const data: any = this.selection.selected.map(function (obj) {
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
      
      this.selection.clear();
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
      this.selection.clear();
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
    this.listenChanges();
    // this.getList(this.form);
  }

  // stateUpdate() {
  //   if (this.selection.selected.length > 0) {
  //     this.buttonState.emit(true);
  //     return true
  //   }else{
  //     this.buttonState.emit(false);
  //   }
  //   return false;
  // }

  // ngOnDestroy(){
  //   this.subscriptionRefresh.unsubscribe();
  // }

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

}
