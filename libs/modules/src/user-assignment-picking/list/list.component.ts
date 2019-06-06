import {Component, Input, OnInit} from '@angular/core';
import {TypeUsersProcesses, UserProcessesService} from "@suite/services";
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {PickingService} from "../../../../services/src/lib/endpoint/picking/picking.service";
import {AlertController, LoadingController, ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

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
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.pickingService
      .getShow(this.workwaveId)
      .subscribe((res: PickingModel.ResponseShow) => {
        if (res.code == 200 || res.code == 201) {
          this.pickingAssignments = res.data;
        } else {

        }
      }, (error: PickingModel.ErrorResponse) => {

      });

    this.userProcessesService
      .getIndex()
      .subscribe((res: Array<TypeUsersProcesses.UsersProcesses>) => {
        this.usersPicking = res.filter((user: TypeUsersProcesses.UsersProcesses) => {
          let userHasPicking = false;
          for (let process of user.processes) {
            if (process.processType == 5) {
              userHasPicking = true;
            }
          }
          return userHasPicking;
        });
      })
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
          if (res.code == 200 || res.code == 201) {
            this.presentToast('Se ha guardado la asignación de usuarios dada para las tareas picking.', 'success');
            this.router.navigate(['workwaves-scheduled']);
          } else {
            this.presentToast('Ha ocurrido un error al guardar la asignación de usuarios para las tareas picking.', 'danger');
          }
        }, (error: PickingModel.ErrorResponse) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          this.presentToast('Ha ocurrido un error al guardar la asignación de usuarios para las tareas picking.', 'danger');
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

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3750,
      color: color || "primary"
    });
    toast.present();
  }

}
