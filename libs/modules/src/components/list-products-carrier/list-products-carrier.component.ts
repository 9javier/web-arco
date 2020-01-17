import { Component, OnInit } from '@angular/core';
import { AuditsModel } from '../../../../services/src/models/endpoints/Audits';
import { ListProductsCarrierService } from '../../../../services/src/lib/endpoint/list-products-carrier/list-products-carrier.service';
import { CarrierService, IntermediaryService } from '@suite/services';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { PopoverFiltersComponent } from '../../audits-mobile/sccaner-product/popover-filters/popover-filters.component';
import { FiltersAuditProvider } from '../../../../services/src/providers/filters-audit/filters-audit.provider';
import { CarrierModel } from '../../../../services/src/models/endpoints/Carrier';

@Component({
  selector: 'suite-list-products-carrier',
  templateUrl: './list-products-carrier.component.html',
  styleUrls: ['./list-products-carrier.component.scss'],
})
export class ListProductsCarrierComponent implements OnInit {
  destinyPacking: string = null;
  public packingProductsOriginal: AuditsModel.GetAuditProducts[] = [];
  packingProducts: AuditsModel.GetAuditProducts[] = [];
  carrier = '';

  constructor(
    private listProductsCarrierService : ListProductsCarrierService,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private filtersAuditProvider: FiltersAuditProvider,
    private navParams: NavParams,
    private carrierService: CarrierService,
  ) {
    this.carrier = this.navParams.get('carrier');

    console.log(this.carrier);
  }

  async ngOnInit() {
    this.filtersAuditProvider.sort = null;
    this.filtersAuditProvider.filter = 0;
    await this.getProducts();
    this.getPackingDestiny();
  }

  private async getProducts() {
    await this.intermediaryService.presentLoading();
    this.listProductsCarrierService.getProducts().subscribe(async (res: AuditsModel.ResponseGetAuditProducts) => {
      this.packingProducts = res.data;
      this.packingProductsOriginal = res.data;
      this.filterProductsList();
      await this.intermediaryService.dismissLoading();
    }, async (err) => {
      await this.intermediaryService.presentToastError(err.error.errors);
    })
  }

  async filterProducts(event) {
    const popover = await this.popoverController.create({
      cssClass: 'popover-filter',
      component: PopoverFiltersComponent,
      event: event
    });

    popover.onDidDismiss().then((data) => {
      if (data.data) {
        this.filtersAuditProvider.filter = data.data.filter;
        this.filtersAuditProvider.sort = data.data.sort;
        this.filterProductsList();
      }
    });

    await popover.present();
  }

  private filterProductsList() {
    this.packingProducts = JSON.parse(JSON.stringify(this.packingProductsOriginal));

    if (this.filtersAuditProvider.filter) {
      switch (this.filtersAuditProvider.filter) {
        case 1:
          this.packingProducts = this.packingProducts.filter(pp => !pp.audit.isAudit);
          break;
        case 2:
          this.packingProducts = this.packingProducts.filter(pp => pp.audit.isAudit && pp.audit.rightAudit);
          break;
        case 3:
          this.packingProducts = this.packingProducts.filter(pp => pp.audit.isAudit && !pp.audit.rightAudit);
          break;
      }
    }

    if (this.filtersAuditProvider.sort && this.filtersAuditProvider.sort.type && this.filtersAuditProvider.sort.value) {
      let sortArray = (a, b) => {
        let aFieldToSort = null;
        let bFieldToSort = null;

        switch (this.filtersAuditProvider.sort.value) {
          case 1:
            aFieldToSort = a.product.size.name;
            bFieldToSort = b.product.size.name;
            break;
          case 2:
            aFieldToSort = a.product.model.reference;
            bFieldToSort = b.product.model.reference;
            break;
          case 3:
            aFieldToSort = a.product.model.brand.name;
            bFieldToSort = b.product.model.brand.name;
            break;
        }

        if (aFieldToSort < bFieldToSort) {
          return this.filtersAuditProvider.sort.type === 'DESC' ? 1 : -1;
        } else if (aFieldToSort > bFieldToSort) {
          return this.filtersAuditProvider.sort.type === 'DESC' ? -1 : 1;
        } else {
          return 0;
        }
      };

      this.packingProducts.sort(sortArray);
    }
  }

  async close() {
    await this.modalController.dismiss();
  }

  private getPackingDestiny() {
    this.carrierService
      .getGetPackingDestiny(this.carrier)
      .then((res: CarrierModel.ResponseGetPackingDestiny) => {
        if (res.code === 200) {
          if (res.data) {
            this.destinyPacking = `${res.data.warehouse.reference} ${res.data.warehouse.name}`;
          }
        }
      });
  }
}
