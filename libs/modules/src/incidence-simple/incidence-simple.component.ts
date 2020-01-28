import {Component, Input, OnInit} from '@angular/core';
import {IncidencesService} from "../../../services/src/lib/endpoint/incidences/incidences.service";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {IncidenceModel} from "../../../services/src/models/endpoints/Incidence";
import { IntermediaryService } from '@suite/services';
import { TimesToastType } from '../../../services/src/models/timesToastType';

@Component({
  selector: 'incidence-simple',
  templateUrl: './incidence-simple.component.html',
  styleUrls: ['./incidence-simple.component.scss']
})
export class IncidenceSimpleComponent implements OnInit {

  @Input() incidence: IncidenceModel.Incidence;

  constructor(
    public incidencesService: IncidencesService,
    private intermediaryService: IntermediaryService
  ) {}

  ngOnInit() {

  }

  attendIncidence() {
    let incidenceAttended: boolean = this.incidence.status.status.id == 1;
    let incidenceId: number = this.incidence.info.id;
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

            this.intermediaryService.presentToastSuccess(res.body.message, TimesToastType.DURATION_SUCCESS_TOAST_3750);
            this.incidencesService.initPreview();
          } else {
            this.intermediaryService.presentToastError(res.body.message);
          }
        });
      }, (error: HttpErrorResponse) => {
        this.intermediaryService.presentToastError(error.message);
      });
  }

}
