import { BehaviorSubject, of, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit, Query } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import * as Filesave from 'file-saver';
import * as _ from 'lodash';
import { parse } from 'querystring';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Platform, ModalController } from '@ionic/angular';
import { IntermediaryService } from '../../../../services/src';
import { MatTabsModule } from '@angular/material/tabs';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { DefectiveRegistryModel } from '../../../../services/src/models/endpoints/DefectiveRegistry';
import { SelectionModel } from '@angular/cdk/collections';
import DefectiveRegistry = DefectiveRegistryModel.DefectiveRegistry;
import { FilterButtonComponent } from '../../components/filter-button/filter-button.component';
import { DamagedModel } from '../../../../services/src/models/endpoints/Damaged';
import { TagsInputOption } from '../../components/tags-input/models/tags-input-option.model';
import { DefectiveRegistryService } from '../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FiltersModel } from '../../../../services/src/models/endpoints/filters';
import { LogisticOperatorComponent } from '../logistic-operator/logistic-operator.component';
import { parseDate } from '@ionic/core/dist/types/components/datetime/datetime-util';
import { ExpeditionManualService } from '../../../../services/src/lib/endpoint/expedition-manual/expedition-manual.service';


@Component({
  selector: 'suite-incidences-manual',
  templateUrl: './incidences-manual.component.html',
  styleUrls: ['./incidences-manual.component.scss']
})

export class IncidencesManualComponent {
  constructor(
    private defectiveRegistryService: DefectiveRegistryService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private intermediary: IntermediaryService,
    private expeditionManualService: ExpeditionManualService
  ) {
  }


  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['barcode', 'date', 'warehouse', 'transport', 'packages', 'expedition'];
  dataSource;
  selection = new SelectionModel<DefectiveRegistry>(true, []);
  columns = {};

  @ViewChild('filterButtonBarcode') filterButtonBarcode: FilterButtonComponent;
  @ViewChild('filterButtonDate') filterButtonDate: FilterButtonComponent;
  @ViewChild('filterButtonWarehouse') filterButtonWarehouse: FilterButtonComponent;
  @ViewChild('filterButtonTransport') filterButtonTransport: FilterButtonComponent;


  isFilteringBarcode: number = 0;
  isFilteringDate: number = 0;
  isFilteringWarehouse: number = 0;
  isFilteringTransport: number = 0;


  /**Filters */
  barcode: Array<TagsInputOption> = [];
  date: Array<TagsInputOption> = [];
  warehouse: Array<TagsInputOption> = [];
  transport: Array<TagsInputOption> = [];



  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagerValues = [10, 20, 80];

  form: FormGroup = this.formBuilder.group({
    barcode: [],
    date: [],
    transport: [],
    warehouse: [],
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
    // await this.intermediaryService.presentLoading();
    this.initEntity();
    this.initForm();
    this.getFilters(this.form);
    this.getColumns(this.form);
    this.getList(this.form);
    this.listenChanges();

    this.defectiveRegistryService.refreshListRegistry$.subscribe(async (refresh) => {
      if (refresh) {
        await this.intermediaryService.presentLoading();

        this.getList(this.form).then(async () => {
          await this.intermediaryService.dismissLoading();
        }, async () => {
          await this.intermediaryService.dismissLoading();
        });
      }
    });
    // this.intermediaryService.dismissLoading();
  }

  initEntity() {
    this.entities = {
      barcode: [],
      date: [],
      transport: [],
      warehouse: [],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
    }
  }

  initForm() {
    this.form.patchValue({
      barcode: [],
      date: [],
      transport: [],
      warehouse: [],
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

  getFilters(form) {
    this.expeditionManualService.getFilters(form.value).subscribe((entities) => {
      console.log(entities);
      this.barcode = this.updateFilterSource(entities.barcode, 'barcode');
      this.date = this.updateFilterSource(entities.date, 'date');
      this.warehouse = this.updateFilterSource(entities.warehouse, 'warehouse');
      this.transport = this.updateFilterSource(entities.transport, 'transport');

      this.reduceFilters(entities);
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
      }, 0);
    })
  }

  async getColumns(form?: FormGroup) {
    this.expeditionManualService.getIncidence(form.value).subscribe(
      (resp: any) => {
        resp.filters.forEach(element => {
          this.columns[element.name] = element.id;
        });
      },
      async err => {
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.dismissLoading()
      }
    )
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
    this.filterButtonBarcode.listItems = this.reduceFilterEntities(this.barcode, entities, 'barcode');
    this.filterButtonDate.listItems = this.reduceFilterEntities(this.date, entities, 'date');
    this.filterButtonWarehouse.listItems = this.reduceFilterEntities(this.warehouse, entities, 'warehouse');
    this.filterButtonTransport.listItems = this.reduceFilterEntities(this.transport, entities, 'transport');
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

  async getList(form?: FormGroup) {
    await this.intermediaryService.presentLoading();
    this.expeditionManualService.getIncidence(form.value).subscribe((resp: any) => {
      if (resp.results) {
        console.log(resp.results);
        this.dataSource = new MatTableDataSource<any>(resp.results);
        const paginator = resp.pagination;

        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.selectPage;
        this.paginator.lastPage = paginator.lastPage;
        this.intermediaryService.dismissLoading()
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
      case 'barcode':
        let barcodeFiltered: string[] = [];
        for (let barcode of filters) {

          if (barcode.checked) barcodeFiltered.push(barcode.id);
        }

        if (barcodeFiltered.length >= this.barcode.length) {
          this.form.value.barcode = [];
          this.isFilteringBarcode = this.barcode.length;
        } else {
          if (barcodeFiltered.length > 0) {
            this.form.value.barcode = barcodeFiltered;
            this.isFilteringBarcode = barcodeFiltered.length;
          } else {
            this.form.value.operator = ['99999'];
            this.isFilteringBarcode = this.barcode.length;
          }
        }
        break;
      case 'date':
        let userFiltered: string[] = [];
        for (let name of filters) {

          if (name.checked) userFiltered.push(name.id);
        }

        if (userFiltered.length >= this.date.length) {
          this.form.value.date = [];
          this.isFilteringDate = this.date.length;
        } else {
          if (userFiltered.length > 0) {
            this.form.value.user = userFiltered;
            this.isFilteringDate = userFiltered.length;
          } else {
            this.form.value.user = ['99999'];
            this.isFilteringDate = this.date.length;
          }
        }
        break;
      case 'warehouse':
        let warehouseFiltered: string[] = [];
        for (let warehouse of filters) {

          if (warehouse.checked) warehouseFiltered.push(warehouse.id);
        }

        if (warehouseFiltered.length >= this.warehouse.length) {
          this.form.value.warehouse = [];
          this.isFilteringWarehouse = this.warehouse.length;
        } else {
          if (warehouseFiltered.length > 0) {
            this.form.value.warehouse = warehouseFiltered;
            this.isFilteringWarehouse = warehouseFiltered.length;
          } else {
            this.form.value.warehouse = ['99999'];
            this.isFilteringWarehouse = this.warehouse.length;
          }
        }
        break;
      case 'transport':
        let transportFiltered: string[] = [];
        for (let dni of filters) {

          if (dni.checked) transportFiltered.push(dni.id);
        }

        if (transportFiltered.length >= this.transport.length) {
          this.form.value.transport = [];
          this.isFilteringTransport = this.transport.length;
        } else {
          if (transportFiltered.length > 0) {
            this.form.value.transport = transportFiltered;
            this.isFilteringTransport = transportFiltered.length;
          } else {
            this.form.value.transport = ['99999'];
            this.isFilteringTransport = this.transport.length;
          }
        }
        break;
    }

    this.lastUsedFilter = filterType;
    this.getList(this.form);
  }

  async getRecord(record) {
    let modal = this.modalController.create({
      component: LogisticOperatorComponent,
      componentProps: {
        id: record.expedition
      }
    });
    (await modal).onDidDismiss().then(() => {
      this.ngOnInit();
    });
    (await modal).present();
  }
}
