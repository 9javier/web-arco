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
  pagerValues = [50, 100, 1000];
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
        limit: 50
      })
  })
  columns: any;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  isFilteringOrder: number = 0;
  isFilteringWarehouse: number = 0;
  isFilteringDate: number = 0;
  lastUsedFilter: string = 'warehouses';
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
      // console.log(resp);
      this.filters = resp

    })
  }
  getList(body: OplTransportsModel.OrderExpeditionFilterRequest){
    this.intermediaryService.presentLoading();
    this.oplTransportsService.getList(body).subscribe(
      resp => {
        // console.log(resp);
        this.dataSource = resp.results;
        this.orders = this.dataSource.map(elem => {
          return {
            id: elem.id,
            name: elem.id
          }
        })
        this.updateFilterSourceWarehouses(this.orders)
        this.warehouses = this.dataSource.map(elem => {
          return {
            id: elem.shops.id,
            name: `${elem.shops.reference} - ${elem.shops.name}` 
          }
        })
        console.log(this.warehouses);
        
        this.updateFilterSourceWarehouses(this.warehouses)
        // console.log('dataSource',this.dataSource);
        
        const pagination = resp.pagination
        this.paginator.length = pagination.totalResults;
        this.paginator.lastPage = pagination.lastPage;
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
    this.warehouses = warehouses.map(warehouse => { 
      warehouse.id = warehouse.id  
      warehouse.name = warehouse.name;
      warehouse.value = warehouse.name;
      warehouse.checked = true;
      warehouse.hide = false;
      return warehouse;
    });
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
    }
    this.getList(this.form.value)
  }
  print(id) {
    this.intermediaryService.presentLoading()
    this.oplTransportsService.print(id).subscribe(
      resp => {
        this.intermediaryService.presentToastSuccess('Impresion realizada correctamente')
      }, 
      e => {
        this.intermediaryService.dismissLoading()
        this.intermediaryService.presentToastError('Ocurrio un error al imprimir')
      },
      () => {
        this.intermediaryService.dismissLoading()
        this.oplTransportsService.downloadPdf().subscribe(
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
   this.clearFilters()
   this.getList(this.form.value)
 }
}
