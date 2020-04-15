import { BehaviorSubject, of, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import * as Filesave from 'file-saver';
import * as _ from 'lodash';
import { parse } from 'querystring';
import { NgxFileDropModule } from  'ngx-file-drop' ;
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Platform, ModalController } from '@ionic/angular';
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
import { FormBuilder, FormGroup } from '@angular/forms';
import { FiltersModel } from '../../../../services/src/models/endpoints/filters';


@Component({
  selector: 'suite-list-manual',
  templateUrl: './list-manual.component.html',
  styleUrls: ['./list-manual.component.scss']
})

export class ListManualComponent {
  constructor(
    private defectiveRegistryService: DefectiveRegistryService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private intermediary: IntermediaryService,
    ) {
  }

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [ 'operator','name', 'lastname', 'dni', 'phone', 'direction', 'province', 'country','postalcode','packages'];
  dataSource;
  selection = new SelectionModel<DefectiveRegistry>(true, []);
  originalTableStatus: DamagedModel.Status[];
  columns = {};

  @ViewChild('filterButtonOperator') filterButtonOperator: FilterButtonComponent;
  @ViewChild('filterButtonName') filterButtonName: FilterButtonComponent;
  @ViewChild('filterButtonLastName') filterButtonLastName: FilterButtonComponent;
  @ViewChild('filterButtonDni') filterButtonDni: FilterButtonComponent;
  @ViewChild('filterButtonPhone') filterButtonPhone: FilterButtonComponent;
  @ViewChild('filterButtonDirection') filterButtonDirection: FilterButtonComponent;
  @ViewChild('filterButtonProvince') filterButtonProvince: FilterButtonComponent;
  @ViewChild('filterButtonCountry') filterButtonCountry: FilterButtonComponent;
  @ViewChild('filterButtonPostal') filterButtonPostal: FilterButtonComponent;
  @ViewChild('filterButtonPackages') filterButtonPackages: FilterButtonComponent;


  isFilteringOperator: number = 0;
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
  isFilteringWarehouse: number = 0;

  /**Filters */
  operator: Array<TagsInputOption> = [];
  name: Array<TagsInputOption> = [];
  lastname: Array<TagsInputOption> = [];
  dni: Array<TagsInputOption> = [];
  phone: Array<TagsInputOption> = [];
  direction: Array<TagsInputOption> = [];
  province: Array<TagsInputOption> = [];
  country: Array<TagsInputOption> = [];
  postalcode: Array<TagsInputOption> = [];
  packages: Array<TagsInputOption> = [];


  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  pagerValues = [10, 20, 80];

  form: FormGroup = this.formBuilder.group({
    operator: [],
    name: [],
    lastname: [],
    dni: [],
    phone: [],
    direction: [],
    province: [],
    country: [],
    postalcode: [],
    packages: [],
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
    this.getFilters();
    // this.getColumns(this.form);
    this.getList(this.form);
    // this.listenChanges();

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
  }

  initEntity() {
    this.entities = {
      operator: [],
      name: [],
      lastname: [],
      dni: [],
      phone: [],
      direction: [],
      province: [],
      country: [],
      postalcode: [],
      packages: [],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
    }
  }

  initForm() {
    this.form.patchValue({
      operator: [],
      name: [],
      lastname: [],
      dni: [],
      phone: [],
      direction: [],
      province: [],
      country: [],
      postalcode: [],
      packages: [],
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
    this.defectiveRegistryService.getFilters().subscribe((entities) => {
      console.log(entities);
      this.operator = this.updateFilterSource(entities.operator, 'operator');
      this.name = this.updateFilterSource(entities.name, 'name');
      this.lastname = this.updateFilterSource(entities.lastname, 'lastname');
      this.dni = this.updateFilterSource(entities.dni, 'dni');
      this.phone = this.updateFilterSource(entities.phone, 'phone');
      this.direction = this.updateFilterSource(entities.direction, 'direction');
      this.province = this.updateFilterSource(entities.province, 'province');
      this.country = this.updateFilterSource(entities.country, 'country');
      this.postalcode = this.updateFilterSource(entities.postalcode, 'postalcode');
      this.packages = this.updateFilterSource(entities.packages, 'packages');

      this.reduceFilters(entities);
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
      }, 0);
    })
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
    this.filterButtonOperator.listItems = this.reduceFilterEntities(this.operator, entities, 'operator');
    this.filterButtonName.listItems = this.reduceFilterEntities(this.name, entities, 'name');
    this.filterButtonLastName.listItems = this.reduceFilterEntities(this.lastname, entities, 'lastname');
    this.filterButtonDni.listItems = this.reduceFilterEntities(this.dni, entities, 'dni');
    this.filterButtonPhone.listItems = this.reduceFilterEntities(this.phone, entities, 'phone');
    this.filterButtonDirection.listItems = this.reduceFilterEntities(this.direction, entities, 'direction');
    this.filterButtonProvince.listItems = this.reduceFilterEntities(this.province, entities, 'province');
    this.filterButtonCountry.listItems = this.reduceFilterEntities(this.country, entities, 'country');
    this.filterButtonPostal.listItems = this.reduceFilterEntities(this.postalcode, entities, 'postalcode');
    this.filterButtonPackages.listItems = this.reduceFilterEntities(this.packages, entities, 'packages');
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
    this.defectiveRegistryService.expeditions(form.value).subscribe((resp: any) => {
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
      case 'operators':
        let operatorsFiltered: string[] = [];
        for (let operator of filters) {

          if (operator.checked) operatorsFiltered.push(operator.id);
        }

        if (operatorsFiltered.length >= this.operator.length) {
          this.form.value.operator = [];
          this.isFilteringOperator = this.operator.length;
        } else {
          if (operatorsFiltered.length > 0) {
            this.form.value.operator = operatorsFiltered;
            this.isFilteringOperator = operatorsFiltered.length;
          } else {
            this.form.value.operator = ['99999'];
            this.isFilteringOperator = this.operator.length;
          }
        }
        break;
      case 'name':
        let userFiltered: string[] = [];
        for (let name of filters) {

          if (name.checked) userFiltered.push(name.id);
        }

        if (userFiltered.length >= this.name.length) {
          this.form.value.user = [];
          this.isFilteringUser = this.name.length;
        } else {
          if (userFiltered.length > 0) {
            this.form.value.user = userFiltered;
            this.isFilteringUser = userFiltered.length;
          } else {
            this.form.value.user = ['99999'];
            this.isFilteringUser = this.name.length;
          }
        }
        break;
      case 'lastname':
        let productFiltered: string[] = [];
        for (let lastname of filters) {

          if (lastname.checked) productFiltered.push(lastname.id);
        }

        if (productFiltered.length >= this.lastname.length) {
          this.form.value.product = [];
          this.isFilteringProduct = this.lastname.length;
        } else {
          if (productFiltered.length > 0) {
            this.form.value.product = productFiltered;
            this.isFilteringProduct = productFiltered.length;
          } else {
            this.form.value.product = ['99999'];
            this.isFilteringProduct = this.lastname.length;
          }
        }
        break;
      case 'dni':
        let modelFiltered: string[] = [];
        for (let dni of filters) {

          if (dni.checked) modelFiltered.push(dni.id);
        }

        if (modelFiltered.length >= this.dni.length) {
          this.form.value.model = [];
          this.isFilteringModel = this.dni.length;
        } else {
          if (modelFiltered.length > 0) {
            this.form.value.model = modelFiltered;
            this.isFilteringModel = modelFiltered.length;
          } else {
            this.form.value.model = ['99999'];
            this.isFilteringModel = this.dni.length;
          }
        }
        break;
      // case 'size':
      //   let sizeFiltered: string[] = [];
      //   for (let size of filters) {

      //     if (size.checked) sizeFiltered.push(size.id);
      //   }

      //   if (sizeFiltered.length >= this.size.length) {
      //     this.form.value.size = [];
      //     this.isFilteringSize = this.size.length;
      //   } else {
      //     if (sizeFiltered.length > 0) {
      //       this.form.value.size = sizeFiltered;
      //       this.isFilteringSize = sizeFiltered.length;
      //     } else {
      //       this.form.value.size = ['99999'];
      //       this.isFilteringSize = this.size.length;
      //     }
      //   }
      //   break;
      // case 'brand':
      //   let brandFiltered: string[] = [];
      //   for (let brand of filters) {

      //     if (brand.checked) brandFiltered.push(brand.id);
      //   }

      //   if (brandFiltered.length >= this.brand.length) {
      //     this.form.value.brand = [];
      //     this.isFilteringBrand = this.brand.length;
      //   } else {
      //     if (brandFiltered.length > 0) {
      //       this.form.value.brand = brandFiltered;
      //       this.isFilteringBrand = brandFiltered.length;
      //     } else {
      //       this.form.value.brand = ['99999'];
      //       this.isFilteringBrand = this.brand.length;
      //     }
      //   }
      //   break;
      // case 'color':
      //   let colorFiltered: string[] = [];
      //   for (let color of filters) {

      //     if (color.checked) colorFiltered.push(color.id);
      //   }

      //   if (colorFiltered.length >= this.color.length) {
      //     this.form.value.color = [];
      //     this.isFilteringColor = this.color.length;
      //   } else {
      //     if (colorFiltered.length > 0) {
      //       this.form.value.color = colorFiltered;
      //       this.isFilteringColor = colorFiltered.length;
      //     } else {
      //       this.form.value.color = ['99999'];
      //       this.isFilteringColor = this.color.length;
      //     }
      //   }
      //   break;
      // case 'dateDetection':
      //   let dateDetectionFiltered: string[] = [];
      //   for (let dateDetection of filters) {

      //     if (dateDetection.checked) dateDetectionFiltered.push(dateDetection.id);
      //   }

      //   if (dateDetectionFiltered.length >= this.dateDetection.length) {
      //     this.form.value.dateDetection = [];
      //     this.isFilteringDateDetection = this.dateDetection.length;
      //   } else {
      //     if (dateDetectionFiltered.length > 0) {
      //       this.form.value.dateDetection = dateDetectionFiltered;
      //       this.isFilteringDateDetection = dateDetectionFiltered.length;
      //     } else {
      //       this.form.value.dateDetection = ['99999'];
      //       this.isFilteringDateDetection = this.dateDetection.length;
      //     }
      //   }
      //   break;
      // case 'statusManagementDefect':
      //   let statusManagementDefectFiltered: string[] = [];
      //   for (let statusManagementDefect of filters) {

      //     if (statusManagementDefect.checked) statusManagementDefectFiltered.push(statusManagementDefect.id);
      //   }

      //   if (statusManagementDefectFiltered.length >= this.statusManagementDefect.length) {
      //     this.form.value.statusManagementDefect = [];
      //     this.isFilteringStatusManagementDefect = this.statusManagementDefect.length;
      //   } else {
      //     if (statusManagementDefectFiltered.length > 0) {
      //       this.form.value.statusManagementDefect = statusManagementDefectFiltered;
      //       this.isFilteringStatusManagementDefect = statusManagementDefectFiltered.length;
      //     } else {
      //       this.form.value.statusManagementDefect = ['99999'];
      //       this.isFilteringStatusManagementDefect = this.statusManagementDefect.length;
      //     }
      //   }
      //   break;
      // case 'defectTypeParent':
      //   let defectTypeParentFiltered: string[] = [];
      //   for (let defectTypeParent of filters) {

      //     if (defectTypeParent.checked) defectTypeParentFiltered.push(defectTypeParent.id);
      //   }

      //   if (defectTypeParentFiltered.length >= this.defectTypeParent.length) {
      //     this.form.value.defectTypeParent = [];
      //     this.isFilteringDefectTypeParent = this.defectTypeParent.length;
      //   } else {
      //     if (defectTypeParentFiltered.length > 0) {
      //       this.form.value.defectTypeParent = defectTypeParentFiltered;
      //       this.isFilteringDefectTypeParent = defectTypeParentFiltered.length;
      //     } else {
      //       this.form.value.defectTypeParent = ['99999'];
      //       this.isFilteringDefectTypeParent = this.defectTypeParent.length;
      //     }
      //   }
      //   break;
      // case 'defectTypeChild':
      //   let defectTypeChildFiltered: string[] = [];
      //   for (let defectTypeChild of filters) {

      //     if (defectTypeChild.checked) defectTypeChildFiltered.push(defectTypeChild.id);
      //   }

      //   if (defectTypeChildFiltered.length >= this.defectTypeChild.length) {
      //     this.form.value.defectTypeChild = [];
      //     this.isFilteringDefectTypeChild = this.defectTypeChild.length;
      //   } else {
      //     if (defectTypeChildFiltered.length > 0) {
      //       this.form.value.defectTypeChild = defectTypeChildFiltered;
      //       this.isFilteringDefectTypeChild = defectTypeChildFiltered.length;
      //     } else {
      //       this.form.value.defectTypeChild = ['99999'];
      //       this.isFilteringDefectTypeChild = this.defectTypeChild.length;
      //     }
      //   }
      //   break;
      // case 'warehouse':
      //   let warehouseFiltered: string[] = [];
      //   for (let warehouse of filters) {

      //     if (warehouse.checked) warehouseFiltered.push(warehouse.id);
      //   }

      //   if (warehouseFiltered.length >= this.warehouse.length) {
      //     this.form.value.warehouse = [];
      //     this.isFilteringWarehouse = this.warehouse.length;
      //   } else {
      //     if (warehouseFiltered.length > 0) {
      //       this.form.value.warehouse = warehouseFiltered;
      //       this.isFilteringWarehouse = warehouseFiltered.length;
      //     } else {
      //       this.form.value.warehouse = ['99999'];
      //       this.isFilteringWarehouse = this.warehouse.length;
      //     }
      //   }
      //   break;
    }

    this.lastUsedFilter = filterType;
    this.getList(this.form);
  }
  
  getStatusName(defectType: number) {
    const status = this.originalTableStatus.find((x) => x.id === defectType);
    return status.name;
  }


}
