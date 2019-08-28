import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import {
  IntermediaryService,
  LabelsService,
  TariffService,
  TariffModel,
  WarehousesService
} from '@suite/services';

import { validators } from '../utils/validators';

import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'suite-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss']
})
export class TariffComponent implements OnInit {
  /**Arrays to be shown */
  tariffs: Array<any> = [];

  filters: FormGroup = this.formBuilder.group({
    warehouseId: 51
  });

  warehouses: Array<any> = [];

  /**Quantity of items for show in any page */
  pagerValues = [50, 100, 500];

  private page: number = 0;
  private limit: number = this.pagerValues[0];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['name', 'initDate', 'endDate', 'select'];
  dataSource: any;

  warehouseId: number = 49;

  /**form to select elements to print or for anything */
  selectedForm: FormGroup = this.formBuilder.group(
    {
      selector: false
    },
    {
      validators: validators.haveItems('toSelect')
    }
  );

  constructor(
    private intermediaryService: IntermediaryService,
    private formBuilder: FormBuilder,
    private tariffService: TariffService,
    private router: Router,
    private warehousesService: WarehousesService
  ) {}

  ngOnInit() {
    console.log(this.filters);
    this.filters.patchValue({ warehouseId: 1 });
    this.getWarehouses();
    this.getTariffs(this.page, this.limit, this.filters.value.warehouseId);
    this.listenChanges();
  }
  /**
   * filter the tariff by warehouse
   * @param event
   */
  filterByWarehouse(event) {
    this.warehouseId = event.detail.value;
    this.getTariffs(this.page, this.limit, this.filters.value.warehouseId);
  }

  listenChanges(): void {
    let previousPageSize = this.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.limit = page.pageSize;
      this.page = flag ? page.pageIndex + 1 : 1;
      this.getTariffs(this.page, this.limit, this.filters.value.warehouseId);
    });
  }

  /**
   * Go to product view
   * @param id - the id of the selected tariff
   */
  goPrices(id: number): void {
    let a: TariffModel.Tariff;
    this.router.navigate(['prices', id]);
  }

  getWarehouses(): void {
    this.warehousesService.getIndex().then(observable => {
      observable.subscribe(warehouses => {
        this.warehouses = warehouses.body.data;
      });
    });
  }

  /**
   * Get labels to show
   */
  getTariffs(page: number, limit: number, id: number = 49): void {
    this.intermediaryService.presentLoading();
    this.tariffService.getIndex(page, limit, id).subscribe(
      tariffs => {
        this.intermediaryService.dismissLoading();
        /**save the data and format the dates */
        this.tariffs = tariffs.results.map(result => {
          result.activeFrom = new Date(result.activeFrom).toLocaleDateString();
          result.activeTill = new Date(result.activeTill).toLocaleDateString();
          return result;
        });
        this.initSelectForm(this.tariffs);
        this.dataSource = new MatTableDataSource<any>(this.tariffs);
        let paginator = tariffs.pagination;
        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.page - 1;
      },
      () => {
        this.intermediaryService.dismissLoading();
      }
    );
  }

    /**
   * Cancel event and stop it propagation
   * @params e - the event to cancel
   */
  prevent(e):void{
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Update Enabled/Disabled the selected labels
   * @param items - Reference items to extract he ids
   */
  updateEnabled(items,warehouseId:number=49):void {
    let list = this.tariffs.map((item, i) => {
      let enabled = this.selectedForm.value.toSelect[i];
      
      let object = {
        warehouseId: items[i].warehouseId,
        tariffId: items[i].tariffId,
        enabled
      }

      return object;

    });

    console.log(list);
    this.intermediaryService.presentLoading("Modificando los seleccionados");
    this.tariffService.updateEnabled({elements:list}).subscribe(result => {
        this.intermediaryService.dismissLoading();
        this.listenChanges();
    },error=>{
      this.intermediaryService.dismissLoading();
      console.log(error);
    });

  }

  /**
   * Select or unselect all visible labels
   * @param event to check the status
   */
  selectAll(event):void{
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control=>{
      control.setValue(value);
    });
  }

  /**
   * Init selectForm controls
   * @param items - reference items for create the formControls
   */
  initSelectForm(items):void{  
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl(
      "toSelect", 
      this.formBuilder.array(items.map(item => new FormControl(Boolean(item.enabled))))
    );

    console.log('Init ', this.selectedForm.value);
    
  }
}
