import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent, MatTableDataSource } from '@angular/material';
import { AlertController, ModalController } from '@ionic/angular';
import * as _ from 'lodash';

import { IntermediaryService, TariffModel, TariffService, WarehousesService } from '@suite/services';

import { validators } from '../utils/validators';

import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { TariffUpdateFilterPriceComponent } from './tariff-update-filter-price/tariff-update-filter-price.component';
import { formatDate } from '@angular/common';

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
  newTariff: number;
  warehouses: Array<any> = [];
  /**Quantity of items for show in any page */
  pagerValues = [50, 100, 500];

  private page: number = 0;
  private limit: number = this.pagerValues[0];
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['avelonId', 'name', 'initDate', 'endDate', 'select'];
  dataSource: any;

  warehouseId: number = 49;

  processing: boolean;
  tarifProcessing: any;
  isRefreshCalc: any;

  /**form to select elements to print or for anything */
  selectedForm: FormGroup = this.formBuilder.group(
    {
      selector: false
    },
    {
      validators: validators.haveItems('toSelect')
    }
  );

  intervalIsCalculation = null;

  constructor(
    private intermediaryService: IntermediaryService,
    private formBuilder: FormBuilder,
    private tariffService: TariffService,
    private router: Router,
    private warehousesService: WarehousesService,
    private alertController: AlertController,
    private modalCtrl: ModalController,
  ) {
    this.processing = false;
    this.isRefreshCalc = false;
  }

  ngOnInit() {
    this.filters.patchValue({ warehouseId: 1 });
    this.getWarehouses();
    this.tariffService.getIsCalculating().subscribe(
      data => {
        this.processing = data.isCalculating;
        this.tarifProcessing = (data.tariff) ? data.tariff : null;
        if (this.processing) {
          this.isRefreshCalc = true;
        }
        this.getTariffs(this.page, this.limit, this.filters.value.warehouseId);
        this.listenChanges();
        if (!this.intervalIsCalculation) {
          this.intervalIsCalculation = setInterval(() => { this.isCalculating() }, 10000);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.intervalIsCalculation) {
      clearInterval(this.intervalIsCalculation);
      this.intervalIsCalculation = null;
    }
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
      this.intermediaryService.dismissLoading();
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.limit = page.pageSize;
      this.page = flag ? page.pageIndex : 1;
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
      data => {
        this.intermediaryService.dismissLoading();
        /**save the data and format the dates */
        this.tariffs = data.results.map(result => {
          result.activeFrom = result.activeFrom;
          result.activeTill = result.activeTill;
          return result;
        });
        this.initSelectForm(this.tariffs);
        this.dataSource = new MatTableDataSource<any>(this.tariffs);
        this.paginator.length = data && data.pagination ? data.pagination.totalResults : 0;
        this.paginator.pageIndex = data && data.pagination ? data.pagination.selectPage : 1;
        this.paginator.lastPage = data && data.pagination ? data.pagination.lastPage : 1;
      },
      () => {
        this.intermediaryService.dismissLoading();
      }
    );
  }


  isCalculating(): void {

    this.tariffService.getIsCalculating().subscribe(
      data => {
        this.intermediaryService.dismissLoading();
        this.processing = data.isCalculating;
        this.tarifProcessing = (data.tariff) ? data.tariff : null;
        if (!this.processing) {
          this.newTariff = 0;
          if (this.isRefreshCalc) {
            this.getTariffs(this.page, this.limit, this.filters.value.warehouseId);
            this.isRefreshCalc = false;
          }
          this.listenChanges();

        } else {
        }

      },
      () => {
        this.processing = true;
        this.intermediaryService.dismissLoading();
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
  updateEnabled(): void {
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
      this.intermediaryService.dismissLoading();
    });


  }

  async startSync() {

    let alertConfirm = await this.alertController.create({
      header: 'Atención',
      message: 'Va a ejecutarse la actualización de tarifas. ¿Está seguro?',
      buttons: [
        'Cancelar',
        {
          text: 'Confirmar',
          handler: () => {
            this.intermediaryService.presentLoading("Modificando los seleccionados");
            this.dataSource = [];
            this.tariffService.syncTariff().subscribe(result => {
              this.intermediaryService.dismissLoading();
              this.isRefreshCalc = true;
              this.listenChanges();
              this.isCalculating();
            }, error => {
              //this.isRefreshCalc = false;
              this.intermediaryService.dismissLoading();
            }, () => {
              //this.isRefreshCalc = false;
              this.tariffsUpdate = [];
              //this.getTariffs(this.page, this.limit, this.filters.value.warehouseId);
              this.isCalculating();
              this.intermediaryService.dismissLoading();
            });
          }
        }
      ]
    });

    await alertConfirm.present();
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

  async selectWarehouse(event, tariff) {
    event.stopPropagation();
    event.preventDefault();
    let modal = (await this.modalCtrl.create({
      component: TariffUpdateFilterPriceComponent,
      componentProps: {
        tariff: tariff
      }
    }))
    modal.onDidDismiss().then(() => {
      // reload table.
    })
    modal.present();
  }

  getDate(date: any) {
    return new Date(date);
  }

  getDateISO(date: any) {
    return new Date(date).toISOString();
  }

  changeDateStart(event: MatDatepickerInputEvent<Date>, tariff: any) {
    tariff.activeFrom = event.value;

    let object = {
      id: tariff.id,
      enabled: tariff.enabled,
      activeFromChange: tariff.activeFrom
    };
    this.tariffsUpdate.push(object);
  }

  changeDateEnd(event: MatDatepickerInputEvent<Date>, tariff: any) {
    tariff.activeTill = event.value;

    let object = {
      id: tariff.id,
      enabled: tariff.enabled,
      activeTillChange: tariff.activeTill
    };
    this.tariffsUpdate.push(object);
  }

  getTooltipFromChange(tariff: any) {
    if (tariff && tariff.change && tariff.activeFromChange) {
      const date = formatDate(new Date(tariff.activeFromChange), 'dd/MM/yyyy', 'es');
      return `Fecha Avelon: ${date}`;
    }

    return;
  }

  getTooltipTillChange(tariff: any) {
    if (tariff && tariff.change && tariff.activeTillChange) {
      const date = formatDate(new Date(tariff.activeTillChange), 'dd/MM/yyyy', 'es');
      return `Fecha Avelon: ${date}`;
    }

    return;
  }
}
