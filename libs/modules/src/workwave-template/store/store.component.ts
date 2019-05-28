import { Component, OnInit } from '@angular/core';
import {LoadingController, ModalController, NavParams, ToastController} from "@ionic/angular";
import {WorkwavesService} from "../../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import {DateTimeParserService} from "../../../../services/src/lib/date-time-parser/date-time-parser.service";
import {NgxMaterialTimepickerTheme} from "ngx-material-timepicker";

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  private workwaveType: string = 'schedule';

  public workwave: WorkwaveModel.Workwave;
  public typeWorkwave: number;
  public listStores: any[];
  public dateStart;

  public loading = null;
  public editing: boolean = false;

  public darkTheme: NgxMaterialTimepickerTheme = {};

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private workwavesService: WorkwavesService,
    private dateTimeParserService: DateTimeParserService,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.typeWorkwave = this.navParams.data.type;
    if (this.typeWorkwave == 1) {
      this.workwaveType = 'run'
    } else if (this.typeWorkwave == 3) {
      this.workwaveType = 'template'
    }

    if (this.navParams.data.workwave) {
      this.editing = true;
    }

    this.workwave = this.navParams.data.workwave || {};
    this.initializeAllFields();
    this.listStores = this.navParams.data.listStores;

    this.darkTheme = {
      container: {
        bodyBackgroundColor: '#EEEEEE',
        buttonColor: '#212121',
        primaryFontFamily: '#212121'
      },
      dial: {
        dialBackgroundColor: '#212121',
      },
      clockFace: {
        clockFaceBackgroundColor: '#fff',
        clockHandColor: '#212121',
        clockFaceTimeInactiveColor: '#212121'
      }
    }
  }

  goToList(save) {
    this.modalController.dismiss({save: save});
  }

  saveWorkwave() {
    if (!this.loading) {
      this.showLoading((this.editing ? 'Creando' : 'Editando') +' ola de trabajo...').then(() => {
        this.workwave.active = true;

        let workwaveStore: any = {};
        workwaveStore.warehouses = this.listStores;

        if (this.workwaveType == 'schedule') {
          workwaveStore.type = 2;
          this.workwave.date = this.dateTimeParserService.globalFormat(this.workwave.date);
          if (this.workwave.everyday) {
            this.workwave.date = this.dateTimeParserService.nowGlobalFormat();
          }
          workwaveStore.date = this.workwave.date;
          workwaveStore.time = this.workwave.time;
          workwaveStore.everyday = this.workwave.everyday;
        } else if (this.workwaveType == 'template') {
          workwaveStore.name = this.workwave.name;
          workwaveStore.description = this.workwave.description;
          workwaveStore.type = 3;
        } else {
          workwaveStore.type = 1;
          workwaveStore.executionDate = this.dateTimeParserService.dateTimeNoFormat();
        }

        if (this.editing) {
          workwaveStore.previousType = this.typeWorkwave;

          this.workwavesService
            .putUpdate(workwaveStore, this.workwave.id)
            .then((data: Observable<HttpResponse<WorkwaveModel.ResponseUpdate>>) => {
              data.subscribe((res: HttpResponse<WorkwaveModel.ResponseUpdate>) => {
                if (res.body.code == 200 || res.body.code == 201) {
                  if (this.loading) {
                    this.loading.dismiss();
                    this.loading = null;
                    this.goToList(true);
                  }
                  this.presentToast('Ola de trabajo actualizada', 'success');
                } else {
                  if (this.loading) {
                    this.loading.dismiss();
                    this.loading = null;
                  }
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
        } else {
          this.workwavesService
            .postStore(workwaveStore)
            .then((data: Observable<HttpResponse<WorkwaveModel.ResponseStore>>) => {
              data.subscribe((res: HttpResponse<WorkwaveModel.ResponseStore>) => {
                if (res.body.code == 200 || res.body.code == 201) {
                  if (this.loading) {
                    this.loading.dismiss();
                    this.loading = null;
                    this.goToList(true);
                  }
                  this.presentToast('Ola de trabajo creada', 'success');
                } else {
                  if (this.loading) {
                    this.loading.dismiss();
                    this.loading = null;
                  }
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
      });
    }
  }

  workwaveOk() {
    if (this.workwaveType == 'schedule') {
      if (this.workwave.time && (this.workwave.date || this.workwave.everyday)) {
        return false;
      }
    } else if (this.workwaveType == 'template') {
      if (this.workwave.name && this.workwave.description) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

  initializeAllFields() {
    if (this.workwave && this.workwave.id && this.typeWorkwave != 1) {
      if (this.typeWorkwave == 2) {
        this.workwave.name = null;
        this.workwave.description = null;
      } else if (this.typeWorkwave == 3) {
        this.workwave.date = null;
        this.workwave.time = null;
        this.workwave.everyday = false;
      } else if (this.typeWorkwave == 4) {
        this.workwave.name = null;
        this.workwave.description = null;
        this.workwave.everyday = true;
        this.workwave.date = null;
      }
    } else {
      this.workwave.name = null;
      this.workwave.description = null;
      this.workwave.date = null;
      this.workwave.time = null;
      this.workwave.everyday = false;
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
