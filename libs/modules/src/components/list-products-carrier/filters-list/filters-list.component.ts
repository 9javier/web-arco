import { Component, OnInit } from '@angular/core';
import { TagsInputOption } from '../../tags-input/models/tags-input-option.model';
import { NavParams, PopoverController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListProductsCarrierService } from '../../../../../services/src/lib/endpoint/list-products-carrier/list-products-carrier.service';

@Component({
  selector: 'suite-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss'],
})
export class FiltersListComponent implements OnInit {

  /**Filters */
  products = [];
  warehouses: Array<TagsInputOption> = [];
  groups: Array<TagsInputOption> = [];

  form: FormGroup = this.formBuilder.group({
    products: [],
    warehouses: [],

    orderby: this.formBuilder.group({
      type: '1',
      order: "asc"
    })
  });

  constructor(
    private formBuilder: FormBuilder,
    private popoverController: PopoverController,
    private listProductsCarrierService : ListProductsCarrierService,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.clearFilters();
    this.getFilters();
    this.form = this.navParams.data.form as FormGroup;
  }

  clearFilters() {
    this.form = this.formBuilder.group({
      products: [],
      warehouses: [],
      orderby: this.formBuilder.group({
        type: '1',
        order: "asc"
      })
    });
  }

  async applyFilters() {
    await this.popoverController.dismiss({
      items: this.sanitize(this.getFormValueCopy()), form: this.form
    });
  }

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  sanitize(object) {
    object = JSON.parse(JSON.stringify(object));
    if (!object.orderby.type) {
      object.orderby.type = 1;
    } else {
      object.orderby.type = Number(object.orderby.type);
    }
    if (!object.orderby.order)
      object.orderby.order = 'asc';
    if (object.productReferencePattern) {
      object.productReferencePattern = "%" + object.productReferencePattern + "%";
    }
    Object.keys(object).forEach(key => {
      if (object[key] instanceof Array) {
        if (object[key][0] instanceof Array) {
          object[key] = object[key][0];
        } else {
          for (let i = 0; i < object[key].length; i++) {
            if (object[key][i] === null || object[key][i] === "") {
              object[key].splice(i, 1);
            }
          }
        }
      }
      if (object[key] === null || object[key] === "") {
        object[key] = [];
      }
    });
    return object;
  }

  getFilters() {
    this.listProductsCarrierService.getAllFilters(this.sanitize(this.getFormValueCopy())).subscribe(filters => {
      const arrayProducts = [];
      const arrayWarehouse = [];

      Object.keys(filters.products).map(function(key){
        arrayProducts.push({'display': filters.products[key].name, 'value': filters.products[key].id});
        return arrayProducts;
      });
      this.products = arrayProducts;

      Object.keys(filters.warehouses).map(function(key){
        arrayWarehouse.push({'display': filters.warehouses[key].name, 'value': filters.warehouses[key].id});
        return arrayWarehouse;
      });

      this.warehouses = arrayWarehouse;
    });
  }
}
