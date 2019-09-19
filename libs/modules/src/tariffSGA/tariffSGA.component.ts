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
import { Router } from '@angular/router';

@Component({
  selector: 'suite-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss']
})
export class TariffSGAComponent implements OnInit {
  /**Arrays to be shown */
  tariffs: Array<any> = [];
  tariffsUpdate: Array<any> = [];
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

  processing: boolean;

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
  ) {
    this.processing = true;
  }

  ngOnInit() {
    this.filters.patchValue({ warehouseId: 1 });
    this.getWarehouses();
    this.getTariffs(this.page, this.limit, this.filters.value.warehouseId);
    this.listenChanges();
    this.isCalculating();
    setInterval(() => { this.isCalculating() }, 10000);


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
    this.tariffService.getTariffIfSoftdelete().subscribe(
      tariffs => {
        this.intermediaryService.dismissLoading();
        /**save the data and format the dates */
        this.tariffs = tariffs.map(result => {
          result.activeFrom = new Date(result.activeFrom).toLocaleDateString();
          result.activeTill = new Date(result.activeTill).toLocaleDateString();
          return result;
        });
        this.initSelectForm(this.tariffs);
        this.dataSource = new MatTableDataSource<any>(this.tariffs);
        let paginator = 1;
        this.paginator.length = 2;
        this.paginator.pageIndex = 0;
      },
      () => {
        this.intermediaryService.dismissLoading();
      }
    );
  }


  isCalculating(): void {
    this.tariffService.getIsCalculating().subscribe(
      data => {
        this.processing = data.isCalculating;
        if (!this.processing) {
          this.listenChanges()
        }
      },
      () => {
        this.processing = true;
      }
    );
  }

  /**
 * Cancel event and stop it propagation
 * @params e - the event to cancel
 */
  prevent(e): void {
    e.preventDefault();
    e.stopPropagation();
  }

  onChecked(i, event) {
    var state = event;
    let tariff: any = this.tariffs[i];

    let exist = _.find(this.tariffsUpdate, { 'position': i });

    if (exist) {
      _.remove(this.tariffsUpdate, function (n) {
        return n.position == i;
      });
    }
    else {
      if (!tariff.enabled === event) {
        let object = {
          //position: i,
          //warehouseId: tariff.warehouseId,
          id: tariff.id,
          enabled: state
        }
        this.tariffsUpdate.push(object);
      }
      else {
        let object = {
          //position: i,
          //warehouseId: tariff.warehouseId,
          id: tariff.id,
          enabled: state
        }
        for (let i = 0; i < this.tariffsUpdate.length; i++) {
          const element = this.tariffsUpdate[i];
          if (this.tariffsUpdate[i].id == object.id) {
            this.tariffsUpdate.splice(i);
            return false;
          }
        }
      }

    }
  }

  /**
   * Update Enabled/Disabled the selected labels
   * @param items - Reference items to extract he ids
   */
  updateEnabled(warehouseId: number = 49): void {
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
    this.tariffService.updateEnabled(this.tariffsUpdate).subscribe(result => {
      this.intermediaryService.dismissLoading();
      this.listenChanges();
      this.isCalculating();
    }, error => {
      this.intermediaryService.dismissLoading();
    }, () => {
      this.tariffsUpdate = [];
      this.getTariffs(this.page, this.limit, this.filters.value.warehouseId);
      this.isCalculating();
    });


  }

  /**
   * Select or unselect all visible labels
   * @param event to check the status
   */
  selectAll(event): void {
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach((control, i) => {
      control.setValue(value);
    });
  }

  /**
   * Init selectForm controls
   * @param items - reference items for create the formControls
   */
  initSelectForm(items): void {
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
