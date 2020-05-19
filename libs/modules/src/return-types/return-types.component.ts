import { IntermediaryService } from './../../../services/src/lib/endpoint/intermediary/intermediary.service';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ReturnTypesService } from '../../../services/src/lib/endpoint/return-types/return-types.service';
import { ReturnTypeModel } from '../../../services/src/models/endpoints/ReturnType';
import ReturnType = ReturnTypeModel.ReturnType;
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import {PaginatorComponent} from '../components/paginator/paginator.component';
import * as _ from 'lodash';
import {validators} from "../utils/validators";
import { of } from 'rxjs';
import * as Filesave from 'file-saver';
import { catchError } from 'rxjs/operators';
import { ReturnTypeDetailsComponent } from './modals/return-type-details/return-type-details.component';
import { ReturnTypeAddComponent } from './modals/return-type-add/return-type-add.component';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'suite-return-types',
  templateUrl: './return-types.component.html',
  styleUrls: ['./return-types.component.scss'],
})
export class ReturnTypesComponent implements OnInit {

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  displayedColumns: string[] = ['select','names','defective'];
  dataSourceOriginal;
  dataSource;
  selectionReturnType = new SelectionModel<ReturnType>(true, []);

  columns = {};

  @ViewChild('filterButtonDefective') filterButtonDefective: FilterButtonComponent;
  @ViewChild('filterButtonNames') filterButtonNames: FilterButtonComponent;

  isFilteringDefective: number = 0;
  isFilteringNames: number = 0;

  /**Filters */
  defective: Array<TagsInputOption> = [];
  names: Array<TagsInputOption> = [];
  orderby: Array<TagsInputOption> = [];

  /** Filters save **/
  defectiveSelected: Array<any> = [];
  namesSelected: Array<any> = [];
  orderbySelected: Array<any> = [];

  groups: Array<TagsInputOption> = [];
  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
  /**List of SearchInContainer */
  returnTypes: Array<ReturnTypeModel.Results> = [];

  itemsIdSelected: Array<any> = [];
  itemsReferenceSelected: Array<any> = [];
  previousReferencePattern = '';
  /**timeout for send request */
  requestTimeout;
  //For sorting
  lastOrder = [true, true];
  hasDeleteReturnType = false;

  pagerValues = [10, 50, 100];
  form: FormGroup = this.formBuilder.group({
    name: [],
    defective: [],
    referencePattern: [],
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: 1,
      order: "asc"
    })
  });

  /**form to select elements to print or for anything */
  selectedForm: FormGroup = this.formBuilder.group({}, {
    validators: validators.haveItems("toSelect")
  });

  length: any;

  constructor(
    private returnTypesService: ReturnTypesService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private intermediaryService:IntermediaryService,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getColumns(this.form);
    this.getList(this.form);
    this.listenChanges();
  }

  listenChanges(): void {
    let previousPageSize = this.form.value.pagination.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      this.saveFilters();
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.form.get("pagination").patchValue({
        limit: page.pageSize,
        page: flag ? page.pageIndex : 1
      });
      this.recoverFilters();
      this.getList(this.form);
    });

    /**detect changes in the form */
    this.form.statusChanges.subscribe(change => {
      if (this.pauseListenFormChange) return;
      ///**format the reference */
      /**cant send a request in every keypress of reference, then cancel the previous request */
      clearTimeout(this.requestTimeout);
      /**it the change of the form is in reference launch new timeout with request in it */
      if (this.form.value.referencePattern != this.previousReferencePattern) {
        /**Just need check the vality if the change happens in the reference */
        if (this.form.valid)
          this.requestTimeout = setTimeout(() => {
            this.getList(this.sanitize(this.getFormValueCopy()));
          }, 1000);
      } else {
        /**reset the paginator to the 0 page */
        this.getList(this.sanitize(this.getFormValueCopy()));
      }
      /**assign the current reference to the previous reference */
      this.previousReferencePattern = this.form.value.referencePattern;
    });
  }

  initEntity() {
    this.entities = {
      name: [],
      defective: [],
      referencePattern: []
    }
  }
  initForm() {
    this.form.patchValue({
      name: [],
      defective: [],
      referencePattern: [],
      pagination: this.formBuilder.group({
        page: 1,
        limit: this.pagerValues[0]
      }),
    })
  }

  isAllSelectedReturnType() {
    if (this.dataSource) {
      const numSelected = this.selectionReturnType.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    return false
  }

  getFilters() {
    this.returnTypesService.entities().subscribe(entities => {
      this.names = this.updateFilterSource(entities.names, 'name');
      this.defective = this.updateFilterSource(entities.defective, 'defective');

      this.reduceFilters(entities);
      setTimeout(() => {
        this.pauseListenFormChange = false;
        this.pauseListenFormChange = true;
      }, 0);
    })
  }

  async getList(form?: FormGroup){
    this.returnTypesService.index(form.value).subscribe(
      (resp:any) => {
        this.dataSource = new MatTableDataSource<ReturnTypeModel.ReturnType>(resp.results);
        const paginator = resp.pagination;
        this.paginator.cantSelect = paginator.limit;
        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.selectPage;
        this.paginator.lastPage = paginator.lastPage;
        this.returnTypes = resp.results;
        this.initSelectForm();

        this.selectionReturnType.clear();
        this.dataSource.data.forEach(row => {
          if (row.distribution) {
            this.selectionReturnType.select(row);
          }
          this.dataSourceOriginal = _.cloneDeep(this.dataSource)
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

  static showArrow(colNumber, dirDown) {
    let htmlColumn = document.getElementsByClassName('title')[colNumber] as HTMLElement;
    if (dirDown) htmlColumn.innerHTML += ' 🡇';
    else htmlColumn.innerHTML += ' 🡅';
  }

  static deleteArrow() {
    for (let i = 0; i < document.getElementsByClassName('title').length; i++) {
      let iColumn = document.getElementsByClassName('title')[i] as HTMLElement;
      if (iColumn.innerHTML.includes('🡇') || iColumn.innerHTML.includes('🡅')) {
        iColumn.innerHTML = iColumn.innerHTML.slice(0, -2);
      }
    }
  }

  async applyFilters(filtersResult, filterType) {
    await this.intermediaryService.presentLoading();
    const filters = filtersResult.filters;
    switch (filterType) {
      case 'names':
        let namesFiltered: string[] = [];
        for (let names of filters) {

          if (names.checked) namesFiltered.push(names.id);
        }

        if (namesFiltered.length >= this.names.length) {
          this.form.value.name = [];
          this.isFilteringNames = this.names.length;
        } else {
          if (namesFiltered.length > 0) {
            this.form.value.name = namesFiltered;
            this.isFilteringNames = namesFiltered.length;
          } else {
            this.form.value.name = [99999];
            this.isFilteringNames = this.names.length;
          }
        }
        break;
      case 'defective':
        let defectiveFiltered: string[] = [];
        for (let defective of filters) {

          if (defective.checked) defectiveFiltered.push(defective.id);
        }

        if (defectiveFiltered.length >= this.defective.length) {
          this.form.value.defective = [];
          this.isFilteringDefective = this.defective.length;
        } else {
          if (defectiveFiltered.length > 0) {
            this.form.value.defective = defectiveFiltered;
            this.isFilteringDefective = defectiveFiltered.length;
          } else {
            this.form.value.defective = ['99999'];
            this.isFilteringDefective = this.defective.length;
          }
        }
        break;
    }
    this.lastUsedFilter = filterType;
    this.getList(this.form);
  }

  private reduceFilters(entities){
    this.filterButtonNames.listItems = this.reduceFilterEntities(this.names, entities,'names');
    this.filterButtonDefective.listItems = this.reduceFilterEntities(this.defective, entities,'defective');
  }

  private saveFilters(){
    this.namesSelected = this.form.value.name;
    this.defectiveSelected = this.form.value.defective;
    this.orderbySelected = this.form.value.orderby;
  }

  private recoverFilters(){
    this.form.get("name").patchValue(this.namesSelected, { emitEvent: false });
    this.form.get("defective").patchValue(this.defectiveSelected, { emitEvent: false });
    this.form.get("orderby").patchValue(this.orderbySelected, { emitEvent: false });
  }

  sanitize(object) {
    /**mejorable */
    object = JSON.parse(JSON.stringify(object));
    if (!object.orderby.type) {
      delete object.orderby.type;
    } else {
      object.orderby.type = parseInt(object.orderby.type);
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

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  private reduceFilterEntities(arrayEntity: any[], entities: any, entityName: string) {
    if (this.lastUsedFilter !== entityName) {
      let filteredEntity = entities[entityName] as unknown as string[];

      arrayEntity.forEach((item) => {
        item.hide = filteredEntity.includes(item.value);
      });
    }

    return arrayEntity;
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

  async getColumns(form?: FormGroup){
    // await this.intermediaryService.presentLoading();
    this.returnTypesService.index(form.value).subscribe(
      (resp:any) => {
        resp.filters.forEach((element) => {
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

  prevent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  async addReturnTypes(event) {
    event.stopPropagation();
    event.preventDefault();
    this.intermediaryService.presentLoading('', (async() => {
      let modal = (await this.modalController.create({
        component: ReturnTypeAddComponent
      }));

      modal.onDidDismiss().then(() => {
        this.refreshReturnTypes();
      });

      await modal.present();
    }));
  }

  async updateReturnTypes(event, returnType: ReturnTypeModel.Results) {
    event.stopPropagation();
    event.preventDefault();
    this.intermediaryService.presentLoading('', (async() => {
      let modal = (await this.modalController.create({
        component: ReturnTypeDetailsComponent,
        componentProps: {
          returnType: returnType
        }
      }));

      modal.onDidDismiss().then(() => {
        this.refreshReturnTypes();
      });

      await modal.present();
    }));
  }

  async deleteReturnTypes() {
    let ids = this.selectedForm.value.toSelect.map((element, i) =>
      element ? this.returnTypes[i].id : false)
      .filter(element => element);

    await this.intermediaryService.presentLoading('Borrando condiciones de proveedores');
    this.returnTypesService.delete(ids).subscribe(async result => {
      this.refreshReturnTypes();
      await this.intermediaryService.dismissLoading();
    }, async error => {
      await this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError('Ha ocurrido un error el cargar los datos del sevidor')
    });
  }

  async presentAlertDeleteConfirm() {
    const alert = await this.alertController.create({
      header: '¡Confirmar eliminación!',
      message: '¿Deseas eliminar los tipos de devolución seleccionados?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.initSelectForm();
          }
        }, {
          text: 'Si',
          handler: async () => {
            await this.deleteReturnTypes();
          }
        }
      ]
    });

    await alert.present();
  }

  refreshReturnTypes() {
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.getList(this.form);
    this.listenChanges();
  }

  sort(column: string) {
    for (let i = 0; i < document.getElementsByClassName('title').length; i++) {
      let iColumn = document.getElementsByClassName('title')[i] as HTMLElement;
      if (iColumn.innerHTML.includes('🡇') || iColumn.innerHTML.includes('🡅')) {
        iColumn.innerHTML = iColumn.innerHTML.slice(0, -2);
      }
    }

    switch (column) {
      case 'name': {
        if (this.lastOrder[0]) {
          this.form.value.orderby = { order: "desc", type: 1 };
          ReturnTypesComponent.showArrow(0, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 1 };
          ReturnTypesComponent.showArrow(0, true);
        }
        this.lastOrder[0] = !this.lastOrder[0];
        break;
      }
      case 'defective': {
        if (this.lastOrder[1]) {
          this.form.value.orderby = { order: "desc", type: 2 };
          ReturnTypesComponent.showArrow(1, false);
        }
        else {
          this.form.value.orderby = { order: "asc", type: 2 };
          ReturnTypesComponent.showArrow(1, true);
        }
        this.lastOrder[1] = !this.lastOrder[1];
        break;
      }
    }
    this.getList(this.form);
  }

  // TODO METODO LLAMAR ARCHIVO EXCELL
  /**
   * @description Eviar parametros y recibe un archivo excell
   */
  async fileExcell() {
    this.intermediaryService.presentLoading('Descargando Archivo Excel');
    const formToExcel = this.getFormValueCopy();
    if (formToExcel.pagination) {
      formToExcel.pagination.page = 1;
      formToExcel.pagination.limit = 0;
    }
    this.returnTypesService.getFileExcell(this.sanitize(formToExcel)).pipe(
      catchError(error => of(error)),
      // map(file => file.error.text)
    ).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      Filesave.saveAs(blob, `${Date.now()}.xlsx`);
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess('Archivo descargado')
    }, error => console.log(error));
  }

  initSelectForm(): void {
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect", this.formBuilder.array(this.returnTypes.map(element => new FormControl(false))));
  }

  selectAll(event): void {
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control => {
      control.setValue(value);
    });

    if (value) {
      this.itemsIdSelected = this.returnTypes;
    } else {
      this.itemsIdSelected = [];
    }
  }

  itemSelected(product) {
    const index = this.itemsIdSelected.indexOf(product, 0);
    if (index > -1) {
      this.itemsIdSelected.splice(index, 1);
    } else {
      this.itemsIdSelected.push(product);
    }
  }
}
