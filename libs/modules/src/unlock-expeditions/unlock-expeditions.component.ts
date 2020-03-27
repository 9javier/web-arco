import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { IntermediaryService } from '@suite/services';
import { AlertController } from '@ionic/angular';
import { SelectionModel } from '@angular/cdk/collections';
import { OplExpeditionsService } from '../../../services/src/lib/endpoint/opl-expeditions/opl-expeditions.service';

@Component({
  selector: 'suite-unlock-expeditions',
  templateUrl: './unlock-expeditions.component.html',
  styleUrls: ['./unlock-expeditions.component.scss'],
})
export class UnlockExpeditionsComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['expedition', 'barcode', 'date', 'warehouse', 'locked'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  originalTableStatus: any[];
  columns = {};

  @ViewChild('filterButtonExpedition') filterButtonExpedition: FilterButtonComponent;
  @ViewChild('filterButtonBarcode') filterButtonBarcode: FilterButtonComponent;
  @ViewChild('filterButtonDate') filterButtonDate: FilterButtonComponent;
  @ViewChild('filterButtonWarehouse') filterButtonWarehouse: FilterButtonComponent;

  isFilteringExpedition: number = 0;
  isFilteringBarcode: number = 0;
  isFilteringDate: number = 0;
  isFilteringWarehouse: number = 0;

  expedition: Array<TagsInputOption> = [];
  barcode: Array<TagsInputOption> = [];
  date: Array<TagsInputOption> = [];
  warehouse: Array<TagsInputOption> = [];
  locked: Array<TagsInputOption> = [];

  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagerValues = [10, 20, 80];

  form: FormGroup = this.formBuilder.group({
    expedition: [],
    barcode: [],
    date: [],
    warehouse: [],
    locked: [],
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
    private oplExpeditionsService: OplExpeditionsService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getList(this.form);
    this.listenChanges();
  }

  initEntity() {
    this.entities = {
      expedition: [],
      barcode: [],
      date: [],
      warehouse: [],
      locked: [],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
    }
  }

  initForm() {
    this.form.patchValue({
      expedition: [],
      barcode: [],
      date: [],
      warehouse: [],
      locked: [],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
    })
  }

  listenChanges() {
    let previousPageSize = this.form.value.pagination.limit;
    this.paginator.page.subscribe(page => {
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
    this.oplExpeditionsService.getFiltersEntities().subscribe((entities) => {
      this.expedition = this.updateFilterSource(entities.expedition, 'expedition');
      this.barcode = this.updateFilterSource(entities.barcode, 'barcode');
      this.date = this.updateFilterSource(entities.date, 'date');
      this.warehouse = this.updateFilterSource(entities.warehouse, 'warehouse');
      this.locked = this.updateFilterSource(entities.locked, 'locked');

      this.reduceFilters(entities);
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
      }, 0);
    })
  }

  private updateFilterSource(dataEntity: FiltersModel.Default[], entityName: string) {
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
    this.filterButtonExpedition.listItems = this.reduceFilterEntities(this.expedition, entities, 'expedition');
    this.filterButtonBarcode.listItems = this.reduceFilterEntities(this.barcode, entities, 'barcode');
    this.filterButtonDate.listItems = this.reduceFilterEntities(this.date, entities, 'date');
    this.filterButtonWarehouse.listItems = this.reduceFilterEntities(this.warehouse, entities, 'warehouse');
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

    this.intermediaryService.presentLoading('Cargando Filtros...').then(() => {
      this.getList(this.form);
    });
  }

  async getList(form?: FormGroup) {
    this.oplExpeditionsService.getListOplExpedition(form.value).subscribe((resp: any) => {
        if (resp.results) {
          this.dataSource = new MatTableDataSource<any>(resp.results);
          this.originalTableStatus = JSON.parse(JSON.stringify(resp.statuses));
          const paginator = resp.pagination;

          this.paginator.length = paginator.totalResults;
          this.paginator.pageIndex = paginator.selectPage;
          this.paginator.lastPage = paginator.lastPage;
        }

        if (resp.filters) {
          resp.filters.forEach(element => {
            this.columns[element.name] = element.id;
          });
        }
      },
      async err => {
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.dismissLoading()
      })
  }

  applyFilters(filtersResult, filterType) {
    const filters = filtersResult.filters;
    switch (filterType) {
      case 'expedition':
        let expeditionFiltered: string[] = [];
        for (let expedition of filters) {

          if (expedition.checked) expeditionFiltered.push(expedition.id);
        }

        if (expeditionFiltered.length >= this.expedition.length) {
          this.form.value.expedition = [];
          this.isFilteringExpedition = this.expedition.length;
        } else {
          if (expeditionFiltered.length > 0) {
            this.form.value.expedition = expeditionFiltered;
            this.isFilteringExpedition = expeditionFiltered.length;
          } else {
            this.form.value.expedition = ['99999'];
            this.isFilteringExpedition = this.expedition.length;
          }
        }
        break;
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
            this.form.value.barcode = ['99999'];
            this.isFilteringBarcode = this.barcode.length;
          }
        }
        break;
      case 'date':
        let dateFiltered: string[] = [];
        for (let date of filters) {

          if (date.checked) dateFiltered.push(date.id);
        }

        if (dateFiltered.length >= this.date.length) {
          this.form.value.date = [];
          this.isFilteringDate = this.date.length;
        } else {
          if (dateFiltered.length > 0) {
            this.form.value.date = dateFiltered;
            this.isFilteringDate = dateFiltered.length;
          } else {
            this.form.value.date = ['99999'];
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
    }

    this.lastUsedFilter = filterType;
    this.getList(this.form);
  }

  async presentUnlockAlert(event: any, element) {
    const alert = await this.alertController.create({
      header: "¡Alerta!",
      message: "¿Está seguro que desea desloquear?",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.getList(this.form);
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.unlockExpedition(event, element);
          }
        }
      ]
    });

    await alert.present();
  }

  getStatusName(defectType: number) {
    return defectType === 2;
  }

  async unlockExpedition(event: any, element) {
    await this.intermediaryService.presentLoading();
    this.oplExpeditionsService.unlockExpedition({ expeditionId: element.expedition }).subscribe(async (resp: any) => {
        this.getList(this.form);
      },
      async err => {
        await this.intermediaryService.presentToastError("Error al desbloquear la expedición o existe otra en proceso");
        this.getList(this.form);
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.presentToastSuccess("¡Expedición desbloqueada con exito!");
        await this.intermediaryService.dismissLoading()
      })
  }

}
