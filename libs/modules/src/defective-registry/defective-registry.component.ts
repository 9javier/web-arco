import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { IntermediaryService } from '@suite/services';
import { ModalController } from '@ionic/angular';
import { DefectiveRegistryService } from '../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { DefectiveRegistryModel } from '../../../services/src/models/endpoints/DefectiveRegistry';
import { SelectionModel } from '@angular/cdk/collections';
import DefectiveRegistry = DefectiveRegistryModel.DefectiveRegistry;
import { DamagedModel } from '../../../services/src/models/endpoints/Damaged';
import { ShowImageComponent } from '../components/modal-defective/show-image/show-image.component';
import { RegistryDetailsComponent } from '../components/modal-defective/registry-details/registry-details.component';

@Component({
  selector: 'suite-defective-registry',
  templateUrl: './defective-registry.component.html',
  styleUrls: ['./defective-registry.component.scss'],
})
export class DefectiveRegistryComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select','id','product','dateDetection','statusManagementDefect','defectTypeParent','defectTypeChild','numberObservations','photo','warehouse'];
  dataSource;
  selection = new SelectionModel<DefectiveRegistry>(true, []);
  originalTableStatus: DamagedModel.Status[];
  columns = {};

  @ViewChild('filterButtonProduct') filterButtonProduct: FilterButtonComponent;
  @ViewChild('filterButtonDateDetection') filterButtonDateDetection: FilterButtonComponent;
  @ViewChild('filterButtonStatusManagementDefect') filterButtonStatusManagementDefect: FilterButtonComponent;
  @ViewChild('filterButtonDefectTypeParent') filterButtonDefectTypeParent: FilterButtonComponent;
  @ViewChild('filterButtonDefectTypeChild') filterButtonDefectTypeChild: FilterButtonComponent;
  @ViewChild('filterButtonNumberObservations') filterButtonNumberObservations: FilterButtonComponent;
  @ViewChild('filterButtonPhoto') filterButtonPhoto: FilterButtonComponent;
  @ViewChild('filterButtonWarehouse') filterButtonWarehouse: FilterButtonComponent;

  isFilteringProduct: number = 0;
  isFilteringDateDetection: number = 0;
  isFilteringStatusManagementDefect: number = 0;
  isFilteringDefectTypeParent: number = 0;
  isFilteringDefectTypeChild: number = 0;
  isFilteringNumberObservations: number = 0;
  isFilteringPhoto: number = 0;
  isFilteringWarehouse: number = 0;

  /**Filters */
  product: Array<TagsInputOption> = [];
  dateDetection: Array<TagsInputOption> = [];
  statusManagementDefect: Array<TagsInputOption> = [];
  defectTypeParent: Array<TagsInputOption> = [];
  defectTypeChild: Array<TagsInputOption> = [];
  numberObservations: Array<TagsInputOption> = [];
  photo: Array<TagsInputOption> = [];
  warehouse: Array<TagsInputOption> = [];

  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagerValues = [10, 20, 80];

  form: FormGroup = this.formBuilder.group({
    id: [],
    product: [],
    dateDetection: [],
    statusManagementDefect: [],
    defectTypeParent: [],
    defectTypeChild: [],
    numberObservations:[],
    photo: [],
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

  constructor(
    private defectiveRegistryService: DefectiveRegistryService,
    private formBuilder: FormBuilder,
    private intermediaryService:IntermediaryService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getColumns(this.form);
    this.getList(this.form);
    this.listenChanges();
  }

  initEntity() {
    this.entities = {
      product: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      numberObservations:[],
      photo: [],
      warehouse: [],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
    }
  }

  initForm() {
    this.form.patchValue({
      id: [],
      product: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      numberObservations:[],
      photo: [],
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

  getFilters() {
    this.defectiveRegistryService.getFiltersEntitiesFalse().subscribe((entities) => {
      this.product = this.updateFilterSource(entities.product, 'product');
      this.dateDetection = this.updateFilterSource(entities.dateDetection, 'dateDetection');
      this.statusManagementDefect = this.updateFilterSource(entities.statusManagementDefect, 'statusManagementDefect');
      this.defectTypeParent = this.updateFilterSource(entities.defectTypeParent, 'defectTypeParent');
      this.defectTypeChild = this.updateFilterSource(entities.defectTypeChild, 'defectTypeChild');
      this.numberObservations = this.updateFilterSource(entities.numberObservations, 'numberObservations');
      this.photo = this.updateFilterSource(entities.photo, 'photo');
      this.warehouse = this.updateFilterSource(entities.warehouse, 'warehouse');

      this.reduceFilters(entities);
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
      }, 0);
    })
  }

  async getColumns(form?: FormGroup){
    this.defectiveRegistryService.indexHistoricFalse(form.value).subscribe(
      (resp:any) => {
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

  private reduceFilters(entities){
    this.filterButtonProduct.listItems = this.reduceFilterEntities(this.product, entities,'product');
    this.filterButtonDateDetection.listItems = this.reduceFilterEntities(this.dateDetection, entities,'dateDetection');
    this.filterButtonStatusManagementDefect.listItems = this.reduceFilterEntities(this.statusManagementDefect, entities,'statusManagementDefect');
    this.filterButtonDefectTypeParent.listItems = this.reduceFilterEntities(this.defectTypeParent, entities,'defectTypeParent');
    this.filterButtonDefectTypeChild.listItems = this.reduceFilterEntities(this.defectTypeChild, entities,'defectTypeChild');
    this.filterButtonNumberObservations.listItems = this.reduceFilterEntities(this.numberObservations, entities,'numberObservations');
    this.filterButtonPhoto.listItems = this.reduceFilterEntities(this.photo, entities,'photo');
    this.filterButtonWarehouse.listItems = this.reduceFilterEntities(this.warehouse, entities,'warehouse');
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

  async getList(form?: FormGroup){
    this.defectiveRegistryService.indexHistoricFalse(form.value).subscribe((resp:any) => {
        if (resp.results) {
          this.dataSource = new MatTableDataSource<DefectiveRegistryModel.DefectiveRegistry>(resp.results);
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
      case 'product':
        let productFiltered: string[] = [];
        for (let product of filters) {

          if (product.checked) productFiltered.push(product.id);
        }

        if (productFiltered.length >= this.product.length) {
          this.form.value.product = [];
          this.isFilteringProduct = this.product.length;
        } else {
          if (productFiltered.length > 0) {
            this.form.value.product = productFiltered;
            this.isFilteringProduct = productFiltered.length;
          } else {
            this.form.value.product = ['99999'];
            this.isFilteringProduct = this.product.length;
          }
        }
        break;
      case 'dateDetection':
        let dateDetectionFiltered: string[] = [];
        for (let dateDetection of filters) {

          if (dateDetection.checked) dateDetectionFiltered.push(dateDetection.id);
        }

        if (dateDetectionFiltered.length >= this.dateDetection.length) {
          this.form.value.dateDetection = [];
          this.isFilteringDateDetection = this.dateDetection.length;
        } else {
          if (dateDetectionFiltered.length > 0) {
            this.form.value.dateDetection = dateDetectionFiltered;
            this.isFilteringDateDetection = dateDetectionFiltered.length;
          } else {
            this.form.value.dateDetection = ['99999'];
            this.isFilteringDateDetection = this.dateDetection.length;
          }
        }
        break;
      case 'statusManagementDefect':
        let statusManagementDefectFiltered: string[] = [];
        for (let statusManagementDefect of filters) {

          if (statusManagementDefect.checked) statusManagementDefectFiltered.push(statusManagementDefect.id);
        }

        if (statusManagementDefectFiltered.length >= this.statusManagementDefect.length) {
          this.form.value.statusManagementDefect = [];
          this.isFilteringStatusManagementDefect = this.statusManagementDefect.length;
        } else {
          if (statusManagementDefectFiltered.length > 0) {
            this.form.value.statusManagementDefect = statusManagementDefectFiltered;
            this.isFilteringStatusManagementDefect = statusManagementDefectFiltered.length;
          } else {
            this.form.value.statusManagementDefect = ['99999'];
            this.isFilteringStatusManagementDefect = this.statusManagementDefect.length;
          }
        }
        break;
      case 'defectTypeParent':
        let defectTypeParentFiltered: string[] = [];
        for (let defectTypeParent of filters) {

          if (defectTypeParent.checked) defectTypeParentFiltered.push(defectTypeParent.id);
        }

        if (defectTypeParentFiltered.length >= this.defectTypeParent.length) {
          this.form.value.defectTypeParent = [];
          this.isFilteringDefectTypeParent = this.defectTypeParent.length;
        } else {
          if (defectTypeParentFiltered.length > 0) {
            this.form.value.defectTypeParent = defectTypeParentFiltered;
            this.isFilteringDefectTypeParent = defectTypeParentFiltered.length;
          } else {
            this.form.value.defectTypeParent = ['99999'];
            this.isFilteringDefectTypeParent = this.defectTypeParent.length;
          }
        }
        break;
      case 'defectTypeChild':
        let defectTypeChildFiltered: string[] = [];
        for (let defectTypeChild of filters) {

          if (defectTypeChild.checked) defectTypeChildFiltered.push(defectTypeChild.id);
        }

        if (defectTypeChildFiltered.length >= this.defectTypeChild.length) {
          this.form.value.defectTypeChild = [];
          this.isFilteringDefectTypeChild = this.defectTypeChild.length;
        } else {
          if (defectTypeChildFiltered.length > 0) {
            this.form.value.defectTypeChild = defectTypeChildFiltered;
            this.isFilteringDefectTypeChild = defectTypeChildFiltered.length;
          } else {
            this.form.value.defectTypeChild = ['99999'];
            this.isFilteringDefectTypeChild = this.defectTypeChild.length;
          }
        }
        break;
      case 'numberObservations':
        let numberObservationsFiltered: string[] = [];
        for (let numberObservations of filters) {

          if (numberObservations.checked) numberObservationsFiltered.push(numberObservations.id);
        }

        if (numberObservationsFiltered.length >= this.numberObservations.length) {
          this.form.value.numberObservations = [];
          this.isFilteringNumberObservations = this.numberObservations.length;
        } else {
          if (numberObservationsFiltered.length > 0) {
            this.form.value.numberObservations = numberObservationsFiltered;
            this.isFilteringNumberObservations = numberObservationsFiltered.length;
          } else {
            this.form.value.numberObservations = ['99999'];
            this.isFilteringNumberObservations = this.numberObservations.length;
          }
        }
        break;
      case 'photo':
        let photoFiltered: string[] = [];
        for (let photo of filters) {

          if (photo.checked) photoFiltered.push(photo.id);
        }

        if (photoFiltered.length >= this.photo.length) {
          this.form.value.photo = [];
          this.isFilteringPhoto = this.photo.length;
        } else {
          if (photoFiltered.length > 0) {
            this.form.value.photo = photoFiltered;
            this.isFilteringPhoto = photoFiltered.length;
          } else {
            this.form.value.photo = ['99999'];
            this.isFilteringPhoto = this.photo.length;
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

  async goDetails(registry: DefectiveRegistryModel.DefectiveRegistry) {
    return (await this.modalController.create({
      component: RegistryDetailsComponent,
      componentProps: {
        productId: registry.product.id,
        showChangeState: true
      }
    })).present();
  }

  getStatusName(defectType: number) {
    const status = this.originalTableStatus.find((x) => x.id === defectType);
    return status.name;
  }

  async showImageModal(reference: string, photos: any[]) {
    console.log(photos)
    // return (await this.modalController.create({
    //   component: ShowImageComponent,
    //   componentProps: {
    //     reference: reference,
    //     urlImage: photo
    //   }
    // })).present();
  }
}
