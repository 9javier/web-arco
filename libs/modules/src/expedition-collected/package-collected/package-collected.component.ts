import { BehaviorSubject, of, Observable, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit, Query, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import * as Filesave from 'file-saver';
import * as _ from 'lodash';
import { parse } from 'querystring';
import { NgxFileDropModule } from  'ngx-file-drop' ;
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Platform, ModalController, NavController } from '@ionic/angular';
import { IntermediaryService } from '../../../../services/src';
import {MatTabsModule} from '@angular/material/tabs';
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
    private activateRoute: ActivatedRoute
    ) {
  }
  @Input() id: any;
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select','expedition' ,'uniquecode', 'warehouse' , 'products' ];
  dataSource;
  selection = new SelectionModel<any>(true, []);
  originalTableStatus: DamagedModel.Status[];
  columns = {};
  toDelete: FormGroup = this.formBuilder.group({
    jails: this.formBuilder.array([])
  });

  @ViewChild('filterButtonUniqueCode') filterButtonUniqueCode: FilterButtonComponent;



  isFilteringUniqueCode: number = 0;



  /**Filters */
  uniquecode: Array<TagsInputOption> = [];
 



  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagerValues = [10, 20, 80];

  form: FormGroup = this.formBuilder.group({
    id:[],
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
    this.form.get('idTransport').setValue(this.id);
    console.log(this.form.value);
    // this.initEntity();
    // this.initForm();
    // this.getFilters(this.id);
    // this.getColumns(this.form);
    // this.listenChanges();
    this.getList(this.form);
    
    //console.log("entre al nginit");
    //   this.defectiveRegistryService.refreshListRegistry$.subscribe(async (refresh) => {
    //     if (refresh) {
    //       await this.intermediaryService.presentLoading();

    //       this.getList(this.form).then(async () => {
    //         await this.intermediaryService.dismissLoading();
    //       }, async () => {
    //         await this.intermediaryService.dismissLoading();
    //       });
    //     }
    //   });
    

  }

  initEntity() {
    this.entities = {
      id:[],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
    }
  }

  initForm() {
    this.form.patchValue({
      id: [],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
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

    // this.intermediaryService.presentLoading('Cargando Filtros...').then(() => {
    //   this.getList(this.form);
    // });
  }

 

  getFilters(id) {
    this.expeditionCollectedService.getFiltersPackage(id).subscribe((entities) => {
      console.log(entities);
      this.uniquecode = this.updateFilterSource(entities.uniquecode, 'id');



      this.reduceFilters(entities);
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
      }, 0);
    })
  }

  // async getColumns(form?: FormGroup) {
  //   this.expeditionManualService.getIncidence(form.value).subscribe(
  //     (resp: any) => {
  //       resp.filters.forEach(element => {
  //         this.columns[element.name] = element.id;
  //       });
  //     },
  //     async err => {
  //       await this.intermediaryService.dismissLoading()
  //     },
  //     async () => {
  //       await this.intermediaryService.dismissLoading()
  //     }
  //   )
  // }

  private updateFilterSource(dataEntity, entityName: string) {
    let resultEntity;

    this.pauseListenFormChange = true;
    let dataValue = this.form.get(entityName).value;

    resultEntity = dataEntity.map(entity => {
      entity.id = <number>(<unknown>entity.id);
      entity.name = entity.name;
      entity.value = entity.name;
      entity.checked = true;
      entity.hide = false;
      return entity;
    });

    if (dataValue && dataValue.length) {
      this.form.get(entityName).patchValue(dataValue, { emitEvent: false });
    }

    setTimeout(() => { this.pauseListenFormChange = false; }, 0);

    return resultEntity;
  }

  private reduceFilters(entities) {
    // this.filterButtonUniqueCode.listItems = this.reduceFilterEntities(this.uniquecode, entities, 'id');
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

  async sortData(event: Sort) {
    this.form.value.orderby.type = this.columns[event.active];
    this.form.value.orderby.order = event.direction !== '' ? event.direction : 'asc';

    // this.intermediaryService.presentLoading('Cargando Filtros...').then(() => {
    //   this.getList(this.form);
    // });
    this.getList(this.form);
  }

  // async getList(form?: FormGroup) {
  async getList(form) {
    this.intermediaryService.presentLoading("Cargando paquetes recogidos..");
   await this.expeditionCollectedService.getPackages(form.value).subscribe((resp: any) => {
      console.log(resp)
      this.intermediaryService.dismissLoading();
      if (resp.results) {
        console.log(resp.results);
        this.dataSource = new MatTableDataSource<any>(resp.results);
        this.originalTableStatus = JSON.parse(JSON.stringify(resp.statuses));
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
      case 'uniquecode':
        let uniquecodeFiltered: string[] = [];
        for (let uniquecode of filters) {

          if (uniquecode.checked) uniquecodeFiltered.push(uniquecode.id);
        }

        if (uniquecodeFiltered.length >= this.uniquecode.length) {
          this.form.value.id = [];
          this.isFilteringUniqueCode = this.uniquecode.length;
        } else {
          if (uniquecodeFiltered.length > 0) {
            this.form.value.id = uniquecodeFiltered;
            this.isFilteringUniqueCode = uniquecodeFiltered.length;
          } else {
            this.form.value.id = ['99999'];
            this.isFilteringUniqueCode = this.uniquecode.length;
          }
        }
        break;
    }

    this.lastUsedFilter = filterType;
    this.getList(this.form);
  }
  
  getStatusName(defectType: number) {
    const status = this.originalTableStatus.find((x) => x.id === defectType);
    return status.name;
  }

  // async getRecord(record){
  //   console.log(record.expedition);
  //   let modal = this.modalController.create({
  //     component:LogisticOperatorComponent,
  //     componentProps: {
  //       id:record.expedition
  //     }  
  //   });
  //   (await modal).onDidDismiss().then(()=>{
  //     this.ngOnInit();
  //   });
  //   (await modal).present();
  // }

  async update(){
    const data = this.selection.selected.map(function(obj){ 
      var rObj = {};
      rObj['warehouse'] = obj.warehouse.id;
      rObj['expedition'] = obj.expedition;
      rObj['transport'] = obj.transport.id;
      rObj['package'] = obj.package.id;
      return rObj;
   });
    await this.intermediaryService.presentLoading();
    this.expeditionCollectedService.updatePackage(data).subscribe(data=>{
         this.ngOnInit();
         this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess('Los paquetes seleccionados fueron actualizados con exito');

    });
  }

  refresh(){
    this.selection.clear();
    this.getList(this.form);
  }

  stateUpdate(){
    if(this.selection.selected.length > 0 ){
      return true
    }
    return false;
  }
}
