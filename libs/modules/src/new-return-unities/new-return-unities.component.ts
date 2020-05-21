import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ReturnService} from "../../../services/src/lib/endpoint/return/return.service";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import {ProductsComponent} from "./products/products.component";
import {DefectiveProductsComponent} from "./defective-products/defective-products.component";
import {MatPaginator} from "@angular/material/paginator";
import {IntermediaryService} from "@suite/services";
import {TimesToastType} from "../../../services/src/models/timesToastType";

@Component({
  selector: 'new-return-unities',
  templateUrl: './new-return-unities.component.html',
  styleUrls: ['./new-return-unities.component.scss']
})
export class NewReturnUnitiesComponent implements OnInit {

  @ViewChild(MatPaginator) tPaginator: MatPaginator;
  @ViewChild(ProductsComponent) productsList: ProductsComponent;
  @ViewChild(DefectiveProductsComponent) defectiveProductsList: DefectiveProductsComponent;

  private returnId: number = null;

  private isLoadingData: boolean = false;

  private isDefective: boolean = false;
  private warehouseId: number = null;
  private providerId: number = null;
  private brandIds: number[] = [];

  private pagerValues: number[] = [10, 20, 50];

  private filters: any = {
    pagination: {
      limit: this.pagerValues[0],
      page: 0
    }
  };

  private resultsDefective: ReturnModel.GetDefectiveProductsResults[] = null;
  private results: ReturnModel.GetProducts[] = null;

  public itemsSelected: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private returnService: ReturnService,
    private intermediaryService: IntermediaryService
  ) {}

  ngOnInit() {
    this.returnId = parseInt(this.route.snapshot.paramMap.get('id'));

    const defectiveParam = this.route.snapshot.queryParamMap.get('defective');
    const warehouseParam =  this.route.snapshot.queryParamMap.get('warehouse');
    const providerParam =  this.route.snapshot.queryParamMap.get('provider');
    const brandsParam =  this.route.snapshot.queryParamMap.get('brands');

    if (defectiveParam && defectiveParam === 'true') {
      this.isDefective = true;
    }
    this.warehouseId = parseInt(warehouseParam);
    this.providerId = parseInt(providerParam);
    this.brandIds = brandsParam.split(',').map(b => parseInt(b));

    this.tPaginator.pageSizeOptions = this.pagerValues;
    this.subscribes();
    this.loadItems();
  }

  private subscribes() {
    this.tPaginator.page.subscribe(paginator => {
      this.filters.pagination = {
        limit: paginator.pageSize,
        page: paginator.pageIndex
      };
      this.loadItems();
    });
  }

  private loadItems() {
    this.isLoadingData = true;

    const params = {
      warehouse: this.warehouseId,
      provider: this.providerId,
      brands: this.brandIds,
      filters: this.filters
    };
    if (this.isDefective) {
      this.returnService
        .postGetDefectiveProducts(params)
        .subscribe((res) => {
          if (res.code == 200) {
            this.resultsDefective = res.data.products.results;
            this.tPaginator.length = res.data.count;
            this.defectiveProductsList.loadItems(this.resultsDefective);
            this.itemsSelected = false;
          }
        }, (error) => {}, () => this.isLoadingData = false);
    } else {
      this.returnService
        .postGetProducts(params)
        .subscribe((res) => {
          if (res.code == 200) {
            this.results = res.data.results;
            this.tPaginator.length = res.data.count;
            this.productsList.loadItems(this.results);
            this.itemsSelected = false;
            this.isLoadingData = false;
          }
        }, (error) => {}, () => this.isLoadingData = false);
    }
  }

  public async assignSelectedItems() {
    await this.intermediaryService.presentLoadingNew('Asignando productos a la devolución...');

    if (this.isDefective) {
      const selectedItems = this.defectiveProductsList.getSelectedItems();
      const itemsToReturn = selectedItems.map(i => {
        return {
          product: i.product.id
        }
      });

      this.returnService
        .postAssignDefectiveProducts({
          returnId: this.returnId,
          itemsToReturn
        })
        .subscribe((res) => {
          if (res.code == 201) {
            this.intermediaryService.presentToastSuccess('Reservados los productos para devolver.', TimesToastType.DURATION_SUCCESS_TOAST_3750);
          } else {
            this.intermediaryService.presentToastError('Ha ocurrido un error al reservar los productos para devolver.', TimesToastType.DURATION_ERROR_TOAST);
          }
        }, (error) => {
          this.intermediaryService.presentToastError('Ha ocurrido un error al reservar los productos para devolver.', TimesToastType.DURATION_ERROR_TOAST);
        }, () => this.intermediaryService.dismissLoadingNew());

    } else {
      const selectedItems = this.productsList.getSelectedItems();
      const itemsToReturn = selectedItems.map(i => {
        return {
          model: i.model.id,
          size: i.size.id,
          unities: i.unities
        }
      });

      this.returnService
        .postAssignProducts({
          returnId: this.returnId,
          itemsToReturn
        })
        .subscribe((res) => {
          if (res.code == 201) {
            this.intermediaryService.presentToastSuccess('Asignada la cantidad de artículos para devolver.', TimesToastType.DURATION_SUCCESS_TOAST_3750);
          } else {
            this.intermediaryService.presentToastError('Ha ocurrido un error al asignar los artículos para devolver.', TimesToastType.DURATION_ERROR_TOAST);
          }
        }, (error) => {
          this.intermediaryService.presentToastError('Ha ocurrido un error al asignar los artículos para devolver.', TimesToastType.DURATION_ERROR_TOAST);
        }, () => this.intermediaryService.dismissLoadingNew());
    }
  }

  public reload() {
    this.loadItems();
  }

  public changeInItemsSelected(itemsSelected: boolean) {
    this.itemsSelected = itemsSelected;
  }
}
