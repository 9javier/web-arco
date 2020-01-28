import { Component, OnInit } from '@angular/core';
import { ListProductsCarrierService } from '../../../../services/src/lib/endpoint/list-products-carrier/list-products-carrier.service';
import { CarrierService, IntermediaryService } from '@suite/services';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { FiltersAuditProvider } from '../../../../services/src/providers/filters-audit/filters-audit.provider';
import { FiltersListComponent } from './filters-list/filters-list.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AudioProvider } from '../../../../services/src/providers/audio-provider/audio-provider.provider';

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
    private route: Router,
    private carrierService: CarrierService,

    private audioProvider: AudioProvider,
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
    await this.listProductsCarrierService.getProducts(this.carrierReference, data).subscribe(async (res: any) => {
      console.log('recive productos');
      
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
      event
    });

    popover.onDidDismiss().then(async (res) => {
      if (res.data) {
        const arrayProducts = [];
        const arrayWarehouses = [];

        Object.keys(res.data.items.products).map(function(key){
          arrayProducts.push(res.data.items.products[key].value);
          return arrayProducts;
        });

        res.data.items.products = arrayProducts;

        Object.keys(res.data.items.warehouses).map(function(key){
          arrayWarehouses.push(res.data.items.warehouses[key].value);
          return arrayWarehouses;
        });

        res.data.items.warehouses = arrayWarehouses;

        await this.getProducts(res.data.items);
        this.form = res.data.form;
      }
    });

    await popover.present();
  }

  async close(con = false) {
     await this.modalController.dismiss();
  }

  async btnContinue(con = false) {
    console.log('Continuar');
    if(con){
      await this.modalController.dismiss(this.carrierReference);
    }else{
      await this.modalController.dismiss();
    }
  }

  async btnCarrierEmpty() {
    console.log('Jaula vacía');
    await this.intermediaryService.presentLoading();

    await this.carrierService.postPackingEmpty(this.carrierReference).then(res => {
      if(res.code === 200){
        this.audioProvider.playDefaultOk();
        this.intermediaryService.presentToastSuccess(`La Jaula ${this.carrierReference} se ha vaciado corectamente`);
        this.intermediaryService.dismissLoading();
        this.modalController.dismiss(this.carrierReference);
      }else{
        this.intermediaryService.dismissLoading();
        this.audioProvider.playDefaultError();
        this.intermediaryService.presentToastError(res.errors);
      }

    }).catch(error => {
      this.intermediaryService.dismissLoading();
      this.audioProvider.playDefaultError();
      this.intermediaryService.presentToastError(error.message);
    })

  }

  async btnPosition(ruta:string) {
    console.log('Posicionar');
    await this.route.navigateByUrl(ruta);
    await this.modalController.dismiss(ruta,'navigate');
  }
}
