import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "@suite/services";
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {PickingService} from "../../../../services/src/lib/endpoint/picking/picking.service";
import {Events, LoadingController} from "@ionic/angular";
import {ScanditService} from "../../../../services/src/lib/scandit/scandit.service";
import {ShoesPickingService} from "../../../../services/src/lib/endpoint/shoes-picking/shoes-picking.service";
import {ShoesPickingModel} from "../../../../services/src/models/endpoints/ShoesPicking";
import {Router} from "@angular/router";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";
import {PickingScanditService} from "../../../../services/src/lib/scandit/picking/picking.service";
import {CarriersService} from "../../../../services/src/lib/endpoint/carriers/carriers.service";

@Component({
  selector: 'list-picking-tasks-template',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListPickingTasksTemplateComponent implements OnInit {

  private userId: number = 0;
  private loading = null;
  public pickingAssignments: PickingModel.Picking[] = [];
  private removePickingFinished: boolean = false;
  public isLoadingPickings: boolean = false;
  public hasPickingsLoaded: boolean = true;

  constructor(
    private events: Events,
    private router: Router,
    private loadingController: LoadingController,
    public pickingService: PickingService,
    private scanditService: ScanditService,
    private authenticationService: AuthenticationService,
    private shoesPickingService: ShoesPickingService,
    private pickingScanditService: PickingScanditService,
    private carriersService: CarriersService,
    private pickingProvider: PickingProvider
  ) {}

  async ngOnInit() {
    this.isLoadingPickings = true;

    this.userId = await this.authenticationService.getCurrentUserId();

    this.pickingService
      .getListByUser(this.userId)
      .subscribe((res: PickingModel.ResponseShow) => {
        if (res.code == 200 || res.code == 201) {
          this.pickingService.pickingAssignments = res.data;
          this.isLoadingPickings = false;
          if (res.data.length > 0) {
            this.pickingProvider.pickingSelectedToStart = this.pickingService.pickingAssignments[0];
            let pickingsStarted = this.pickingService.pickingAssignments.filter(picking => picking.status == 2);
            if (pickingsStarted.length > 0) {
              this.pickingProvider.pickingSelectedToStart = pickingsStarted[0];
            }
            this.hasPickingsLoaded = true;
          } else {
            this.hasPickingsLoaded = true;
          }
        } else {
          this.isLoadingPickings = false;
          this.hasPickingsLoaded = false;
        }
      }, (error: PickingModel.ErrorResponse) => {
        this.isLoadingPickings = false;
        this.hasPickingsLoaded = false;
      });

    this.events.subscribe('picking:remove', () => {
      if (this.removePickingFinished) {
        let tempPickingsList = new Array<PickingModel.Picking>();
        for (let iPicking in this.pickingService.pickingAssignments) {
          let picking = this.pickingService.pickingAssignments[iPicking];
          if (picking.id != this.pickingProvider.pickingSelectedToStart.id) {
            tempPickingsList.push(picking);
          }
        }
        this.pickingService.pickingAssignments = tempPickingsList;
        if (tempPickingsList.length > 0) {
          this.pickingProvider.pickingSelectedToStart = tempPickingsList[0];
        }
        this.removePickingFinished = false;
      }
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('picking:remove');
  }

  initPicking() {
    // console.log('passiamo per este metodo');
    
    this.showLoading('Cargando productos...').then(() => {
      this.carriersService
        .getUpdatePackingStatusInPicking(this.pickingProvider.pickingSelectedToStart.id)
        .subscribe((res) => {
          console.debug('Test::carriersService::getUpdatePackingStatusInPicking::res', res);
        }, (error) => {
          console.debug('Test::carriersService::getUpdatePackingStatusInPicking::error', error);
        });

      this.shoesPickingService
        .getPendingListByPicking(this.pickingProvider.pickingSelectedToStart.id)
        .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          let listProducts: ShoesPickingModel.ShoesPicking[] = res.data;
          this.removePickingFinished = true;

          this.pickingProvider.pickingId = this.pickingProvider.pickingSelectedToStart.id;
          this.pickingProvider.listProducts = listProducts;
          this.pickingProvider.typePacking = this.pickingProvider.pickingSelectedToStart.packingType;
          this.pickingProvider.typePicking = this.pickingProvider.pickingSelectedToStart.typePicking.id;
          this.pickingProvider.packingReference = this.pickingProvider.pickingSelectedToStart.packingRef;
          if (this.pickingProvider.method === 'manual') {
            this.router.navigate(['picking/manual']);
          } else {
            this.scanditService.picking(this.pickingProvider.pickingSelectedToStart.id, listProducts, this.pickingProvider.pickingSelectedToStart.packingType, this.pickingProvider.typePicking);
          }
        }, (error) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
        });
    });
  }

  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }
}
