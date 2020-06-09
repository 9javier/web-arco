import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ReturnModel} from "../../../../services/src/models/endpoints/Return";
import {MatTableDataSource} from "@angular/material/table";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {validators} from "../../utils/validators";
import {FilterButtonComponent} from "../../components/filter-button/filter-button.component";
import {TagsInputOption} from "../../components/tags-input/models/tags-input-option.model";
import {MatSort, Sort} from "@angular/material/sort";

@Component({
  selector: 'return-unities-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @Output() changeItemsSelected = new EventEmitter();
  @Output() appliedFilters = new EventEmitter();

  public tColumns: string[] = ['brand_name', 'model_ref', 'model_name', 'commercial', 'size', 'unities', 'select'];
  public tData: MatTableDataSource<ReturnModel.GetProducts> = new MatTableDataSource<ReturnModel.GetProducts>([]);

  public tAllSelected: boolean = false;
  public selectedForm: FormGroup = this.formBuilder.group({}, {
    validators: validators.haveItems("toSelect")
  });

  private itemsToLoad: ReturnModel.GetProducts[] = null;
  private itemsSelected: ReturnModel.GetProducts[] = [];

  @ViewChild(MatSort) mSort: MatSort;
  @ViewChild('fbBrands') fbBrands: FilterButtonComponent;
  @ViewChild('fbProducts') fbProducts: FilterButtonComponent;
  @ViewChild('fbModels') fbModels: FilterButtonComponent;
  @ViewChild('fbCommercials') fbCommercials: FilterButtonComponent;
  @ViewChild('fbSizes') fbSizes: FilterButtonComponent;

  public mSortRest = false;
  public isFilteringBrands: number = 0;
  public isFilteringProducts: number = 0;
  public isFilteringModels: number = 0;
  public isFilteringCommercials: number = 0;
  public isFilteringSizes: number = 0;

  public filterOptions: {
    brands: TagsInputOption[],
    products: TagsInputOption[],
    models: TagsInputOption[],
    commercials: TagsInputOption[],
    sizes: TagsInputOption[]
  } = {
    brands: [],
    products: [],
    models: [],
    commercials: [],
    sizes: []
  };
  public filters: {
    brands: TagsInputOption[],
    products: TagsInputOption[],
    models: TagsInputOption[],
    commercials: TagsInputOption[],
    sizes: TagsInputOption[],
    sort: { field: string, direction: string }
  } = {
    brands: [],
    products: [],
    models: [],
    commercials: [],
    sizes: [],
    sort: { field: 'unitiesAssigned', direction: 'DESC' }
  };

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.mSort.sortChange.subscribe((sort: Sort) => {
      if (this.mSortRest) {
        this.mSortRest = false;
      } else {
        let sortSelection = {
          field: 'id',
          direction: 'DESC'
        };
        if (sort.direction != '') {
          sortSelection = {
            field: sort.active,
            direction: sort.direction.toUpperCase()
          };
        }

        this.filters.sort = sortSelection;
        this.appliedFilters.next(this.filters);
      }
    });
  }

  public selectAll(event) {
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control => {
      control.setValue(value);
    });

    if (value) {
      this.itemsSelected = this.itemsToLoad;
    } else {
      this.itemsSelected = [];
    }

    this.changeItemsSelected.next(this.itemsSelected.length > 0);
  }

  public itemSelected(item: ReturnModel.GetProducts) {
    const index = this.itemsSelected.indexOf(item, 0);
    if (index > -1) {
      if (this.itemsSelected[index].unitiesAssigned) {
        this.itemsSelected[index].remove = true;
      } else {
        this.itemsSelected.splice(index, 1);
      }
    } else {
      this.itemsSelected.push(item);
    }

    this.changeItemsSelected.next(this.itemsSelected.length > 0);
  }

  private resetSelections() {
    this.tAllSelected = false;
    this.selectedForm = this.formBuilder.group({}, {
      validators: validators.haveItems("toSelect")
    });
    this.selectedForm.removeControl("toSelect");
    this.itemsSelected = [];
    this.selectedForm.addControl("toSelect", this.formBuilder.array(this.itemsToLoad.map(element => {
      if (!!element.unitiesAssigned) {
        this.itemsSelected.push(element);
      }
      return new FormControl(!!element.unitiesAssigned);
    })));
  }

  public loadItems(items: ReturnModel.GetProducts[]) {
    this.itemsToLoad = items;

    this.resetSelections();
    this.reloadTableData();
  }

  public loadFilters(items: ReturnModel.GetProductsFilters) {
    this.filterOptions = {
      brands: [],
      products: [],
      models: [],
      commercials: [],
      sizes: []
    };

    this.filterOptions.brands = items.brands;
    this.filterOptions.products = items.modelReferences;
    this.filterOptions.models = items.modelNames;
    this.filterOptions.commercials = items.commercials;
    this.filterOptions.sizes = items.sizes;
  }

  private reloadTableData() {
    this.tData = new MatTableDataSource<ReturnModel.GetProducts>(this.itemsToLoad);
  }

  public getSelectedItems() {
    return this.itemsSelected;
  }

  public applyFilters(event, column: string) {
    const values = [];

    for(let item of event.filters){
      if(item.checked){
        values.push(item.id);
      }
    }

    this.filters[column] = values.length < this.filterOptions[column].length ? values : [];
    this.appliedFilters.next(this.filters);
  }

  public resetFilters() {
    this.filters = {
      brands: [],
      products: [],
      models: [],
      commercials: [],
      sizes: [],
      sort: this.filters.sort
    };

    this.isFilteringBrands = 0;
    this.isFilteringProducts = 0;
    this.isFilteringModels = 0;
    this.isFilteringCommercials = 0;
    this.isFilteringSizes = 0;
  }

  public resetSort() {
    this.filters.sort = { field: 'unitiesAssigned', direction: 'DESC' };
    this.mSortRest = true;
    this.mSort.sort({id: '', start: 'asc', disableClear: false});
  }

  public changeUnities() {
    this.changeItemsSelected.next(true);
  }
}
