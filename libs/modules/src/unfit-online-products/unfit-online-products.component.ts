import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TagsInputOption} from "../components/tags-input/models/tags-input-option.model";
import {PickingNewProductsModel} from "../../../services/src/models/endpoints/PickingNewProducts";
import {PickingNewProductsService} from "../../../services/src/lib/endpoint/picking-new-products/picking-new-products.service";
import {PrinterService} from "../../../services/src/lib/printer/printer.service";
import {AppFiltersService} from "../../../services/src/lib/endpoint/app-filters/app-filters.service";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {IntermediaryService, ProductModel} from "@suite/services";
import Product = ProductModel.Product;
import NoOnlineSearchParameters = PickingNewProductsModel.NoOnlineSearchParameters;

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

  // models: Array<TagsInputOption> = [];
  // sizes: Array<TagsInputOption> = [];
  // colors: Array<TagsInputOption> = [];
  // dates: Array<TagsInputOption> = [];
  // families: Array<TagsInputOption> = [];
  // lifestyles: Array<TagsInputOption> = [];
  // ordertypes: Array<TagsInputOption> = [];
  // requestTimeout: any = null;
  // pauseListenFormChange = false;
  // productsReceived: Array<PickingNewProductsModel.ProductReceivedSearched> = [];
  // selectedForm: FormGroup = this.formBuilder.group({
  //   selector: false
  // },{
  //   validators: validators.haveItems("toSelect")
  // });

  constructor(
    private formBuilder: FormBuilder,
    private pickingNewProductsService: PickingNewProductsService,
    private printerService: PrinterService,
    private intermediaryService: IntermediaryService,
    private appFiltersService: AppFiltersService,
    private dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit(){
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

  // async refresh() {
  //   await this.intermediaryService.presentLoading('Cargando productos...');
  //   this.getFilters();
  //   this.selectedForm = this.formBuilder.group({
  //     selector: false
  //   },{
  //     validators: validators.haveItems("toSelect")
  //   });
  // }

  // ngAfterViewInit() : void {
  //   this.listenChangesPaginator();
  // }

  // public printProductsPrices() {
  //   let productReferences = this.selectedForm.value.toSelect
  //     .map((selected, i) => {
  //       return selected ? this.productsReceived[i].productShoesUnit.reference : false;
  //     })
  //     .filter(productReference => productReference);
  //
  //   if (productReferences.length > 0) {
  //     this.printerService.printTagPrices(productReferences)
  //       .subscribe((result) => {
  //         if(result && typeof result !== "boolean"){
  //           result.subscribe(r=>{});
  //         }
  //         for (let iSelected in this.selectedForm.value.toSelect) {
  //           if (this.selectedForm.value.toSelect[iSelected]) {
  //             this.productsReceived[iSelected].filterPrice.impress = true;
  //           }
  //         }
  //         this.initSelectedForm();
  //       }, (error) => {
  //         console.error('An error succeed to try print products received. \nError:', error);
  //       });
  //   }
  // }

  // public selectAll(event): void {
  //   let value = event.detail.checked;
  //   (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control => {
  //     control.setValue(value);
  //   });
  // }

  // public openFilters() {
  //   this.showFilters = !this.showFilters;
  // }

  // public async applyFilters() {
  //   await this.intermediaryService.presentLoading('Cargando productos...');
  //   if (this.pauseListenFormChange) return;
  //   clearTimeout(this.requestTimeout);
  //   this.paginator.pageIndex = 0;
  //   this.requestTimeout = setTimeout(() => {
  //     this.searchProductsReceived(this.sanitize(this.getFormValueCopy()));
  //   }, 100);
  // }

  // private initSelectedForm() {
  //   this.selectedForm.removeControl("toSelect");
  //   this.selectedForm.addControl("toSelect", this.formBuilder.array(this.productsReceived.map(prices => new FormControl(false))));
  // }

  // private listenChangesPaginator(): void {
  //   let previousPageSize = this.limit;
  //
  //   this.paginator.page.subscribe(async page => {
  //     await this.intermediaryService.presentLoading('Cargando productos...');
  //
  //     let flag = previousPageSize == page.pageSize;
  //     previousPageSize = page.pageSize;
  //     this.limit = page.pageSize;
  //     this.page = flag ? page.pageIndex + 1 : 1;
  //
  //     this.formFilters.value.pagination.page = this.page;
  //     this.formFilters.value.pagination.limit = this.limit;
  //
  //     this.searchProductsReceived(this.sanitize(this.getFormValueCopy()));
  //   });
  // }

  // private getFormValueCopy() {
  //   return JSON.parse(JSON.stringify(this.filtersForm.value || {}));
  // }

  // private sanitize(object) {
  //   object = JSON.parse(JSON.stringify(object));
  //   if (!object.orderby.type) {
  //     delete object.orderby.type;
  //   } else {
  //     object.orderby.type = parseInt(object.orderby.type);
  //   }
  //   if (!object.orderby.order)
  //     delete object.orderby.order;
  //   if (object.productReferencePattern) {
  //     object.productReferencePattern = "%" + object.productReferencePattern + "%";
  //   }
  //   Object.keys(object).forEach(key => {
  //     if (object[key] instanceof Array) {
  //       if (object[key][0] instanceof Array) {
  //         object[key] = object[key][0];
  //       } else {
  //         for (let i = 0; i < object[key].length; i++) {
  //           if (object[key][i] === null || object[key][i] === "") {
  //             object[key].splice(i, 1);
  //           }
  //         }
  //       }
  //     }
  //     if (object[key] === null || object[key] === "") {
  //       delete object[key];
  //     }
  //   });
  //   return object;
  // }

  // private clearFilters() {
  //   this.filtersForm = this.formBuilder.group({
  //     models: [],
  //     sizes: [],
  //     dates: [],
  //     colors: [],
  //     families: [],
  //     lifestyles: [],
  //     status: 0,
  //     tariffId: 0,
  //     pagination: this.formBuilder.group({
  //       page: this.page || 1,
  //       limit: this.limit || this.pagerValues[0]
  //     }),
  //     orderby: this.formBuilder.group({
  //       type: '',
  //       order: "asc"
  //     }),
  //     hideImpress: false
  //   });
  //
  //   this.getFilters();
  // }

  // private getFilters(): void {
  //   this.appFiltersService
  //     .postProductsReceived({})
  //     .subscribe((res: AppFiltersModel.ProductsReceived) => {
  //       this.colors = res.colors;
  //       this.models = res.models;
  //       this.sizes = res.sizes;
  //       this.lifestyles = res.lifestyles;
  //       this.families = res.families;
  //       this.dates = res.dates.map(date => {
  //         return { id: date.id, name: this.dateTimeParserService.date(date.name) };
  //       });
  //       this.ordertypes = res.ordertypes;
  //
  //       this.applyFilters();
  //     });
  // }

  // private searchProductsReceived(parameters) {
  //   this.pickingNewProductsService
  //     .postSearch(parameters)
  //     .subscribe(async (res: PickingNewProductsModel.Search) => {
  //       this.productsReceived = res.results;
  //       this.initSelectedForm();
  //       this.showFilters = false;
  //       let paginator = res.pagination;
  //       this.paginator.length = paginator.totalResults;
  //       this.paginator.pageIndex = paginator.page - 1;
  //       await this.intermediaryService.dismissLoading();
  //     }, async (error) => {
  //       console.error('Error::Subscribe::GetByWarehouseIdPickingId -> ', error);
  //       await this.intermediaryService.dismissLoading();
  //     });
  // }

}
