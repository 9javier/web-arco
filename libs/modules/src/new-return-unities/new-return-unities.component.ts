import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ReturnService} from "../../../services/src/lib/endpoint/return/return.service";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import {ProductsComponent} from "./products/products.component";
import {DefectiveProductsComponent} from "./defective-products/defective-products.component";
import {MatPaginator} from "@angular/material/paginator";

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

  private isDefective: boolean = false;
  private warehouseId: number = null;
  private providerId: number = null;
  private brandIds: number[] = [];

  private pagerValues: number[] = [10, 20, 50];

  private filters: any = {
    pagination: {
      limit: this.pagerValues[0],
      page: 1
    }
  };

  private resultsDefective: ReturnModel.GetDefectiveProducts = null;
  private results: ReturnModel.GetProducts[] = null;

  public itemsSelected: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private returnService: ReturnService
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
            this.resultsDefective = res.data;
            this.itemsSelected = false;
          }
        }, (error) => {});
    } else {
      this.returnService
        .postGetProducts(params)
        .subscribe((res) => {
          if (res.code == 200) {
            this.results = res.data.results;
            this.tPaginator.length = res.data.count;
            this.productsList.loadItems(this.results);
            this.itemsSelected = false;
          }
        }, (error) => {});
    }
  }

  public assignSelectedItems() {
    if (this.isDefective) {

    } else {
      const selectedItems = this.productsList.getSelectedItems();
      console.log('T:selectedItems', selectedItems);
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
          console.log('T:Res', res);
        }, (error) => {
          console.log('T:Error', error);
        });
    }
  }

  public reload() {
    this.loadItems();
  }

  public changeInItemsSelected(itemsSelected: boolean) {
    this.itemsSelected = itemsSelected;
  }
}
