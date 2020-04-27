import { BehaviorSubject, of, Observable, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit, Query, Input,Output,EventEmitter, SimpleChange } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import * as Filesave from 'file-saver';
import * as _ from 'lodash';
import { parse } from 'querystring';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Platform, ModalController, NavController } from '@ionic/angular';
import { IntermediaryService, OplTransportsService } from '../../../../services/src';
import { MatTabsModule } from '@angular/material/tabs';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { DefectiveRegistryModel } from '../../../../services/src/models/endpoints/DefectiveRegistry';
import { SelectionModel } from '@angular/cdk/collections';
import DefectiveRegistry = DefectiveRegistryModel.DefectiveRegistry;
import { FilterButtonComponent } from '../../components/filter-button/filter-button.component';
import { DamagedModel } from '../../../../services/src/models/endpoints/Damaged';
import { TagsInputOption } from '../../components/tags-input/models/tags-input-option.model';
import { DefectiveRegistryService } from '../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FiltersModel } from '../../../../services/src/models/endpoints/filters';
import { parseDate } from '@ionic/core/dist/types/components/datetime/datetime-util';
import { ExpeditionCollectedService } from '../../../../services/src/lib/endpoint/expedition-collected/expedition-collected.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../services/src/environments/environment';
import { saveAs } from "file-saver";

@Component({
  selector: 'suite-package-collected',
  templateUrl: './package-collected.component.html',
  styleUrls: ['./package-collected.component.scss']
})

export class PackageCollectedComponent {
  constructor(
    private defectiveRegistryService: DefectiveRegistryService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private intermediary: IntermediaryService,
    private expeditionCollectedService: ExpeditionCollectedService,
    private navCtrl: NavController,
    private activateRoute: ActivatedRoute,
    private oplTransportsService: OplTransportsService,
  ) {
  }
  @Input() id: any;
  @Input() sendEvent:boolean;
  @Output()buttonState = new EventEmitter<boolean>();
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterButtonUniqueCode') filterButtonUniqueCode: FilterButtonComponent;
  @ViewChild('filterButtonExpeditions') filterButtonExpeditions: FilterButtonComponent;
  @ViewChild('filterButtonShops') filterButtonShops:FilterButtonComponent;


  /**Filters */
  uniquecodes: Array<TagsInputOption> = [];
  expeditions: Array<TagsInputOption> =[];
  shops: Array<TagsInputOption> = [];

  displayedColumns: string[] = ['select', 'expeditions', 'uniquecodes', 'shops', 'products'];
  dataSource;
  button:boolean = false;
  subscriptionRefresh: Subscription;
  buttonSendEmiter: Subscription;
  selection = new SelectionModel<any>(true, []);
  columns=['uniquecodes','expeditions','shops'];


  toDelete: FormGroup = this.formBuilder.group({
    jails: this.formBuilder.array([])
  });

  isFilteringUniqueCode: number = 0;
  isFilteringExpeditions: number = 0;
  isFilteringShops: number = 0;



  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagerValues = [10, 20, 80];

  form: FormGroup = this.formBuilder.group({
    id: [[]],
    uniquecodes:[[]],
    expeditions:[[]],
    shops:[[]],
    idTransport: new FormControl(''),
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


  ngOnInit() {
    this.initEntity();
    this.initForm();
    this.getFilters(this.id);
    this.form.get('idTransport').patchValue(this.id);
    this.getList(this.form);
    this.initEventsEmmiter();
    
  }
  ngOnChanges(changes: { [property: string]: SimpleChange }){
    let change: SimpleChange = changes['sendEvent'];
    if(this.sendEvent == true){
      console.log("actualizar");
      if(this.stateUpdate() == true){
        this.update();
      }
    } 
  }

  initEventsEmmiter(){
    this.getRefreshStatus();
  }

  public async getRefreshStatus() {
    this.subscriptionRefresh =  await this.expeditionCollectedService.getData().subscribe((id: any) => {
      if(this.id == id){
        this.id = id;
        this.form.get('idTransport').patchValue(this.id);
        this.refresh();
      }
        },(error)=>{
          console.log(error);
        });
  }



  initEntity() {
    this.entities = {
      id: [],
      uniquecodes:[],
      expeditions:[],
      shops:[],
    
    }
  }

  initForm() {
    this.form.patchValue({
      id: [],
      uniquecodes:[],
      expeditions:[],
      shops:[],
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

  getFilters(id) {
    this.expeditionCollectedService.getFiltersPackage(id).subscribe((entities) => {
      this.uniquecodes = this.updateFilterSource(entities.uniquecodes, 'uniquecodes');
      this.expeditions = this.updateFilterSource(entities.expeditions,'expeditions');
      this.shops = this.updateFilterSource(entities.shops,'shops');
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


  private reduceFilters(entities) {
    this.filterButtonUniqueCode.listItems = this.reduceFilterEntities(this.uniquecodes, entities, 'uniquecodes');
    this.filterButtonExpeditions.listItems = this.reduceFilterEntities(this.expeditions, entities, 'expeditions');
    this.filterButtonShops.listItems = this.reduceFilterEntities(this.shops, entities, 'shops');

  }


  private reduceFilterEntities(arrayEntity: any[], entities: any, entityName: string) {
    if (this.lastUsedFilter !== entityName) {
      let filteredEntity = entities[entityName] as unknown as string[];

      arrayEntity.forEach((item) => {
        item.hide = filteredEntity.includes(item.value);
      });

      return arrayEntity;
    }
  }

  async sortData($event: Sort) {
    if($event.active == "uniquecodes"){
      this.form.value.orderby.type = 1;
    }else if($event.active == "expeditions"){
      this.form.value.orderby.type = 2;
    }else if($event.active == "shops"){
      this.form.value.orderby.type = 3;
    }
    this.form.value.orderby.order = $event.direction !== '' ? $event.direction : 'asc';

    this.getList(this.form);
  }

 

  async getList(form) {
    this.intermediaryService.presentLoading("Cargando paquetes recogidos..");
    await this.expeditionCollectedService.getPackages(form.value).subscribe((resp: any) => {   
      this.intermediaryService.dismissLoading();
      if (resp.results) {
        this.dataSource = new MatTableDataSource<any>(resp.results);
        const paginator = resp.pagination;

        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.selectPage;
        this.paginator.lastPage = paginator.lastPage;
      }
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
      case 'uniquecodes':
        let uniquecodeFiltered: string[] = [];
        for (let uniquecodes of filters) {

          if (uniquecodes.checked) uniquecodeFiltered.push(uniquecodes.id);
        }
        if (uniquecodeFiltered.length >= this.uniquecodes.length) {
          this.form.value.uniquecodes = [];
          this.isFilteringUniqueCode = this.uniquecodes.length;
        } else {
          if (uniquecodeFiltered.length > 0) {
            this.form.value.uniquecodes = uniquecodeFiltered;
            this.isFilteringUniqueCode = uniquecodeFiltered.length;
          } else {
            this.form.value.uniquecodes = ["99999"];
            this.isFilteringUniqueCode = this.uniquecodes.length;
          }
        }
        break;
        case 'expeditions':
          let expeditionsFiltered: string[] = [];
          for (let expeditions of filters) {
  
            if (expeditions.checked) expeditionsFiltered.push(expeditions.id);
          }
  
          if (expeditionsFiltered.length >= this.expeditions.length) {
            this.form.value.expeditions = [];
            this.isFilteringExpeditions = this.expeditions.length;
          } else {
            if (expeditionsFiltered.length > 0) {
              this.form.value.expeditions = expeditionsFiltered;
              this.isFilteringExpeditions = expeditionsFiltered.length;
            } else {
              this.form.value.expeditions = ["99999"];
              this.isFilteringExpeditions = this.expeditions.length;
            }
          }
          break;
          case 'shops':
          let shopsFiltered: string[] = [];
          for (let shops of filters) {
  
            if (shops.checked) shopsFiltered.push(shops.id);
          }
  
          if (shopsFiltered.length >= this.shops.length) {
            this.form.value.shops = [];
            this.isFilteringShops = this.shops.length;
          } else {
            if (shopsFiltered.length > 0) {
              this.form.value.shops = shopsFiltered;
              this.isFilteringShops = shopsFiltered.length;
            } else {
              this.form.value.shops = ["99999"];
              this.isFilteringShops = this.shops.length;
            }
          }
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
    this.selection.clear();
    this.getList(this.form);
  }

  stateUpdate() {
    if (this.selection.selected.length > 0) {
      this.buttonState.emit(true);
      return true
    }else{
      this.buttonState.emit(false);
    }
    return false;
  }

  ngOnDestroy(){
    //this.buttonSendEmiter.unsubscribe();
    this.subscriptionRefresh.unsubscribe();
  }
}
