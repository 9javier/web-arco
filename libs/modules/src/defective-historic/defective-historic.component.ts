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
import { RegistryDetailsComponent } from '../components/modal-defective/registry-details/registry-details.component';
import * as Filesave from 'file-saver';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, of, Observable } from 'rxjs';

@Component({
  selector: 'suite-defective-historic',
  templateUrl: './defective-historic.component.html',
  styleUrls: ['./defective-historic.component.scss'],
})
export class DefectiveHistoricComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['id','user','statusManagementDefect','warehouse','product','model','size','brand','color','dateDetection','defectTypeParent','defectTypeChild', 'defectZoneParent','defectZoneChild', 'sold'];
  dataSource;
  selection = new SelectionModel<DefectiveRegistry>(true, []);
  columns = {};

  @ViewChild('filterButtonId') filterButtonId: FilterButtonComponent;
  @ViewChild('filterButtonUser') filterButtonUser: FilterButtonComponent;
  @ViewChild('filterButtonProduct') filterButtonProduct: FilterButtonComponent;
  @ViewChild('filterButtonModel') filterButtonModel: FilterButtonComponent;
  @ViewChild('filterButtonSize') filterButtonSize: FilterButtonComponent;
  @ViewChild('filterButtonBrand') filterButtonBrand: FilterButtonComponent;
  @ViewChild('filterButtonColor') filterButtonColor: FilterButtonComponent;
  @ViewChild('filterButtonDateDetection') filterButtonDateDetection: FilterButtonComponent;
  @ViewChild('filterButtonStatusManagementDefect') filterButtonStatusManagementDefect: FilterButtonComponent;
  @ViewChild('filterButtonDefectTypeParent') filterButtonDefectTypeParent: FilterButtonComponent;
  @ViewChild('filterButtonDefectTypeChild') filterButtonDefectTypeChild: FilterButtonComponent;
  @ViewChild('filterButtonDefectZoneParent') filterButtonDefectZoneParent: FilterButtonComponent;
  @ViewChild('filterButtonDefectZoneChild') filterButtonDefectZoneChild: FilterButtonComponent;
  @ViewChild('filterButtonWarehouse') filterButtonWarehouse: FilterButtonComponent;
  @ViewChild('filterButtonSold') filterButtonSold: FilterButtonComponent;

  isFilteringId: number = 0;
  isFilteringUser: number = 0;
  isFilteringProduct: number = 0;
  isFilteringModel: number = 0;
  isFilteringSize: number = 0;
  isFilteringBrand: number = 0;
  isFilteringColor: number = 0;
  isFilteringDateDetection: number = 0;
  isFilteringStatusManagementDefect: number = 0;
  isFilteringDefectTypeParent: number = 0;
  isFilteringDefectTypeChild: number = 0;
  isFilteringDefectZoneParent: number = 0;
  isFilteringDefectZoneChild: number = 0;
  isFilteringWarehouse: number = 0;
  isFilteringSold: number = 0;

  /**Filters */
  id: Array<TagsInputOption> = [];
  user: Array<TagsInputOption> = [];
  product: Array<TagsInputOption> = [];
  model: Array<TagsInputOption> = [];
  size: Array<TagsInputOption> = [];
  brand: Array<TagsInputOption> = [];
  color: Array<TagsInputOption> = [];
  dateDetection: Array<TagsInputOption> = [];
  statusManagementDefect: Array<TagsInputOption> = [];
  defectTypeParent: Array<TagsInputOption> = [];
  defectTypeChild: Array<TagsInputOption> = [];
  defectZoneParent: Array<TagsInputOption> = [];
  defectZoneChild: Array<TagsInputOption> = [];
  warehouse: Array<TagsInputOption> = [];
  sold: Array<TagsInputOption> = [];

  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagerValues = [10, 20, 80];

  form: FormGroup = this.formBuilder.group({
    id: [],
    user: [],
    product: [],
    model: [],
    size: [],
    brand: [],
    color: [],
    dateDetection: [],
    statusManagementDefect: [],
    defectTypeParent: [],
    defectTypeChild: [],
    defectZoneParent: [],
    defectZoneChild: [],
    warehouse: [],
    sold: [],
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
    this.getColumns(this.form)
    this.getList(this.form);
    this.listenChanges();
  }

  initEntity() {
    this.entities = {
      id: [],
      user: [],
      product: [],
      model: [],
      size: [],
      brand: [],
      color: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      defectZoneParent: [],
      defectZoneChild: [],
      warehouse: [],
      sold: [],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
    }
  }

  initForm() {
    this.form.patchValue({
      id: [],
      user: [],
      product: [],
      model: [],
      size: [],
      brand: [],
      color: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      defectZoneParent: [],
      defectZoneChild: [],
      warehouse: [],
      sold: [],
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
    this.defectiveRegistryService.getFiltersEntitiesTrue().subscribe((entities) => {
      this.id = this.updateFilterSource(entities.id, 'id');
      this.user = this.updateFilterSource(entities.user, 'user');
      this.product = this.updateFilterSource(entities.product, 'product');
      this.model = this.updateFilterSource(entities.model, 'model');
      this.size = this.updateFilterSource(entities.size, 'size');
      this.brand = this.updateFilterSource(entities.brand, 'brand');
      this.color = this.updateFilterSource(entities.color, 'color');
      this.dateDetection = this.updateFilterSource(entities.dateDetection, 'dateDetection');
      this.statusManagementDefect = this.updateFilterSource(entities.statusManagementDefect, 'statusManagementDefect');
      this.defectTypeParent = this.updateFilterSource(entities.defectTypeParent, 'defectTypeParent');
      this.defectTypeChild = this.updateFilterSource(entities.defectTypeChild, 'defectTypeChild');
      this.defectZoneParent = this.updateFilterSource(entities.defectZoneParent, 'defectZoneParent');
      this.defectZoneChild = this.updateFilterSource(entities.defectZoneChild, 'defectZoneChild');
      this.warehouse = this.updateFilterSource(entities.warehouse, 'warehouse');
      this.sold = this.updateFilterSource(entities.sold, 'sold');

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
      if(entity.name.toString()=='false'){
        entity.name = 'No';
        entity.value = 'No';
      }else{
        if(entity.name.toString()=='true'){
          entity.name = 'Sí';
          entity.value = 'Sí';
        }else{
          entity.name = entity.name;
          entity.value = entity.name;
        }
      }
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
    this.filterButtonId.listItems = this.reduceFilterEntities(this.id, entities,'id');
    this.filterButtonUser.listItems = this.reduceFilterEntities(this.user, entities, 'user');
    this.filterButtonProduct.listItems = this.reduceFilterEntities(this.product, entities,'product');
    this.filterButtonModel.listItems = this.reduceFilterEntities(this.model, entities,'model');
    this.filterButtonSize.listItems = this.reduceFilterEntities(this.size, entities,'size');
    this.filterButtonBrand.listItems = this.reduceFilterEntities(this.brand, entities,'brand');
    this.filterButtonColor.listItems = this.reduceFilterEntities(this.color, entities,'color');
    this.filterButtonDateDetection.listItems = this.reduceFilterEntities(this.dateDetection, entities,'dateDetection');
    this.filterButtonStatusManagementDefect.listItems = this.reduceFilterEntities(this.statusManagementDefect, entities,'statusManagementDefect');
    this.filterButtonDefectTypeParent.listItems = this.reduceFilterEntities(this.defectTypeParent, entities,'defectTypeParent');
    this.filterButtonDefectTypeChild.listItems = this.reduceFilterEntities(this.defectTypeChild, entities,'defectTypeChild');
    this.filterButtonDefectZoneParent.listItems = this.reduceFilterEntities(this.defectZoneParent, entities,'defectZoneParent');
    this.filterButtonDefectZoneChild.listItems = this.reduceFilterEntities(this.defectZoneChild, entities,'defectZoneChild');
    this.filterButtonWarehouse.listItems = this.reduceFilterEntities(this.warehouse, entities,'warehouse');
    this.filterButtonSold.listItems = this.reduceFilterEntities(this.sold, entities,'sold');
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

  async getColumns(form?: FormGroup) {
    this.defectiveRegistryService.indexHistoricFalse(form.value).subscribe(
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

  async sortData(event: Sort) {
    this.form.value.orderby.type = this.columns[event.active];
    this.form.value.orderby.order = event.direction !== '' ? event.direction : 'asc';

    this.intermediaryService.presentLoading('Cargando Filtros...').then(() => {
      this.getList(this.form);
    });
  }

  async getList(form?: FormGroup){
    this.defectiveRegistryService.indexHistoricTrue(form.value).subscribe((resp:any) => {
        if (resp.results) {
          this.dataSource = new MatTableDataSource<DefectiveRegistryModel.DefectiveRegistry>(resp.results);
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
      case 'id':
        let idFiltered: string[] = [];
        for (let id of filters) {

          if (id.checked) idFiltered.push(id.id);
        }

        if (idFiltered.length >= this.id.length) {
          this.form.value.id = [];
          this.isFilteringId = this.id.length;
        } else {
          if (idFiltered.length > 0) {
            this.form.value.id = idFiltered;
            this.isFilteringId = idFiltered.length;
          } else {
            this.form.value.id = ['99999'];
            this.isFilteringId = this.id.length;
          }
        }
        break;
      case 'user':
        let userFiltered: string[] = [];
        for (let user of filters) {

          if (user.checked) userFiltered.push(user.id);
        }

        if (userFiltered.length >= this.user.length) {
          this.form.value.user = [];
          this.isFilteringUser = this.user.length;
        } else {
          if (userFiltered.length > 0) {
            this.form.value.user = userFiltered;
            this.isFilteringUser = userFiltered.length;
          } else {
            this.form.value.user = ['99999'];
            this.isFilteringUser = this.user.length;
          }
        }
        break;
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
      case 'model':
        let modelFiltered: string[] = [];
        for (let model of filters) {

          if (model.checked) modelFiltered.push(model.id);
        }

        if (modelFiltered.length >= this.model.length) {
          this.form.value.model = [];
          this.isFilteringModel = this.model.length;
        } else {
          if (modelFiltered.length > 0) {
            this.form.value.model = modelFiltered;
            this.isFilteringModel = modelFiltered.length;
          } else {
            this.form.value.model = ['99999'];
            this.isFilteringModel = this.model.length;
          }
        }
        break;
      case 'size':
        let sizeFiltered: string[] = [];
        for (let size of filters) {

          if (size.checked) sizeFiltered.push(size.id);
        }

        if (sizeFiltered.length >= this.size.length) {
          this.form.value.size = [];
          this.isFilteringSize = this.size.length;
        } else {
          if (sizeFiltered.length > 0) {
            this.form.value.size = sizeFiltered;
            this.isFilteringSize = sizeFiltered.length;
          } else {
            this.form.value.size = ['99999'];
            this.isFilteringSize = this.size.length;
          }
        }
        break;
      case 'brand':
        let brandFiltered: string[] = [];
        for (let brand of filters) {

          if (brand.checked) brandFiltered.push(brand.id);
        }

        if (brandFiltered.length >= this.brand.length) {
          this.form.value.brand = [];
          this.isFilteringBrand = this.brand.length;
        } else {
          if (brandFiltered.length > 0) {
            this.form.value.brand = brandFiltered;
            this.isFilteringBrand = brandFiltered.length;
          } else {
            this.form.value.brand = ['99999'];
            this.isFilteringBrand = this.brand.length;
          }
        }
        break;
      case 'color':
        let colorFiltered: string[] = [];
        for (let color of filters) {

          if (color.checked) colorFiltered.push(color.id);
        }

        if (colorFiltered.length >= this.color.length) {
          this.form.value.color = [];
          this.isFilteringColor = this.color.length;
        } else {
          if (colorFiltered.length > 0) {
            this.form.value.color = colorFiltered;
            this.isFilteringColor = colorFiltered.length;
          } else {
            this.form.value.color = ['99999'];
            this.isFilteringColor = this.color.length;
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
      case 'defectZoneParent':
        let defectZoneParentFiltered: string[] = [];
        for (let defectZoneParent of filters) {

          if (defectZoneParent.checked) defectZoneParentFiltered.push(defectZoneParent.id);
        }

        if (defectZoneParentFiltered.length >= this.defectZoneParent.length) {
          this.form.value.defectZoneParent = [];
          this.isFilteringDefectZoneParent = this.defectZoneParent.length;
        } else {
          if (defectZoneParentFiltered.length > 0) {
            this.form.value.defectZoneParent = defectZoneParentFiltered;
            this.isFilteringDefectZoneParent = defectZoneParentFiltered.length;
          } else {
            this.form.value.defectZoneParent = ['99999'];
            this.isFilteringDefectZoneParent = this.defectZoneParent.length;
          }
        }
        break;
      case 'defectZoneChild':
        let defectZoneChildFiltered: string[] = [];
        for (let defectZoneChild of filters) {

          if (defectZoneChild.checked) defectZoneChildFiltered.push(defectZoneChild.id);
        }

        if (defectZoneChildFiltered.length >= this.defectZoneChild.length) {
          this.form.value.defectZoneChild = [];
          this.isFilteringDefectZoneChild = this.defectZoneChild.length;
        } else {
          if (defectZoneChildFiltered.length > 0) {
            this.form.value.defectZoneChild = defectZoneChildFiltered;
            this.isFilteringDefectZoneChild = defectZoneChildFiltered.length;
          } else {
            this.form.value.defectZoneChild = ['99999'];
            this.isFilteringDefectZoneChild = this.defectZoneChild.length;
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
      case 'sold':
        let soldFiltered: string[] = [];
        for (let sold of filters) {

          if (sold.checked) soldFiltered.push(sold.id);
        }

        if (soldFiltered.length >= this.sold.length) {
          this.form.value.sold = [];
          this.isFilteringSold = this.sold.length;
        } else {
          if (soldFiltered.length > 0) {
            this.form.value.sold = soldFiltered;
            this.isFilteringSold = soldFiltered.length;
          } else {
            this.form.value.sold = ['99999'];
            this.isFilteringSold = this.sold.length;
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
        id: registry.id,
        productId: registry.product.id,
        history: true
      }
    })).present();
  }

  async showImageModal(reference: string, photo: any[]) {
    console.log(photo);
    // return (await this.modalController.create({
    //   component: ShowImageComponent,
    //   componentProps: {
    //     reference: reference,
    //     urlImage: photo
    //   }
    // })).present();
  }

  /**
   * @description Eviar parametros y recibe un archivo excell
   */
  async fileExcell() {
    this.intermediaryService.presentLoading('Descargando Archivo Excel').then(()=>{
      const formToExcel = this.getFormValueCopy();
      this.defectiveRegistryService.getHistoricFileExcell(this.sanitize(formToExcel)).pipe(
        catchError(error => of(error)),
        // map(file => file.error.text)
      ).subscribe((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        Filesave.saveAs(blob, `${Date.now()}.xlsx`);
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess('Archivo descargado')
      }, error => console.log(error));
    });
  }

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }
  sanitize(object) {
    /**mejorable */
    object = JSON.parse(JSON.stringify(object));
    if (!object.orderby.type) {
      delete object.orderby.type;
    } else {
      object.orderby.type = object.orderby.type;
    }
    if (!object.orderby.order) delete object.orderby.order;
    Object.keys(object).forEach(key => {
      if (object[key] instanceof Array) {
        if (object[key][0] instanceof Array) {
          object[key] = object[key][0];
        } else {
          for (let i = 0; i < object[key].length; i++) {
            if (object[key][i] === null || object[key][i] === "") {
              object[key].splice(i, 1);
            }
          }
        }
      }
      if (object[key] === null || object[key] === "") {
        delete object[key];
      }
    });
    return object;
  }
}
