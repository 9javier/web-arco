import { Component, OnInit, Input, ViewEncapsulation, AfterViewInit, EventEmitter, ChangeDetectorRef, Output, ViewChild, SimpleChange } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { FilterButtonComponent } from '../filter-button/filter-button.component';
import { SelectionModel } from '@angular/cdk/collections';
import { PaginatorComponent } from '../paginator/paginator.component';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import {TableEmitter } from '../../../../services/src/models/tableEmitterType';
import { element } from 'protractor';

@Component({
  selector: 'suite-table-filters-updated',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class TableFiltersComponent implements OnInit {
  displayedColumns = [];
  @Input() dataSource: any;
  @Input() columnsData;
  @Input() filters;
  @Input() filtersData;
  @Input() results: any = [];
  @Input() checkbox = null;
  @Input() btnRefresh;
  @Input() btnDelete;
  @Input() btnExcell = false;
  @Input() pagination;
  @Input() btnSend = false;
  @Input() btnAdd = false;
  @Input() buttons = false;

  
  @Output() emitMain = new EventEmitter<any>();
  bodyEmitter =0;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  pagerValues = [10, 20, 100];
  @ViewChild('filterButtonName') filterButtonName: FilterButtonComponent;
  public list: Array<any> = [];
  entities;
  isFilteringName: number = 0;
  form: FormGroup = this.formBuilder.group({
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: 1,
      order: "asc"
    })
  });


  constructor(private formBuilder: FormBuilder, ) {
  }

  ngOnInit() {
    this.initButtons();
    this.initCheckbox();
    this.initColums();
    this.initEntity();
    this.initPaginator();
    this.getEntities();
    this.listenChanges();
  }

  initButtons(){
    if (this.buttons == true) {
      this.columnsData.push({
        name: 'buttons',
        title: '--',
        field: 'buttons',
        filters: false,
      });
     
    }
  }

  initCheckbox() {
    if (this.checkbox == true || this.checkbox == null) {
      let arrayColumns = this.columnsData;
      this.columnsData = [];
      this.columnsData.push({
        name: 'select',
        title: 'Todas',
        field: 'name',
        filters: false,
      });
      arrayColumns.forEach(element => {
        this.columnsData.push(element);
      });
    }
  }
  uniqueFilters(){ 
    let filterTmp = this.filtersData;
    let filtersMain = this.filtersData;
    this.filtersData=[];
    for(const key in filterTmp){
      let filters = this.uniqueDatesArray(filterTmp[key]);
      filtersMain[key] = filters;
    }
    this.filtersData = filtersMain;
  }


  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    let change: SimpleChange = changes['filtersData'];
    let changeDelete: SimpleChange = changes['btnDelete'];
    let changePagination: SimpleChange = changes['pagination'];
    if (changePagination != undefined) {
      if (this.pagination != null && this.pagination != undefined) {
        this.initPaginator();
        this.listenChangesPaginator();
      }
    }
    if (change != undefined || changeDelete != undefined) {
      this.initEntity();
      this.getEntities();
    }
  }

  initColums() {
    this.columnsData.forEach((element, index) => {
      this.displayedColumns.push(element.name);
    });

  }

  initPaginator() {
    if (this.pagination != null && this.pagination != undefined) {
      this.paginator.lastPage = this.pagination.lastPage;
      this.paginator.length = this.pagination.totalResults;
      this.paginator.pageIndex = this.pagination.selectPage;
    }

  }



  listenChanges() {
    let previousPageSize = this.form.value.pagination.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      let flag = previousPageSize === page.pageSize;
      previousPageSize = page.pageSize;
      this.form.value.pagination = {
        limit: page.pageSize,
        page: flag ? page.pageIndex : 1
      };
      this.selection.clear();
       this.bodyEmitter = TableEmitter.Pagination;
       let emit={event:this.bodyEmitter,value:this.form.value.pagination};
       this.emitMain.emit(emit);
       this.bodyEmitter=0;
    });

  }

  listenChangesPaginator() {
    let previousPageSize = this.pagination.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      let flag = previousPageSize === page.pageSize;
      previousPageSize = page.pageSize;
      this.form.value.pagination = {
        limit: page.pageSize,
        page: flag ? page.pageIndex : 1
      };
      this.selection.clear();
    });

  }

  async sortData($event: Sort) {
    let result = this.dataSource.data.filters.find(element => element.name == $event.active);
    if (result) {
      this.form.value.orderby.type = result.id;
      this.form.value.orderby.order = $event.direction !== '' ? $event.direction : 'asc';
      this.bodyEmitter = TableEmitter.Sorter;
      let emit={event:this.bodyEmitter,value:this.form.value.orderby};
      this.emitMain.emit(emit);
      this.bodyEmitter=0;
    } else {
      console.log("Error, el nombre de la columna debe ser igual al de los filtros", "que provienen de la consulta.");
    }
  }

  getEntities() {
    this.list = this.entities;
    for (let key in this.list) {
      var keyjson = this.list[key];
    }
  }

  initEntity() {
    this.uniqueFilters();
   

    for (const key in this.filtersData) {
      console.log(moment(this.filtersData[key].name).isValid());
      if (moment(this.filtersData[key].name).isValid() == true) {
        //entity type date
        this.filtersData[key] = this.filtersData[key].map(entity => {
          return {
            ...entity,
            value: entity.name,
            checked: true,
            hide: false,
            type: 2
          }
        });
      }//entity is string
      else if (isNaN(this.filtersData[key].name)) {
        this.filtersData[key] = this.filtersData[key].map(entity => {
          return {
            ...entity,
            value: entity.name,
            checked: true,
            hide: false,
            type: 0
          }
        });
      } else {
        // entity type string
        this.filtersData[key] = this.filtersData[key].map(entity => {
          return {
            ...entity,
            value: entity.name,
            checked: true,
            hide: false,
            type: 1
          }
        });

      }


    }
    this.entities = this.filtersData;
  }

  checkboxLabel() {

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.results.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.results.forEach(row => this.selection.select(row));
      this.bodyEmitter = TableEmitter.Checkbox;
      let emit={event:this.bodyEmitter,value:this.selection.selected};
      this.emitMain.emit(emit);
      this.bodyEmitter=0;
  }
  refresh() {
    this.bodyEmitter = TableEmitter.BtnRefresh;
    let emit={event:this.bodyEmitter,value:null};
    this.emitMain.emit(emit);
    this.bodyEmitter=0;
  }
  send() {
    this.bodyEmitter = TableEmitter.BtnSend;
    let emit={event:this.bodyEmitter,value:this.selection.selected};
    this.emitMain.emit(emit);
    this.bodyEmitter=0;
    this.selection.clear();
  }
  excell() {
    this.bodyEmitter = TableEmitter.BtnExcell;
    let emit={event:this.bodyEmitter,value:null};
    this.emitMain.emit(emit);
    this.bodyEmitter=0;
  }

  add() {
    this.bodyEmitter = TableEmitter.BtnAdd;
    let emit={event:this.bodyEmitter,value:null};
    this.emitMain.emit(emit);
    this.bodyEmitter=0;
  }

  openRow(row) {
    this.bodyEmitter = TableEmitter.OpenRow;
    let emit={event:this.bodyEmitter,value:row};
    this.emitMain.emit(emit);
    this.bodyEmitter=0;
  }

  delete() {
    this.bodyEmitter = TableEmitter.BtnDelete;
    let emit={event:this.bodyEmitter,value:this.selection.selected};
    this.emitMain.emit(emit);
    this.bodyEmitter=0;
    this.selection.clear();
  }

  checkboxRow($event, row) {
    $event ? this.selection.toggle(row) : null;
    this.bodyEmitter = TableEmitter.Checkbox;
    let emit={event:this.bodyEmitter,value:this.selection.selected};
    this.emitMain.emit(emit);
    this.bodyEmitter=0;
  }

  edit($event,row){
    this.bodyEmitter = TableEmitter.iconEdit;
    let emit={event:this.bodyEmitter,value:row};
    this.emitMain.emit(emit);
  }

  applyFilters(filtersResult, entityName) {
    let result;
    const filters = filtersResult.filters;
    let entityFiltered: string[] = [];
    for (let filterName of filters) {
      
      if (filterName.checked) entityFiltered.push(filterName.name);
    }
    if (entityFiltered.length >= filters.length) {
      result = [];
    } else {
      if (entityFiltered.length > 0) {
        result = entityFiltered;
      } else {
        result = ["99999"];
      }
    }
    let data = { entityName: entityName, filters: result };
    this.bodyEmitter = TableEmitter.Filters;
    let emit={event:this.bodyEmitter,value:data};
    this.emitMain.emit(emit);
    this.bodyEmitter=0;
    this.selection.clear();
  }

  value(filed:any[]){
    if(Array.isArray(filed)){
      let data=[];
      data.push(this.dataSource);
      console.log(this.dataSource);
      data.forEach(element => {
        console.log(element.data.results);
        filed[0];
      });
    }else{
      console.log("Error: Table => field i not type Array string");
    }
    return "value";
  }


  uniqueDatesArray(listArray: Array<any>) {
    let uniquesArray = [];
    let counting = 0;
    let found = false;
    for (let i = 0; i < listArray.length; i++) {
      for (let y = 0; y < uniquesArray.length; y++) {
        if (listArray[i].name == uniquesArray[y].name) {
          found = true;
        }
      }
      counting++;
      if (counting == 1 && found == false) {
          uniquesArray.push(listArray[i]);
      }
      found = false;
      counting = 0;
    }
    return uniquesArray;
  }

}
