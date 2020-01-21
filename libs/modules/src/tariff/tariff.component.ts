import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import * as _ from 'lodash';

import {
  IntermediaryService,
  LabelsService,
  TariffService,
  TariffModel,
  WarehousesService
} from '@suite/services';

import { validators } from '../utils/validators';

import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import {SortModel} from "../../../services/src/models/endpoints/Sort";
import { PaginatorComponent } from '../components/paginator/paginator.component';
import {LocalStorageProvider} from "../../../services/src/providers/local-storage/local-storage.provider";

@Component({
  selector: 'suite-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss']
})
export class TariffComponent implements OnInit {
  /**Arrays to be shown */
  tariffs: Array<any> = [];
  tariffsUpdate: Array<any> = [];

  filters: FormGroup = this.formBuilder.group({
    warehouseId: 51
  });

  warehouses: Array<any> = [];

  /**Quantity of items for show in any page */
  pagerValues = [50, 100, 500];

    private page:number = 1;
    private limit:number = this.pagerValues[0];
    private sortValues: SortModel.Sort = { field: null, type: null };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;


    displayedColumns: string[] = ['name', 'initDate', 'endDate', 'quantity', 'select'];
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
    private warehousesService: WarehousesService,
    private localStorageProvider: LocalStorageProvider
  ) {}

  ngOnInit() {
    this.filters.patchValue({ warehouseId: 1 });
    this.getWarehouses();
    this.getTariffs(this.page, this.limit, this.sortValues);
    this.listenChanges();
  }
  /**
   * filter the tariff by warehouse
   * @param event
   */
  filterByWarehouse(event) {
    this.warehouseId = event.detail.value;
    this.getTariffs(this.page, this.limit, this.sortValues);
  }

  listenChanges(): void {
    let previousPageSize = this.limit;
    /**detect changes in the paginator */
    this.paginatorComponent.page.subscribe(page => {
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.limit = page.pageSize;
      this.page = flag?page.pageIndex:1;
      this.getTariffs(this.page, this.limit, this.sortValues);
    });
  }

  /**
   * Go to product view
   * @param id - the id of the selected tariff
   */
  goPrices(row: any): void {
    let a: TariffModel.Tariff;
    for(let iData of this.dataSource.data){
      if(iData.tariffId == id){
        this.localStorageProvider.set('tariffName',iData.tariffName);
        break;
      }
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        name: JSON.stringify(row.tariffName)
      }
    };
    this.router.navigate(['prices', row.tariffId], navigationExtras);
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
  getTariffs(selectPage: number, limit: number, sort: SortModel.Sort) {
    this.intermediaryService.presentLoading();
    this.tariffService.getIndex(selectPage, limit, sort).subscribe(tariffs=>{
      this.intermediaryService.dismissLoading();
      /** consult updates tariffs */
      var temp = tariffs.results.map(r => r.tariffId);
      var ids: any = [];
      temp.forEach(item => {
        ids.push({
          tariffId: item
        })
      });
      this.tariffService.getTariffUpdates(ids).subscribe(updates=>{
        this.intermediaryService.dismissLoading();
        /**save the data and format the dates */
        this.tariffs = tariffs.results.map(result=>{
          result.activeFrom = new Date(result.activeFrom).toLocaleDateString();
          result.activeTill = new Date(result.activeTill).toLocaleDateString();

          return result;
        });

        this.tariffs.forEach(item => {
          updates.results.forEach(r => {
            if(r.id === item.tariffId){
              item.updated = r.updated;
            }
          });
        });

        this.dataSource = new MatTableDataSource<any>(this.tariffs);
        let paginator = tariffs.pagination;
        this.paginatorComponent.length = paginator.totalResults;
        this.paginatorComponent.pageIndex = paginator.selectPage;
        this.paginatorComponent.lastPage = paginator.lastPage;
      },()=>{
        this.intermediaryService.dismissLoading();
      })

    },()=>{
      this.intermediaryService.dismissLoading();
    })
  }

  sortData(event) {
    if (event.direction == '') {
      this.sortValues = { field: null, type: null };
    } else {
      this.sortValues = { field: event.active.toLowerCase(), type: event.direction.toLowerCase() };
    }
    this.getTariffs(this.page,this.limit, this.sortValues);
  }

  /**
   * Cancel event and stop it propagation
   * @params e - the event to cancel
   */
  prevent(e):void{
    e.preventDefault();
    e.stopPropagation();
  }

  // changeCheckBox(i) {

  // }

  onChecked(i, event) {
    let tariff: any = this.tariffs[i];

    let exist = _.find(this.tariffsUpdate, {'position': i});

    if(exist) {
      _.remove(this.tariffsUpdate, function(n) {
        return n.position == i;
      });
    } else {
      if(tariff.enabled != event) {
        let object = {
          position: i,
          warehouseId: tariff.warehouseId,
          tariffId: tariff.tariffId,
          enabled: event
        }
        this.tariffsUpdate.push(object);
      }
    }

  }

  /**
   * Update Enabled/Disabled the selected labels
   * @param items - Reference items to extract he ids
   */
  updateEnabled(warehouseId:number=49):void {
    // let list = this.tariffs.map((item, i) => {
    //   let enabled = this.selectedForm.value.toSelect[i];

    //   let object = {
    //     warehouseId: items[i].warehouseId,
    //     tariffId: items[i].tariffId,
    //     enabled
    //   }

    //   return object;

    // });

    this.intermediaryService.presentLoading("Modificando los seleccionados");
    this.tariffService.updateEnabled({elements:this.tariffsUpdate}).subscribe(result => {
      this.intermediaryService.dismissLoading();
      this.listenChanges();
    },error=>{
      this.intermediaryService.dismissLoading();
    });

  }

  /**
   * Select or unselect all visible labels
   * @param event to check the status
   */
  selectAll(event):void{
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach((control, i)=>{
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


  }

  get existTariffsToUpdate() {
    return this.tariffsUpdate.length > 0;
  }
}
