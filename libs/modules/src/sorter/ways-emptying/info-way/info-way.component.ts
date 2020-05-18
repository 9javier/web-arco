import {Component, Input, OnInit} from '@angular/core';
import {Events} from "@ionic/angular";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";
import {WaySorterModel} from "../../../../../services/src/models/endpoints/WaySorter";
import {SorterOutputService} from "../../../../../services/src/lib/endpoint/sorter-output/sorter-output.service";
import {SorterOutputModel} from "../../../../../services/src/models/endpoints/SorterOutput";
import {ProductSorterModel} from "../../../../../services/src/models/endpoints/ProductSorter";
import {IntermediaryService} from "@suite/services";

@Component({
  selector: 'sorter-info-way-emptying',
  templateUrl: './info-way.component.html',
  styleUrls: ['./info-way.component.scss']
})
export class SorterInfoWayEmptyingComponent implements OnInit {

  @Input() height: string = null;
  @Input() width: string = null;

  public way: WaySorterModel.WaySorter = null;
  public destinyWarehouse: string = null;
  public listProducts: SorterOutputModel.ProductInSorterWithIncidence[] = [];
  public listPackages = []; 
  public isLoadingData: boolean = false;
  public wayWithIncidences: boolean = false;

  constructor(
    private events: Events,
    private sorterOutputService: SorterOutputService,
    private intermediaryService: IntermediaryService,
    private sorterProvider: SorterProvider
  ) {
    this.sorterProvider.idZoneSelected = null;
  }

  ngOnInit() {
    this.way = null;
    this.destinyWarehouse = null;
    this.listProducts = [];
    this.listPackages = [];
    this.isLoadingData = false;
  }

  public newWaySelected(way: WaySorterModel.WaySorter) {
    this.isLoadingData = true;
    this.way = way;
    this.sorterOutputService
      .postGetProductsByWay({ wayId: way.id })
      .then(async (res: SorterOutputModel.ResponseGetProductsByWay) => {
        if (res.code == 200) {
          let resData = res.data;
          this.destinyWarehouse = resData.warehouse ? `${resData.warehouse.reference} ${resData.warehouse.name}` : 'NO ASIGNADO';
          this.listProducts = resData.products || [];
          this.listPackages = resData.packages || [];
          this.wayWithIncidences = resData.with_incidences;
          this.isLoadingData = false;
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar cargar la información de la calle.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          this.isLoadingData = false;
          await this.intermediaryService.presentToastError(errorMessage);
        }
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar cargar la información de la calle.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        this.isLoadingData = false;
        await this.intermediaryService.presentToastError(errorMessage);
      })
      .catch(async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar cargar la información de la calle.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        this.isLoadingData = false;
        await this.intermediaryService.presentToastError(errorMessage);
      });
  }
}
