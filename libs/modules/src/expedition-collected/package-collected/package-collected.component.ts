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


  /**Filters */
  uniquecode: Array<TagsInputOption> = [];

  displayedColumns: string[] = ['select', 'expedition', 'uniquecode', 'warehouse', 'products'];
  dataSource;
  button:boolean = false;
  subscriptionRefresh: Subscription;
  buttonSendEmiter: Subscription;
  selection = new SelectionModel<any>(true, []);
  columns = {};
  toDelete: FormGroup = this.formBuilder.group({
    jails: this.formBuilder.array([])
  });

  isFilteringUniqueCode: number = 0;
  /**Filters */


  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagerValues = [10, 20, 80];

  form: FormGroup = this.formBuilder.group({
    id: [],
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
    this.form.get('idTransport').patchValue(this.id);
    this.getList(this.form);
    this.initEventsEmmiter();
  }
  ngOnChanges(changes: { [property: string]: SimpleChange }){
    console.log("......");
    let change: SimpleChange = changes['sendEvent'];
    console.log(changes);
    if(this.sendEvent == true){
      console.log("actualizar");
      if(this.stateUpdate() == true){
        console.log("si se puede actualizar...");
        this.update();
      }
    } 
  }
  initEventsEmmiter(){
    this.getRefreshStatus();
  }

  public async getRefreshStatus() {
    this.subscriptionRefresh =  await this.expeditionCollectedService.getData().subscribe((id: any) => {
      console.log("aqui ")
      console.log(this.id);
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
      uniquecode:[],
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

    this.getList(this.form);
  }

  // async getList(form?: FormGroup) {
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
    console.log(data);
    const transport = data[0].expedition
    this.expeditionCollectedService.updatePackage(data).subscribe(data => {
      console.log(data);
      
      this.selection.clear();
      this.ngOnInit();
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess('Los paquetes seleccionados fueron actualizados con exito');

    }, error => {
      this.selection.clear();
      this.intermediaryService.presentToastError('Debe Seleccionar Todos los paquetes de las expediciones');
      this.intermediaryService.dismissLoading();
    },
    () => {
      this.oplTransportsService.downloadPdfTransortOrders(transport).subscribe(
        resp => {
          console.log(resp);
          const blob = new Blob([resp], { type: 'application/pdf' });
          saveAs(blob, 'documento.pdf')
        },
        e => {
          console.log(e.error.text);
        }
      )
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
