import {Component, OnInit, ViewChild} from '@angular/core';
import {IncidencesService} from "../../../services/src/lib/endpoint/incidences/incidences.service";
import {ToastController} from "@ionic/angular";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {IncidenceModel} from "../../../services/src/models/endpoints/Incidence";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'incidences-list',
  templateUrl: './incidences-list.component.html',
  styleUrls: ['./incidences-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IncidencesListComponent implements OnInit {

  public displayedColumns = ['id', 'title', 'typeIncidence', 'btnAttend'];
  public dataSource: MatTableDataSource<IncidenceModel.Incidence>;
  public resultsLength: number = 0;
  public expandedElement: IncidenceModel.Incidence | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public incidencesService: IncidencesService,
    private dateTimeParserService: DateTimeParserService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.incidencesService.incidencesList);
    this.resultsLength = this.incidencesService.incidencesList.length;
    this.dataSource.paginator = this.paginator;
    this.listenPaginatorChanges();
  }

  listenPaginatorChanges() {
    this.paginator.page.subscribe(page => {
      console.debug("Test::Page -> ", page);
    });
  }

  attendIncidence(event, incidence: IncidenceModel.Incidence) {
    event.stopPropagation();

    let incidenceAttended: boolean = !incidence.attended;
    let incidenceId: number = incidence.id;
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
            this.dataSource = new MatTableDataSource(this.incidencesService.incidencesList);
            this.resultsLength = this.incidencesService.incidencesList.length;
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
