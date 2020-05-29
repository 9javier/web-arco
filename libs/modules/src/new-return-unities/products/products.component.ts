import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ReturnModel} from "../../../../services/src/models/endpoints/Return";
import {MatTableDataSource} from "@angular/material/table";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {validators} from "../../utils/validators";

@Component({
  selector: 'return-unities-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @Output() changeItemsSelected = new EventEmitter();

  public tColumns: string[] = ['brand_name', 'model_ref', 'model_name', 'commercial', 'size', 'unities', 'select'];
  public tData: MatTableDataSource<ReturnModel.GetProducts> = new MatTableDataSource<ReturnModel.GetProducts>([]);

  public tAllSelected: boolean = false;
  public selectedForm: FormGroup = this.formBuilder.group({}, {
    validators: validators.haveItems("toSelect")
  });

  private itemsToLoad: ReturnModel.GetProducts[] = null;
  private itemsSelected: ReturnModel.GetProducts[] = [];

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {}

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

  private reloadTableData() {
    this.tData = new MatTableDataSource<ReturnModel.GetProducts>(this.itemsToLoad);
  }

  public getSelectedItems() {
    return this.itemsSelected;
  }
}
