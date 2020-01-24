import { Component, Input, OnInit } from '@angular/core';
import { IntermediaryService, TypeUsersProcesses, UserProcessesService } from '@suite/services';
import { PickingModel } from "../../../../services/src/models/endpoints/Picking";
import { PickingService } from "../../../../services/src/lib/endpoint/picking/picking.service";
import { AlertController, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
import { SetWorkwaveAliveService } from "../../../../services/src/lib/endpoint/set-workwave-alive/set-workwave-alive.service";
import { TimesToastType } from '../../../../services/src/models/timesToastType';

@Component({
  selector: 'list-user-assignment-template',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListUserAssignmentTemplateComponent implements OnInit {

  @Input() workwaveId: number = 1;
  public pickingAssignments: PickingModel.Picking[] = [];
  public usersPicking: TypeUsersProcesses.UsersProcesses[] = [];
  private loading = null;

  constructor(
    private userProcessesService: UserProcessesService,
    private pickingService: PickingService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private intermediaryService: IntermediaryService,
    private router: Router,
    private setWorkwaveAliveService: SetWorkwaveAliveService
  ) { }

  ngOnInit() {
    this.pickingService
      .getShow(this.workwaveId)
      .subscribe((res: PickingModel.ResponseShow) => {
        if (res.code === 200 || res.code === 201) {
          this.pickingAssignments = res.data;
        } else {

        }
      }, (error: PickingModel.ErrorResponse) => {

      });

    this.userProcessesService
      .getIndex()
      .subscribe((res: Array<TypeUsersProcesses.UsersProcesses>) => {
        // TODO remove line when enable below filter
        this.usersPicking = res;

        // TODO remove comment to enable users filter to show only users with picking permission
        /*this.usersPicking = res.filter((user: TypeUsersProcesses.UsersProcesses) => {
          let userHasPicking = false;
          for (let process of user.processes) {
            if (process.processType == 5) {
              userHasPicking = true;
            }
          }
          return userHasPicking;
        });*/
      });

    this.setWorkwaveAlive();
  }

  setWorkwaveAlive() {
    // this.setWorkwaveAliveService.intervalExecutedId = setInterval(() => {
    //   if (this.router.url.match(/assign\/user\/picking\/([0-9]+)/)) {
    //     this.setWorkwaveAliveService.postKeepWorkwaveAlive(this.workwaveId);
    //   } else {
    //     if (typeof this.setWorkwaveAliveService.intervalExecutedId != 'undefined' && this.setWorkwaveAliveService.intervalExecutedId != null) {
    //       clearInterval(this.setWorkwaveAliveService.intervalExecutedId);
    //       this.setWorkwaveAliveService.intervalExecutedId = null;
    //     }
    //   }
    // }, 10 * 1000);
  }

  async savePicking() {
    for (let assignment of this.pickingAssignments) {
      if (!assignment.user || !assignment.user.id) {
        const alert = await this.alertController.create({
          subHeader: 'Atención',
          message: 'Hay algunos picking para los que no se ha seleccionado ningún operario. Seleccione alguno antes de continuar.',
          buttons: ['Cerrar']
        });
        return await alert.present();
      }
    }

    this.showLoading('Asignando usuarios...').then(() => {
      this.pickingService
        .putUpdate(this.workwaveId, this.pickingAssignments)
        .subscribe((res: PickingModel.ResponseUpdate) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          if (res.code === 200 || res.code === 201) {
            this.intermediaryService.presentToastSuccess('Se ha guardado la asignación de usuarios dada para las tareas picking.', TimesToastType.DURATION_SUCCESS_TOAST_3750);
            this.router.navigate(['workwaves-scheduled']);
          } else {
            this.intermediaryService.presentToastError('Ha ocurrido un error al guardar la asignación de usuarios para las tareas picking.');
          }
        }, (error: PickingModel.ErrorResponse) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          this.intermediaryService.presentToastError('Ha ocurrido un error al guardar la asignación de usuarios para las tareas picking.');
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
