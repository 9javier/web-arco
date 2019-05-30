import { Component, OnInit } from '@angular/core';
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import {NavigationExtras, NavigationStart, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import { Event as NavigationEvent } from "@angular/router";
import {AlertController, LoadingController, ToastController} from "@ionic/angular";

@Component({
  selector: 'list-workwaves-templates',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwavesTemplatesComponent implements OnInit {

  public workwavesTemplates: any[];
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
          if (event.url == '/workwaves-templates') {
            this.loadWorkwavesTemplates();
          }
        }
      );
  }

  ngOnInit() {
    this.loadWorkwavesTemplates();
  }

  loadWorkwavesTemplates() {
    this.workwavesService
      .getListTemplates()
      .then((data: Observable<HttpResponse<WorkwaveModel.ResponseListTemplates>>) => {
        data.subscribe((res: HttpResponse<WorkwaveModel.ResponseListTemplates>) => {
          this.workwavesTemplates = res.body.data;
        });
      });
  }

  addWorkwave() {
    this.workwavesService.lastWorkwaveEdited = null;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: 3
      }
    };

    this.router.navigate(['workwave-template'], navigationExtras);
  }

  editWorkwave(workwave) {
    this.workwavesService.lastWorkwaveEdited = workwave;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: 3
      }
    };

    this.router.navigate(['workwave-template'], navigationExtras);
  }

  selectAll() {
    if (this.allSelected) {
      for (let workwave of this.workwavesTemplates) {
        workwave.checked = false;
      }
      this.allSelected = false;
    } else {
      for (let workwave of this.workwavesTemplates) {
        workwave.checked = true;
      }
      this.allSelected = true;
    }
  }

  async removeWorkwave() {
    let workwavesToRemove = this.workwavesTemplates.filter((workwave) => {
      return workwave.checked;
    });

    if (workwavesToRemove && workwavesToRemove.length > 0) {
      let message = ''+workwavesToRemove.length;

      if (workwavesToRemove.length == 1) {
        message += ' Plantilla de Ola de Trabajo va a ser eliminada';
      } else {
        message += ' Plantillas de Olas de Trabajo van a ser eliminadas';
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
                messageLoading += 'la Plantilla de Ola';
              } else {
                messageLoading += 'las Plantillas de Olas';
              }

              this.showLoading(messageLoading+' de Trabajo...');
              for (let workwave of workwavesToRemove) {
                this.workwavesService
                  .deleteDestroyTemplate(workwave.id)
                  .then((data: Observable<HttpResponse<WorkwaveModel.ResponseDestroyTemplate>>) => {
                    data.subscribe((res: HttpResponse<WorkwaveModel.ResponseDestroyTemplate>) => {
                      if (this.loading) {
                        this.loading.dismiss();
                        this.loading = null;
                      }
                      this.loadWorkwavesTemplates();
                      if (res.body.code == 200 || res.body.code == 201) {
                        let messageToast = '';

                        if (workwavesToRemove.length == 1) {
                          messageToast = 'La Plantilla de Ola de Trabajo ha sido eliminada.';
                        } else {
                          messageToast = workwavesToRemove.length+' Plantillas de Olas de Trabajo han sido eliminadas.';
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
