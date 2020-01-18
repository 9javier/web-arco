import { Component, OnInit } from '@angular/core';
import { ListProductsCarrierService } from '../../../../services/src/lib/endpoint/list-products-carrier/list-products-carrier.service';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { FiltersAuditProvider } from '../../../../services/src/providers/filters-audit/filters-audit.provider';
import { FiltersListComponent } from './filters-list/filters-list.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'suite-list-products-carrier',
  templateUrl: './list-products-carrier.component.html',
  styleUrls: ['./list-products-carrier.component.scss'],
})
export class ListProductsCarrierComponent implements OnInit {
  destinyPacking: string = null;
  packingProducts: any[] = [];
  carrierReference = '';
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
    private listProductsCarrierService : ListProductsCarrierService,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private filtersAuditProvider: FiltersAuditProvider,
    private navParams: NavParams,
  ) {
    this.carrierReference = this.navParams.get('carrierReference');
  }

  async ngOnInit() {
    this.filtersAuditProvider.sort = null;
    this.filtersAuditProvider.filter = 0;
    await this.getProducts();
  }

  private async getProducts(data = null) {
    await this.intermediaryService.presentLoading();
    this.listProductsCarrierService.getProducts(this.carrierReference, data).subscribe(async (res: any) => {
      if (res.data.results && res.data.results.length > 0) {
        this.packingProducts = res.data.results[0].packingInventorys;
      } else {
        this.packingProducts = [];
      }

      await this.intermediaryService.dismissLoading();
    }, async (err) => {
      await this.intermediaryService.presentToastError(err.error.errors);
    })
  }

  async filterProducts() {
    const popover = await this.popoverController.create({
      cssClass: 'popover-filter',
      component: FiltersListComponent,
      componentProps: { form: this.form },
      event: event
    });

    popover.onDidDismiss().then(async (res) => {
      if (res.data) {
        await this.getProducts(res.data.items);
        this.form = res.data.form;
      }
    });

    await popover.present();
  }

  async close() {
    await this.modalController.dismiss();
  }

  btnContinue() {
    console.log('Continuar');
  }

  btnCarrierEmpty() {
    console.log('Jaula vacía');
  }

  btnPosition() {
    console.log('Posicionar');
  }
}
