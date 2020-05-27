import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ReturnModel} from "../../../../services/src/models/endpoints/Return";
import {validators} from "../../utils/validators";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'return-unities-defective-products',
  templateUrl: './defective-products.component.html',
  styleUrls: ['./defective-products.component.scss']
})
export class DefectiveProductsComponent implements OnInit {

  @Output() changeItemsSelected = new EventEmitter();

  public tColumns: string[] = ['product', 'brand_name', 'model_ref', 'model_name', 'commercial', 'size', 'defect_type', 'select'];
  public tData: MatTableDataSource<ReturnModel.GetDefectiveProductsResults> = new MatTableDataSource<ReturnModel.GetDefectiveProductsResults>([]);

  public tAllSelected: boolean = false;
  public selectedForm: FormGroup = this.formBuilder.group({}, {
    validators: validators.haveItems("toSelect")
  });

  private itemsToLoad: ReturnModel.GetDefectiveProductsResults[] = null;
  private itemsSelected: ReturnModel.GetDefectiveProductsResults[] = [];

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

  public itemSelected(item: ReturnModel.GetDefectiveProductsResults) {
    const index = this.itemsSelected.indexOf(item, 0);
    if (index > -1) {
      if (this.itemsSelected[index].assigned) {
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
      if (element.assigned) {
        this.itemsSelected.push(element);
      }
      return new FormControl(element.assigned);
    })));
  }

  public loadItems(items: ReturnModel.GetDefectiveProductsResults[]) {
    this.itemsToLoad = items;

    this.resetSelections();
    this.reloadTableData();
  }

  private reloadTableData() {
    this.tData = new MatTableDataSource<ReturnModel.GetDefectiveProductsResults>(this.itemsToLoad);
  }

  public getSelectedItems() {
    return this.itemsSelected;
  }
}
