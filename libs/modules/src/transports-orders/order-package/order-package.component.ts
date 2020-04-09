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
  @ViewChild(MatSort) sort: MatSort;
  filters: OplTransportsModel.OrderExpeditionFilters
  displayedColumns: string[] = [
    'expedition', 
    'warehouse', 
    'transport', 
    'order',
    'print'
  ];
  dataSource: any 
  pagerValues = [50, 100, 1000];
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
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
      console.log(resp);
      this.filters = resp
    })
  }
  getList(body: OplTransportsModel.OrderExpeditionFilterRequest){
    this.intermediaryService.presentLoading();
    this.oplTransportsService.getList(body).subscribe(
      resp => {
        console.log(resp);
        this.dataSource = resp.results;
        const pagination = resp.pagination
        this.paginator.length = pagination.totalResults;
        this.paginator.lastPage = pagination.lastPage;
      
      },
      e => {
        this.intermediaryService.presentToastError('Ocurrio un error al cargar el listaso')
        this.intermediaryService.dismissLoading()
      }, 
      () => {
        this.intermediaryService.dismissLoading()
      }
    )
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
    const modal = await this.modalController.create({
    component: PackagesComponent,
    componentProps: { packages }
    });
  
    await modal.present();
  
  }
}
