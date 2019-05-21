import {Component, Input, OnInit} from '@angular/core';
import {IncidencesService} from "../../../services/src/lib/endpoint/incidences/incidences.service";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {IncidenceModel} from "../../../services/src/models/endpoints/Incidence";
import {ToastController} from "@ionic/angular";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'incidence-complex',
  templateUrl: './incidence-complex.component.html',
  styleUrls: ['./incidence-complex.component.scss']
})
export class IncidenceComplexComponent implements OnInit {

  @Input() incidence: IncidenceModel.Incidence;

  constructor(
    private incidencesService: IncidencesService,
    private toastController: ToastController,
    private dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {

  }

  attendIncidence() {
    let incidenceAttended: boolean = !this.incidence.attended;
    let incidenceId: number = this.incidence.id;
    this.incidencesService
      .putUpdate(incidenceId, incidenceAttended)
      .then((data: Observable<HttpResponse<IncidenceModel.ResponseUpdate>>) => {
        data.subscribe((res: HttpResponse<IncidenceModel.ResponseUpdate>) => {
          if (res.body.code == 200 || res.body.code == 201) {
            let okMessage = '';
            if (incidenceAttended) {
              okMessage = 'La notificación se ha marcado como atendida';
            } else {
              okMessage = 'La notificación se ha marcado como desatendida';
            }

            this.presentToast(okMessage, 'success');
            this.incidencesService.init();
          } else {
            this.presentToast(res.body.message, 'danger');
          }
        });
      }, (error: HttpErrorResponse) => {
        this.presentToast(error.message, 'danger');
      });
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

  showDateTime(dateToFormat) : string {
    return this.dateTimeParserService.dateTime(dateToFormat);
  }

}
