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

@Component({
  selector: 'transports-expeditions',
  templateUrl: './transports-expeditions.component.html',
  styleUrls: ['./transports-expeditions.component.scss'],
})
export class TransportsExpeditionsComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select', 'name','log_internal'];
  dataSource: MatTableDataSource<any>;
  pagerValues = [10, 20, 80];
  selection = new SelectionModel<any>(true, []);
  originalTableStatus: any[];
  columns = {};

  @ViewChild('filterButtonName') filterButtonName: FilterButtonComponent;
  @ViewChild('filterButtonLogistic_internal') filterButtonLogistic_internal: FilterButtonComponent;

  isFilteringName: number = 0;
  isFilteringLogistic_internal: number = 0;

  name: Array<TagsInputOption> = [];
  logistic_internal: Array<TagsInputOption> = [];

  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
 
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
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.listenChanges();
  }

  async getList(form?: FormGroup) {
    this.intermediaryService.presentLoading("Cargando Transportes...");
    await this.opTransportService.getOpTransports(this.form.value).subscribe((resp: any) => {

      this.intermediaryService.dismissLoading()
      this.dataSource = new MatTableDataSource<any>(resp.results);
      const paginator = resp.pagination;

      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.selectPage;
      this.paginator.lastPage = paginator.lastPage;


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

  private reduceFilters(entities) {
    this.filterButtonName.listItems = this.reduceFilterEntities(this.name, entities, 'name');
  }

  getFilters() {
    this.opTransportService.getFiltersOpTransport().subscribe((entities) => {
      this.name = this.updateFilterSource(entities.name, 'name');
      this.reduceFilters(entities);

      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
      }, 0);
    }, (error) => {
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

  private reduceFilterEntities(arrayEntity: any[], entities: any, entityName: string) {
    if (this.lastUsedFilter !== entityName) {
      let filteredEntity = entities[entityName] as unknown as string[];

      arrayEntity.forEach((item) => {
        item.hide = filteredEntity.includes(item.value);
      });

      return arrayEntity;
    }
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

  applyFilters(filtersResult, filterType) {
    const filters = filtersResult.filters;
    switch (filterType) {
      case 'name':
        let nameFiltered: string[] = [];
        for (let name of filters) {

          if (name.checked) nameFiltered.push(name.name);
        }
        if (nameFiltered.length >= this.name.length) {
          this.form.value.name = [];
          this.isFilteringName = this.name.length;
        } else {
          if (nameFiltered.length > 0) {
            this.form.value.name = nameFiltered;
            this.isFilteringName = nameFiltered.length;
          } else {
            this.form.value.name = ["99999"];
            this.isFilteringName = this.name.length;
          }
        }
        break;
    }

    this.lastUsedFilter = filterType;
    this.getList(this.form);
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

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
    this.selection.clear();
    this.getFilters();
  }

  async delete() {
    let observable = new Observable(observer => observer.next());
    this.selection.selected.forEach(trasnport => {
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

  async sortData($event: Sort) {
    if ($event.active == "name") {
      this.form.value.orderby.type = 1;
    }
    this.form.value.orderby.order = $event.direction !== '' ? $event.direction : 'asc';

    this.getList(this.form);
  }

}
