import {Component, OnInit} from '@angular/core';
import {PickingNewProductsService} from "../../../../services/src/lib/endpoint/picking-new-products/picking-new-products.service";
import {PickingNewProductsModel} from "../../../../services/src/models/endpoints/PickingNewProducts";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {validators} from "../../utils/validators";
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";

@Component({
  selector: 'list-received-product',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListReceivedProductTemplateComponent implements OnInit {

  productsReceived: PickingNewProductsModel.ProductReceived[] = [];

  selectedForm: FormGroup = this.formBuilder.group({
    selector: false
  },{
    validators: validators.haveItems("toSelect")
  });

  constructor(
    private formBuilder: FormBuilder,
    private pickingNewProductsService: PickingNewProductsService,
    private printerService: PrinterService
  ) {}

  ngOnInit() {
    this.pickingNewProductsService
      .postGetByWarehouseIdPickingId()
      .subscribe((res: PickingNewProductsModel.ResponseGetByWarehouseIdPickingId) => {
        if (res.code == 200) {
          this.productsReceived = res.data;
          this.initSelectedForm();
        } else {
          console.error('Error::Subscribe::GetByWarehouseIdPickingId -> ', res);
        }
      }, (error) => {
        console.error('Error::Subscribe::GetByWarehouseIdPickingId -> ', error);
      });
  }

  private initSelectedForm() {
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect", this.formBuilder.array(this.productsReceived.map(prices => new FormControl(false))));
  }

  printProductsPrices() {
    let productReferences = this.selectedForm.value.toSelect
      .map((selected, i) => {
        return selected ? this.productsReceived[i].productShoesUnit.reference : false;
      })
      .filter(productReference => productReference);

    if (productReferences.length > 0) {
      this.printerService.printTagPrices(productReferences)
        .subscribe(() => {
          this.initSelectedForm();
        }, (error) => {
          console.error('An error succeed to try print products received. \nError:', error);
        });
    }
  }

}
