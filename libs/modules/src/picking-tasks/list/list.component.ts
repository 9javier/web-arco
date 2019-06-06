import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "@suite/services";
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {PickingService} from "../../../../services/src/lib/endpoint/picking/picking.service";
import {Events, LoadingController} from "@ionic/angular";
import {ScanditService} from "../../../../services/src/lib/scandit/scandit.service";
import {ShoesPickingService} from "../../../../services/src/lib/endpoint/shoes-picking/shoes-picking.service";
import {ShoesPickingModel} from "../../../../services/src/models/endpoints/ShoesPicking";

@Component({
  selector: 'list-picking-tasks-template',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListPickingTasksTemplateComponent implements OnInit {

  private userId: number = 0;
  private loading = null;
  public pickingAssignments: PickingModel.Picking[] = [];
  private removeFirstPicking: boolean = false;

  constructor(
    private loadingController: LoadingController,
    private pickingService: PickingService,
    private scanditService: ScanditService,
    private authenticationService: AuthenticationService,
    private shoesPickingService: ShoesPickingService,
    private events: Events
  ) {}

  async ngOnInit() {
    this.userId = await this.authenticationService.getCurrentUserId();

    this.pickingService
      .getListByUser(this.userId)
      .subscribe((res: PickingModel.ResponseShow) => {
        if (res.code == 200 || res.code == 201) {
          this.pickingService.pickingAssignments = res.data;
        } else {

        }
      }, (error: PickingModel.ErrorResponse) => {

      });

    this.events.subscribe('picking:remove', () => {
      if (this.removeFirstPicking) {
        this.pickingService.pickingAssignments.shift();
        this.removeFirstPicking = false;
      }
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('picking:remove');
  }

  initPicking() {
    this.showLoading('Cargando productos...').then(() => {
      this.shoesPickingService
        .getListByPicking(this.pickingService.pickingAssignments[0].id)
        .subscribe((res: ShoesPickingModel.ResponseListyByPicking) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          let listProducts: ShoesPickingModel.ShoesPicking[] = res.data;
          this.removeFirstPicking = true;
          this.scanditService.picking(this.pickingService.pickingAssignments[0].id, listProducts);
        }, (error) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          console.debug('Test::Error Subscribe -> ', error);
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
