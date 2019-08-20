import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TypesService } from '@suite/services';
import { ProductsService, InventoryModel } from '@suite/services';
import { PrinterService } from "../../../../../services/src/lib/printer/printer.service";
import { PrintModel } from "../../../../../services/src/models/endpoints/Print";
import { WarehouseService } from "../../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import { DateTimeParserService } from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";
@Component({
  selector: 'suite-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  /**The section that by showed in the modal */
  section = 'information';


  product: InventoryModel.SearchInContainer;
  productHistorical;

  container = null;
  warehouseId: number;

  listProducts: any[] = [];
  listHistory: any[] = [];

  loading = null;

  /**Dictionary for fast access */
  actionTypes = {};
  listWarehouses: any[] = [];
  listHalls: any[] = [];
  listHallsOriginal: any = {};
  listRows: any[] = [];
  listRowsOriginal: any = {};
  listColumns: any[] = [];
  listColumnsOriginal: any = {};
  listReferences: any = {};
  warehouseSelected: number;
  hallSelected: number;
  rowSelected: number;
  columnSelected: number;
  referenceContainer: string = '';

  constructor(
    private typeService: TypesService,
    private productService: ProductsService,
    private modalController: ModalController,
    private navParams: NavParams,
    private printerService: PrinterService,
    private warehouseService: WarehouseService,
  ) {
    this.product = this.navParams.get("product");
  }

  ngOnInit() {
    this.container = this.navParams.data.container;
    this.warehouseId = this.navParams.data.warehouseId;

    this.listWarehouses = this.warehouseService.listWarehouses;
    this.listHallsOriginal = this.warehouseService.listHalls;
    this.listRowsOriginal = this.warehouseService.listRows;
    this.listColumnsOriginal = this.warehouseService.listColumns;
    this.listReferences = this.warehouseService.listReferences;

    this.warehouseSelected = null;
    this.getProductHistorical();
    this.getActionTypes();
  }

  /**
   * Get action types
   */
  getActionTypes(): void {
    this.typeService.getTypeActions().subscribe(ActionTypes => {
      /**fill the actionTypes dictionary */
      ActionTypes.forEach(actionType => {
        this.actionTypes[actionType.id] = actionType.name
      })
    })
  }

  /**
   * Get historical of products
   */
  getProductHistorical(): void {
    this.productService.getHistorical(this.product.productShoeUnit.id).subscribe(historical => {
      this.productHistorical = historical;
    });
  }

  /**
   * Close the current instance of the modal
   */
  close() {
    this.modalController.dismiss();
  }

  /**
   * Print a Simple Product Tag
   */
  printProductTag() {
    this.printerService.printProductBoxTag(this.printerService.buildString([{ product: <PrintModel.Product>this.product }]));
  }
  private checkFieldIsEnabled(source) {
    switch (source) {
      case 2:
        return this.listHallsOriginal[this.warehouseSelected];
      case 3:
        return this.listRowsOriginal[this.warehouseSelected] && this.listRowsOriginal[this.warehouseSelected][this.hallSelected];
      case 4:
        return this.listColumnsOriginal[this.warehouseSelected] && this.listColumnsOriginal[this.warehouseSelected][this.hallSelected] && this.listColumnsOriginal[this.warehouseSelected][this.hallSelected][this.rowSelected];
    }
  }

  private resetDataMovement() {
    this.warehouseSelected = null;
  }

  private saveDataMovement(product) {
    if (this.warehouseSelected && typeof this.warehouseSelected == 'number') {
      let referenceProduct = product.reference;
      let textLoading = 'Reubicando producto...';
      let textToastOk = 'Producto ' + referenceProduct + ' reubicado';
      if (this.referenceContainer) {
        let location = parseInt(this.referenceContainer.substring(1, 4)) + ' . ' + parseInt(this.referenceContainer.substring(8, 11)) + ' . ' + parseInt(this.referenceContainer.substring(5, 7));
        textToastOk += ' en Ubicación ' + location;
      } else {
        textToastOk += ' de tienda.';
      }

      this.locateProductFunction(this.referenceContainer, referenceProduct, this.warehouseSelected, textLoading, textToastOk);
    }
  }
}
