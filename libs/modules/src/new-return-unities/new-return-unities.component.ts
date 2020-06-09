import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ReturnService} from "../../../services/src/lib/endpoint/return/return.service";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import {ProductsComponent} from "./products/products.component";
import {DefectiveProductsComponent} from "./defective-products/defective-products.component";
import {MatPaginator} from "@angular/material/paginator";
import {IntermediaryService} from "../../../services/src/lib/endpoint/intermediary/intermediary.service";
import {TimesToastType} from "../../../services/src/models/timesToastType";
import {Location} from "@angular/common";

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

  isLoadingData: boolean = false;

  isDefective: boolean = false;
  private warehouseId: number = null;
  private providerId: number = null;
  private brandIds: number[] = [];

  private pagerValues: number[] = [10, 20, 50, 10000];

  private filters: any = {
    pagination: {
      limit: this.pagerValues[0],
      page: 0
    },
    sort: {
      field: 'id',
      direction: 'DESC'
    }
  };

  private resultsDefective: ReturnModel.GetDefectiveProductsResults[] = null;
  private results: ReturnModel.GetProducts[] = null;

  public itemsSelected: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
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

  private loadItems(filters?) {
    this.isLoadingData = true;

    const params = {
      returnId: this.returnId,
      warehouse: this.warehouseId,
      provider: this.providerId,
      brands: this.brandIds,
      filters: this.filters
    };
    const paramsFilters = {
      returnId: this.returnId,
      warehouse: this.warehouseId,
      provider: this.providerId,
      brands: this.brandIds
    };
    if (this.isDefective) {
      if (filters) {
        if (filters.products && filters.products.length > 0) {
          params.filters.products = filters.products;
        } else {
          delete params.filters.products;
        }
        if (filters.brands && filters.brands.length > 0) {
          params.filters.brands = filters.brands;
        } else {
          delete params.filters.brands;
        }
        if (filters.modelProducts && filters.modelProducts.length > 0) {
          params.filters.modelProducts = filters.modelProducts;
        } else {
          delete params.filters.modelProducts;
        }
        if (filters.models && filters.models.length > 0) {
          params.filters.models = filters.models;
        } else {
          delete params.filters.models;
        }
        if (filters.commercials && filters.commercials.length > 0) {
          params.filters.commercials = filters.commercials;
        } else {
          delete params.filters.commercials;
        }
        if (filters.sizes && filters.sizes.length > 0) {
          params.filters.sizes = filters.sizes;
        } else {
          delete params.filters.sizes;
        }
        params.filters.sort = filters.sort;
      }

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

      if (!filters) {
        this.returnService
          .postGetDefectiveProductsFilters(paramsFilters)
          .subscribe((res) => {
            this.defectiveProductsList.loadFilters(res.data);
          });
      }
    } else {
      if (filters) {
        if (filters.brands && filters.brands.length > 0) {
          params.filters.brands = filters.brands;
        } else {
          delete params.filters.brands;
        }
        if (filters.products && filters.products.length > 0) {
          params.filters.products = filters.products;
        } else {
          delete params.filters.products;
        }
        if (filters.models && filters.models.length > 0) {
          params.filters.models = filters.models;
        } else {
          delete params.filters.models;
        }
        if (filters.commercials && filters.commercials.length > 0) {
          params.filters.commercials = filters.commercials;
        } else {
          delete params.filters.commercials;
        }
        if (filters.sizes && filters.sizes.length > 0) {
          params.filters.sizes = filters.sizes;
        } else {
          delete params.filters.sizes;
        }
        params.filters.sort = filters.sort;
      }

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

      if (!filters) {
        this.returnService
          .postGetProductsFilters(paramsFilters)
          .subscribe((res) => {
            this.productsList.loadFilters(res.data);
          });
      }
    }
  }

  public backToPreviousPage() {
    this.location.back();
  }

  public async assignSelectedItems() {
    await this.intermediaryService.presentLoadingNew('Asignando productos a la devolución...');

    if (this.isDefective) {
      const selectedItems = this.defectiveProductsList.getSelectedItems();
      const itemsToReturn = selectedItems.map(i => {
        return {
          product: i.product.id,
          remove: i.remove
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
            this.location.back();
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
          unities: i.unities,
          remove: i.remove
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
            this.backToPreviousPage();
          } else {
            this.intermediaryService.presentToastError('Ha ocurrido un error al asignar los artículos para devolver.', TimesToastType.DURATION_ERROR_TOAST);
          }
        }, (error) => {
          this.intermediaryService.presentToastError('Ha ocurrido un error al asignar los artículos para devolver.', TimesToastType.DURATION_ERROR_TOAST);
        }, () => this.intermediaryService.dismissLoadingNew());
    }
  }

  public resetFilters() {
    if (this.isDefective) {
      this.defectiveProductsList.resetFilters();
    } else {
      this.productsList.resetFilters();
    }
  }

  public resetSort() {
    if (this.isDefective) {
      this.defectiveProductsList.resetSort();
    } else {
      this.productsList.resetSort();
    }
  }

  public reload() {
    this.filters = {
      pagination: {
        limit: this.pagerValues[0],
        page: 0
      },
      sort: {
        field: 'id',
        direction: 'DESC'
      }
    };
    this.tPaginator.pageSize = this.filters.pagination.limit;
    this.loadItems();
    this.resetFilters();
    this.resetSort();
  }

  public changeInItemsSelected(itemsSelected: boolean) {
    this.itemsSelected = itemsSelected;
  }

  public applyFilters(filters: boolean) {
    this.tPaginator.pageSize = 10000;
    this.filters.pagination.limit = 10000;
    this.loadItems(filters);
  }
}
