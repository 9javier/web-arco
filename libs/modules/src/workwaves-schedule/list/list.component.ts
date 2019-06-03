import { Component, OnInit } from '@angular/core';
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import {Event as NavigationEvent, NavigationExtras, NavigationStart, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {AlertController, LoadingController, ToastController} from "@ionic/angular";

@Component({
  selector: 'list-workwaves-schedule',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwavesScheduleComponent implements OnInit {

  public workwavesScheduled: any[];
  public allSelected: boolean = false;
  public loading: any = null;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private workwavesService: WorkwavesService,
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter((event: NavigationEvent) => {
          return (event instanceof NavigationStart);
        })
      )
      .subscribe((event: NavigationStart) => {
          if (event.url == '/workwaves-scheduled') {
            this.loadWorkwavesScheduled();
          }
        }
      );
  }

  ngOnInit() {
    this.loadWorkwavesScheduled();
  }

  loadWorkwavesScheduled() {
    this.workwavesService
      .getListScheduled()
      .then((data: Observable<HttpResponse<WorkwaveModel.ResponseListScheduled>>) => {
        data.subscribe((res: HttpResponse<WorkwaveModel.ResponseListScheduled>) => {
          this.workwavesScheduled = res.body.data;
        });
      });
  }

  addWorkwave() {
    this.workwavesService.lastWorkwaveEdited = null;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: 2
      }
    };

    this.router.navigate(['workwave-template'], navigationExtras);
  }

  editWorkwave(workwave) {
    this.workwavesService.lastWorkwaveEdited = workwave;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: workwave.type == 4 ? 2 : workwave.type
      }
    };

    this.router.navigate(['workwave-template'], navigationExtras);
  }

  selectAll() {
    if (this.allSelected) {
      for (let workwave of this.workwavesScheduled) {
        workwave.checked = false;
      }
      this.allSelected = false;
    } else {
      for (let workwave of this.workwavesScheduled) {
        workwave.checked = true;
      }
      this.allSelected = true;
    }
  }

  async removeWorkwave() {
    let workwavesToRemove = this.workwavesScheduled.filter((workwave) => {
      return workwave.checked;
    });

    if (workwavesToRemove && workwavesToRemove.length > 0) {
      let message = ''+workwavesToRemove.length;

      if (workwavesToRemove.length == 1) {
        message += ' Ola de Trabajo va a ser eliminada';
      } else {
        message += ' Olas de Trabajo van a ser eliminadas';
      }

      const alert = await this.alertController.create({
        subHeader: 'Atención',
        message: message+'. ¿Está usted seguro de querer continuar?',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Eliminar',
            handler: () => {
              let messageLoading = 'Eliminando ';

              if (workwavesToRemove.length == 1) {
                messageLoading += 'la Ola';
              } else {
                messageLoading += 'las Olas';
              }

              this.showLoading(messageLoading+' de Trabajo...');
              for (let workwave of workwavesToRemove) {
                this.workwavesService
                  .deleteDestroyTask(workwave.id)
                  .then((data: Observable<HttpResponse<WorkwaveModel.ResponseDestroyTask>>) => {
                    data.subscribe((res: HttpResponse<WorkwaveModel.ResponseDestroyTask>) => {
                      if (this.loading) {
                        this.loading.dismiss();
                        this.loading = null;
                      }
                      this.loadWorkwavesScheduled();
                      if (res.body.code == 200 || res.body.code == 201) {
                        let messageToast = '';

                        if (workwavesToRemove.length == 1) {
                          messageToast = 'La Ola de Trabajo ha sido eliminada.';
                        } else {
                          messageToast = workwavesToRemove.length+' Olas de Trabajo han sido eliminadas.';
                        }

                        this.presentToast(messageToast, 'success');
                      } else {
                        this.presentToast(res.body.message, 'danger');
                      }
                    }, (error: HttpErrorResponse) => {
                      if (this.loading) {
                        this.loading.dismiss();
                        this.loading = null;
                      }
                      this.presentToast(error.message, 'danger');
                    });
                  }, (error: HttpErrorResponse) => {
                    if (this.loading) {
                      this.loading.dismiss();
                      this.loading = null;
                    }
                    this.presentToast(error.message, 'danger');
                  });
              }
            }
          }]
      });
      return await alert.present();
    }
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
