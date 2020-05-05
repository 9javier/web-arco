import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IntermediaryService } from '../../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { OplTransportsService } from '../../../../services/src/lib/endpoint/opl-transports/opl-transports.service';
import { OplTransportsModel } from '../../../../services/src/models/endpoints/opl-transports.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MatTableDataSource, MatSort, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PackagesComponent } from '../packages/packages.component';
import { TagsInputOption } from '../../components/tags-input/models/tags-input-option.model';
import { environment } from '../../../../services/src/environments/environment';
import { saveAs } from "file-saver";
import { formatDate } from '@angular/common';
import * as moment from 'moment';
@Component({
  selector: 'suite-order-package',
  templateUrl: './order-package.component.html',
  styleUrls: ['./order-package.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderPackageComponent implements OnInit {
  @Input('id') id: number;
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  // @ViewChild(MatSort) sort: MatSort;
  filters: OplTransportsModel.OrderExpeditionFilters

  displayedColumns: string[] = [
    'expedition',
    'barcode',
    'package',
  ];
  pagerValues = [20, 80, 100];
  pauseListenFormChange: boolean;
  selection = new SelectionModel<any>(true, []);
  form: FormGroup = this.formBuilder.group({
    expeditions: [[]],
    orders: [[]],
    date: [[]],
    warehouses: [[]],
    transports: [[]],
    orderby: this.formBuilder.group({
      type: 1,
      order: "asc"
    }),
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    })
  })

  orderByOrden: boolean
  orderByWarehouse: boolean
  orderByDate: boolean


  columns: any;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  isFilteringOrder: number = 0;
  isFilteringWarehouse: number = 0;
  isFilteringDate: number = 0;
  lastUsedFilter: string;
  isApplyFilter:boolean = false;
  isApplyPagination:boolean = false;
  lastOrder = [true, true, true];

  orders: Array<TagsInputOption> = [];
  warehouses: Array<TagsInputOption> = [];
  dates: Array<TagsInputOption> = [];
  dataSource: any;
  constructor(
    private intermediaryService: IntermediaryService,
    private oplTransportsService: OplTransportsService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,

  ) { }

  ngOnInit() {
    this.form.patchValue({
      transports: [this.id]
    })
    this.getFilters();
    this.getList(this.form.value);
    this.listenChanges();
  }

  getFilters() {
    this.oplTransportsService.getFilters().subscribe((resp: OplTransportsModel.OrderExpeditionFilters) => {
      this.filters = resp

    })
  }

getFiltersWarehouse(){
  this.dataSource.shops
}

  getList(body: OplTransportsModel.OrderExpeditionFilterRequest) {
    this.intermediaryService.presentLoading();
    this.oplTransportsService.getList(body).subscribe(
      resp => {
        console.log(resp);
        this.dataSource = resp.results;
        if(this.isApplyFilter == false){
          this.orders = this.dataSource.map(elem => {
            return {
              id: elem.id,
              name: elem.id
            } 
          })
          this.updateFilterOrders(this.orders)
          let whsTemp = this.dataSource.map(elem => {      
              return {
                id: elem.shops.id,
                name: `${elem.shops.reference} - ${elem.shops.name}`
              }
          });
         this.warehouses = this.uniqueArray(whsTemp);
          this.updateFilterSourceWarehouses(this.warehouses)
  
          let datesTemp = this.dataSource.map(elem => {
            return {
              name: elem.date
            }
          });
    
          this.dates = this.uniqueDatesArray(datesTemp);
          this.updateFilterDates(this.dates);
        }
        this.isApplyFilter = false;
        if(this.isApplyPagination == false){
          const pagination = resp.pagination;
          this.paginator.length = pagination.totalResults;
          this.paginator.lastPage = pagination.lastPage;
        }
        this.isApplyPagination = false;
        
        this.intermediaryService.dismissLoading()
      },
      e => {
        this.intermediaryService.presentToastError('Ocurrio un error al cargar el listado')
        this.intermediaryService.dismissLoading()
      },
      () => {
        this.intermediaryService.dismissLoading()
      }
    )
  }
  clearFilters() {
    this.form = this.formBuilder.group({
      expeditions: [[]],
      orders: [[]],
      date: [[]],
      warehouses: [[]],
      transports: [[]],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      }),
      pagination: this.formBuilder.group({
        page: 1,
        limit: 50
      })
    })
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  async sortData(event: Sort) {
    this.form.value.orderby.type = this.columns[event.active];
    this.form.value.orderby.order = event.direction !== '' ? event.direction : 'asc';

    this.getList(this.form.value);
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
      this.isApplyPagination = true;
      this.getList(this.form.value)
    });

  }

  async presentModal(packages) {
    console.log(packages);

    const modal = await this.modalController.create({
      component: PackagesComponent,
      componentProps: { packages }
    });

    await modal.present();

  }
  sort(column: string) {
    for (let i = 0; i < document.getElementsByClassName('title').length; i++) {
      let iColumn = document.getElementsByClassName('title')[i] as HTMLElement;
      if (iColumn.innerHTML.includes('🡇') || iColumn.innerHTML.includes('🡅')) {
        iColumn.innerHTML = iColumn.innerHTML.slice(0, -2);
      }
    }

    switch (column) {
      case 'order': {
        if (this.lastOrder[0]) {
          this.form.value.orderby = { order: "desc", type: 5 };
        }
        else {
          this.form.value.orderby = { order: "asc", type: 5 };
        }
        this.lastOrder[0] = !this.lastOrder[0];
        break;
      }
      case 'warehouse': {
        if (this.lastOrder[1]) {
          this.form.value.orderby = { order: "desc", type: 3 };
        }
        else {
          this.form.value.orderby = { order: "asc", type: 3 };
        }
        this.lastOrder[1] = !this.lastOrder[1];
        break;
      }
      case 'date': {
        if (this.lastOrder[2]) {
          this.form.value.orderby = { order: "desc", type: 1 };
        }
        else {
          this.form.value.orderby = { order: "asc", type: 1 };
        }
        this.lastOrder[2] = !this.lastOrder[2];
        break;
      }

    }
    this.getList(this.form.value)
  }


  private updateFilterSourceWarehouses(warehouses: Array<any>) {
    this.pauseListenFormChange = true;
    let value = this.form.get("warehouses").value;
    this.warehouses = warehouses ? warehouses.map(warehouse => {
      warehouse.id = warehouse.id
      warehouse.name = warehouse.name;
      warehouse.value = warehouse.name;
      warehouse.checked = true;
      warehouse.hide = false;
      return warehouse;
    }): [];
    if (value && value.length) {
      this.form.get("warehouses").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }
  private updateFilterOrders(orders: Array<any>) {
  
    this.pauseListenFormChange = true;
    let value = this.form.get("orders").value;
    this.orders = <any>orders.map(order => {
      order.id = order.id
      order.name = order.name;
      order.value = order.id;
      order.checked = true;
      order.hide = false;
      return order;
    });
    // console.log(this.orders);

    if (value && value.length) {
      this.form.get("orders").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }
  formatDate(data: string): string {
    const date = new Date(data);
    const day = date.getDate()
    let month: any = date.getMonth() + 1
    if (month < 10) {
      month = `0${month}`
    }
    const year = date.getFullYear()
    const formatedDate = `${day}-${month}-${year}`
    return formatedDate
  }
  private updateFilterDates(dates: Array<any>) {
    this.pauseListenFormChange = true;
    let value = this.form.get("date").value;
    this.dates = <any>dates.map(date => {
      date.id = date.name
      date.name = this.formatDate(date.name)
      date.value = date.name;
      date.checked = true;
      date.hide = false;
      return date;
    });
    // console.log(this.orders);

    if (value && value.length) {
      this.form.get("orders").patchValue(value, { emitEvent: false });
    }
    setTimeout(() => { this.pauseListenFormChange = false; }, 0);
  }

  applyFilters(filtersResult, filterType) {
    const filters = filtersResult.filters;
    switch (filterType) {
      case 'orders':
        let orderFiltered: number[] = [];
        for (let orders of filters) {
          if (orders.checked) orderFiltered.push(orders.id);
        }
        if (orderFiltered.length >= this.orders.length) {
          this.form.value.orders = [];
          this.isFilteringOrder = this.orders.length;
        } else {
          if (orderFiltered.length > 0) {
            this.form.value.orders = orderFiltered;
            this.isFilteringOrder = orderFiltered.length;
          } else {
            this.form.value.orders = [99999];
            this.isFilteringOrder = this.orders.length;
          }
        }
        break;
      case 'warehouses':
        let warehousesFiltered: number[] = [];
        for (let warehouse of filters) {
          if (warehouse.checked) warehousesFiltered.push(warehouse.id);
        }
        if (warehousesFiltered.length >= this.warehouses.length) {
          this.form.value.warehouses = [];
          this.isFilteringWarehouse = this.warehouses.length;
        } else {
          if (warehousesFiltered.length > 0) {
            this.form.value.warehouses = warehousesFiltered;
            this.isFilteringWarehouse = warehousesFiltered.length;
          } else {
            this.form.value.warehouses = [99999];
            this.isFilteringWarehouse = this.warehouses.length;
          }
        }
        break;
      case 'dates':
        let datesFiltered: string[] = [];

        for (let date of filters) {
        let data = moment(date.id).format('YYYY-MM-DD');
          if (date.checked) datesFiltered.push(data);
        }
        if (datesFiltered.length >= this.dates.length) {
          this.form.value.date = [];
          this.isFilteringDate = this.dates.length;
        } else {
          if (datesFiltered.length > 0) {
            this.form.value.date = datesFiltered;
            this.isFilteringDate = datesFiltered.length;
          } else {
            this.form.value.date = ["2090-11-03"];
            this.isFilteringDate = this.dates.length;
          }
        }
        break;

    }
    this.lastUsedFilter = filterType;
    this.isApplyFilter = true;
    this.getList(this.form.value)
  }
  print(id) {
    this.intermediaryService.presentLoading()
    this.oplTransportsService.print(id).subscribe(
      resp => {
        console.log(resp);

        this.intermediaryService.presentToastSuccess('Impresion realizada correctamente')
      },
      e => {
        this.intermediaryService.dismissLoading()
        this.intermediaryService.presentToastError('Ocurrio un error al imprimir')
      },
      () => {
        this.oplTransportsService.downloadPdfTransortOrders(id).subscribe(
          resp => {
            console.log(resp);
            const blob = new Blob([resp], { type: 'application/pdf' });
            saveAs(blob, 'documento.pdf')
          },
          e => {
            console.log(e.error.text);
          },
          () => {
            this.intermediaryService.dismissLoading()

          }
        )

      }
    );
  }
  refresh(transportId: number) {
    this.clearFilters()
    this.form.patchValue({
      transports: [transportId]
    })
    this.getList(this.form.value)
  }

  setOrder(data:boolean) {
    let order: string;
    if (data) {
      order = 'asc';
    } else {
      order = 'desc';
    }
    return order
  }

  setOrderByOrden(){
    const type = 5;
    let order: string;
    this.orderByOrden = !this.orderByOrden;
    order = this.setOrder(this.orderByOrden)
    this.form.patchValue({
      orderby: {
        type,
        order
      },
    })
    this.getList(this.form.value)
  }
  setOrderByWarehouse(){
    const type: number = 3;
    let order
    this.orderByOrden = !this.orderByOrden;
    order = this.setOrder(this.orderByWarehouse)
    this.form.patchValue({
      orderby: {
        type,
        order
      },
    })
    this.getList(this.form.value)
  }
  setOrderByDate(){
    const type: number = 1;
    let order
    this.orderByDate = !this.orderByDate;
    order = this.setOrder(this.orderByDate)
    this.form.patchValue({
      orderby: {
        type,
        order
      },
    })
    this.getList(this.form.value)
  }

  uniqueArray(listArray: Array<any>) {
    let uniquesArray = [];
    let counting = 0;
    let found = false;

    for (let i = 0; i < listArray.length; i++) {
      for (let y = 0; y < uniquesArray.length; y++) {
        if (listArray[i].id == uniquesArray[y].id) {
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
