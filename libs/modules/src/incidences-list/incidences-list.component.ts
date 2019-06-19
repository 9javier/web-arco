import {Component, OnInit, ViewChild} from '@angular/core';
import {IncidencesService} from "../../../services/src/lib/endpoint/incidences/incidences.service";
import {ToastController} from "@ionic/angular";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {IncidenceModel} from "../../../services/src/models/endpoints/Incidence";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {MatPaginator, PageEvent} from "@angular/material";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {TypeModel} from "@suite/services";

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
  public expandedElement: IncidenceModel.Incidence | null;
  private actualPageFilter: IncidenceModel.SearchParameters;
  public typeSelected: TypeModel.Type;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public incidencesService: IncidencesService,
    private dateTimeParserService: DateTimeParserService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.incidencesService.init();
    this.typeSelected = this.incidencesService.listIncidencesTypes[0];
    this.listenPaginatorChanges();
    this.actualPageFilter = this.incidencesService.defaultFilters;
  }

  listenPaginatorChanges() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.actualPageFilter.page = page.pageIndex;
      this.actualPageFilter.size = page.pageSize;

      this.searchIncidences(this.actualPageFilter);
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
            this.incidencesService.init(this.actualPageFilter);
          } else {
            this.presentToast(res.body.message, 'danger');
          }
        });
      }, (error: HttpErrorResponse) => {
        this.presentToast(error.message, 'danger');
      });
  }

  filterByType() {
    if (this.typeSelected.id == 0) {
      delete this.actualPageFilter.type;
    } else {
      this.actualPageFilter.type = this.typeSelected.id;
    }
    this.actualPageFilter.page = 0;
    this.paginator.pageIndex = 0;

    this.searchIncidences(this.actualPageFilter);
  }

  private searchIncidences(parameters: IncidenceModel.SearchParameters) {
    this.incidencesService
      .postSearch(parameters)
      .subscribe((res: IncidenceModel.ResponseSearch) => {
        this.incidencesService.incidencesQuantity = res.data.count_search;
        this.incidencesService.incidencesUnattendedQuantity = res.data.count;
        this.incidencesService.incidencesList = res.data.incidences;
      }, error => {
        console.warn('Error Subscribe::Search Incidences with Filters');
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
