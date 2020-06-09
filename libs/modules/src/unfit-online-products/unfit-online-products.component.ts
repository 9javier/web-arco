import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TagsInputOption} from "../components/tags-input/models/tags-input-option.model";
import {PickingNewProductsModel} from "../../../services/src/models/endpoints/PickingNewProducts";
import {PickingNewProductsService} from "../../../services/src/lib/endpoint/picking-new-products/picking-new-products.service";
import {IntermediaryService, ProductModel} from "@suite/services";
import Product = ProductModel.Product;
import NoOnlineSearchParameters = PickingNewProductsModel.NoOnlineSearchParameters;
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";

@Component({
  selector: 'app-unfit-online-products',
  templateUrl: './unfit-online-products.component.html',
  styleUrls: ['./unfit-online-products.component.scss']
})
export class UnfitOnlineProductsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pagerValues: Array<number> = [50, 100, 500];
  limit: number = this.pagerValues[0];
  page: number = 1;
  ngInit: boolean;

  products: Product[] = [];
  filterOptions: {
    models: TagsInputOption[],
    brands: TagsInputOption[],
    colors: TagsInputOption[],
    sizes: TagsInputOption[],
    orderTypes: TagsInputOption[]
  };
  showFilters: boolean = false;
  filtersForm: FormGroup = this.formBuilder.group({
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    models: [],
    brands: [],
    colors: [],
    sizes: [],
    orderBy: this.formBuilder.group({
      type: '',
      order: 'asc'
    })
  });

  constructor(
    private formBuilder: FormBuilder,
    private pickingNewProductsService: PickingNewProductsService,
    private intermediaryService: IntermediaryService,
    private toolbarProvider: ToolbarProvider,
  ) {}

  ionViewWillEnter() {
    this.toolbarProvider.optionsActions.next([
      {
        icon: 'funnel',
        label: 'Filtros',
        action: () => this.showFilters = !this.showFilters
      }
    ]);
    if (this.ngInit == false) {
      this.getProducts();
    }
    this.ngInit = false;
  }

  ngOnInit(){
    this.ngInit = true;
    this.getFilters();
    this.resetFilters();
    this.getProducts();
  }

  getFilters(){
    this.intermediaryService.presentLoading('Cargando filtros...').then(() => {
      this.pickingNewProductsService.getNoOnlineFilterOptions().then(async response => {
        if (response.code == 200) {
          const options = response.data;
          this.filterOptions = {
            models: options.models.map(option => {return {id: option, name: option}}),
            brands: options.brands.map(option => {return {id: option, name: option}}),
            colors: options.colors.map(option => {return {id: option, name: option}}),
            sizes: options.sizes.map(option => {return {id: option, name: option}}),
            orderTypes: options.orderTypes
          };
          await this.intermediaryService.dismissLoading();
        }else{
          console.error(response);
          await this.intermediaryService.dismissLoading();
        }
      }, async error => {
        console.error(error);
        await this.intermediaryService.dismissLoading();
      }).catch(async error => {
        console.error(error);
        await this.intermediaryService.dismissLoading();
      });
    });
  }

  resetFilters(){
    this.filtersForm = this.formBuilder.group({
      pagination: this.formBuilder.group({
        page: 1,
        limit: this.pagerValues[0]
      }),
      models: [],
      brands: [],
      colors: [],
      sizes: [],
      orderBy: this.formBuilder.group({
        type: '',
        order: 'asc'
      })
    });

    this.paginator.pageIndex = 0;
  }

  getProducts(){
    this.intermediaryService.presentLoading('Cargando productos...').then(() => {
      const parameters: NoOnlineSearchParameters = this.filtersForm.value;
      this.pickingNewProductsService.postSearchNoOnline(parameters).then(async response => {
        if (response.code == 200) {
          this.products = response.data[0];
          this.paginator.length = response.data[1];
          await this.intermediaryService.dismissLoading();
        } else {
          console.error(response);
          await this.intermediaryService.dismissLoading();
        }
      }, async error => {
        console.error(error);
        await this.intermediaryService.dismissLoading();
      }).catch(async error => {
        console.error(error);
        await this.intermediaryService.dismissLoading();
      });
    });
  }

  ngAfterViewInit(){
    let previousLimit = this.limit;
    this.paginator.page.subscribe(async paginator => {
      await this.intermediaryService.presentLoading('Cargando productos...');
      const sameLimit: boolean = previousLimit == paginator.pageSize;
      previousLimit = paginator.pageSize;
      this.limit = paginator.pageSize;
      this.page = sameLimit ? paginator.pageIndex + 1 : 1;
      this.filtersForm.value.pagination.page = this.page;
      this.filtersForm.value.pagination.limit = this.limit;
      this.getProducts();
    });
  }

}
