import {Component, OnInit} from '@angular/core';
import {PickingProvider} from "../../../services/src/providers/picking/picking.provider";
import {PickingScanditService} from "../../../services/src/lib/scandit/picking/picking.service";
import {PickingStoreModel} from "../../../services/src/models/endpoints/PickingStore";
import {PickingStoreService} from "../../../services/src/lib/endpoint/picking-store/picking-store.service";
import {IntermediaryService} from "@suite/services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-picking-scan-packing',
  templateUrl: './picking-scan-packing.component.html',
  styleUrls: ['./picking-scan-packing.component.scss']
})
export class PickingScanPackingComponent implements OnInit {

  message = 'No hay ningún producto procesado para asociar a embalajes.';

  constructor(
    private pickingProvider: PickingProvider,
    private pickingStoreService: PickingStoreService,
    private pickingScanditService: PickingScanditService,
    private intermediaryService: IntermediaryService,
    private router: Router,
  ) {}

  async ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.load();
  }

  private async load(){
    this.message = 'Cargando...';
    await this.intermediaryService.presentLoading();
    this.pickingStoreService.getLineRequestsToAssociatePackaging().then(async (res: PickingStoreModel.ResponseOrderRequests) => {
      await this.intermediaryService.dismissLoading();
      if ((res.code == 200 || res.code == 201) && res.data && res.data.length > 0) {
        let orderRequestsByStores = res.data;

        let listStoresIdsToStorePickings: number[] = [];
        let listRequestsIdsToStorePickings: number[] = [];

        for (let storeLineRequest of orderRequestsByStores) {
          if(storeLineRequest.selected){
            listStoresIdsToStorePickings.push(storeLineRequest.warehouse.id);
            listRequestsIdsToStorePickings = listRequestsIdsToStorePickings.concat(storeLineRequest.lines.filter(orderRequest => orderRequest.selected).map(orderRequest => orderRequest.request.id));
          }
        }
        this.pickingProvider.listStoresIdsToStorePicking = listStoresIdsToStorePickings;
        this.pickingProvider.listRequestsIdsToStorePicking = listRequestsIdsToStorePickings;

        let filtersToGetProducts: PickingStoreModel.ParamsFiltered = {
          orderbys: [],
          sizes: [],
          colors: [],
          models: [],
          brands: [],
          toAssociate: true
        };

        if ((<any>window).cordova) {
            this.pickingStoreService.postLineRequestFiltered(filtersToGetProducts).then(async (res: PickingStoreModel.ResponseLineRequestsFiltered) => {
              if (res.code == 200 || res.code == 201) {
                this.pickingProvider.listProductsToStorePickings = res.data.pending;
                this.pickingProvider.listProductsProcessedToStorePickings = res.data.processed;
                this.pickingProvider.listFiltersPicking = res.data.filters;
                if (this.pickingProvider.listProductsProcessedToStorePickings && this.pickingProvider.listProductsProcessedToStorePickings.length > 0) {
                  await this.pickingScanditService.picking(true);
                  this.router.navigate(['/welcome']);
                } else {
                  this.message = 'No hay ningún producto procesado para asociar a embalajes.';
                }
              }
            });
          } else {
            console.error('Error Subscribe::Change status for picking-store::', res);
          }

      } else {
        this.message = 'No hay ningún producto procesado para asociar a embalajes.';
      }
    },async (error) => {
      await this.intermediaryService.dismissLoading();
      console.error('Error Subscribe::List line-requests by store::', error);
    }).catch(async (error) => {
      await this.intermediaryService.dismissLoading();
      console.error('Error Subscribe::List line-requests by store::', error);
    });
  }

}
