import {Component, OnInit, ViewChild} from '@angular/core';
import {IncidencesService} from "../../../services/src/lib/endpoint/incidences/incidences.service";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {IncidenceModel} from "../../../services/src/models/endpoints/Incidence";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {PageEvent} from "@angular/material";
import {animate, state, style, transition, trigger} from "@angular/animations";
import { IntermediaryService, TypeModel } from '@suite/services';
import AttendedOption = IncidenceModel.AttendedOption;
import { PaginatorComponent } from '../components/paginator/paginator.component';

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
  public listAttendedOptions: AttendedOption[];
  public attendedSelected: AttendedOption;
  public textToSearch: string;
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public incidencesService: IncidencesService,
    private dateTimeParserService: DateTimeParserService,
    private intermediaryService: IntermediaryService
  ) {}

  ngOnInit() {
    this.incidencesService.init();
    this.incidencesService.incidencesQuantityList
    this.typeSelected = this.incidencesService.listIncidencesTypes[0];
    this.listenPaginatorChanges();
    this.actualPageFilter = this.incidencesService.defaultFilters;


    this.listAttendedOptions = [
      {
        id: 0,
        value: 'Todas'
      },
      {
        id: 1,
        value: 'Atendidas'
      },
      {
        id: 2,
        value: 'No atendidas'
      }];
    this.attendedSelected = this.listAttendedOptions[0];
  }

  listenPaginatorChanges() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.actualPageFilter.page = page.pageIndex;
      this.actualPageFilter.size = page.pageSize;

      this.searchIncidences(this.actualPageFilter);
    });
    this.searchIncidences(this.actualPageFilter);
  }

  attendIncidence(event, incidence: IncidenceModel.Incidence) {
    event.stopPropagation();

    let incidenceAttended: boolean = !incidence.attended;
    let incidenceId: number = incidence.id;
    this.incidencesService
      .putUpdate(incidenceId, incidenceAttended)
      .then((data: Observable<HttpResponse<IncidenceModel.ResponseUpdate>>) => {
        data.subscribe((res: HttpResponse<IncidenceModel.ResponseUpdate>) => {
          if (res.body.code === 200 || res.body.code === 201) {
            let okMessage = '';
            if (incidenceAttended) {
              okMessage = 'La notificación se ha marcado como atendida';
            } else {
              okMessage = 'La notificación se ha marcado como desatendida';
            }

            this.intermediaryService.presentToastSuccess(okMessage);
            this.incidencesService.init(this.actualPageFilter);
          } else {
            this.intermediaryService.presentToastError(res.body.message);
          }
        });
      }, (error: HttpErrorResponse) => {
        this.intermediaryService.presentToastError(error.message);
      });
  }

  changeFilters(data: IncidenceModel.IncidenceFilters) {
    this.typeSelected = data.type;
    this.attendedSelected = data.attended;
    this.textToSearch = data.text;

    if (this.typeSelected.id === 0) {
      delete this.actualPageFilter.type;
    } else {
      this.actualPageFilter.type = this.typeSelected.id;
    }

    if (this.attendedSelected.id === 0) {
      delete this.actualPageFilter.attended;
    } else {
      this.actualPageFilter.attended = this.attendedSelected.id;
    }

    if (this.textToSearch) {
      this.actualPageFilter.text = this.textToSearch;
    } else {
      delete this.actualPageFilter.text;
    }

    this.actualPageFilter.page = 0;

    this.searchIncidences(this.actualPageFilter);
  }

  private searchIncidences(parameters: IncidenceModel.SearchParameters) {
    this.incidencesService
      .postSearch(parameters)
      .then((res: IncidenceModel.ResponseSearch) => {
        if (res.code === 200) {
          this.incidencesService.incidencesQuantityList = res.data.count_search;
          this.paginator.length = res.data.count;
          this.paginator.pageIndex = res.data.pagination ? res.data.pagination.selectPage: this.actualPageFilter.page;
          this.paginator.lastPage = res.data.pagination ? res.data.pagination.lastPage : Math.ceil(res.data.count/this.actualPageFilter.size);
          this.incidencesService.incidencesUnattendedQuantity = res.data.count;
          this.incidencesService.incidencesList = res.data.incidences;
        } else {
          console.error('Error to try search Incidences with Filters', res);
        }
      }, (error) => {
        console.error('Error to try search Incidences with Filters', error);
      });
  }

  showDateTime(dateToFormat) : string {
    return this.dateTimeParserService.dateTime(dateToFormat);
  }

}
