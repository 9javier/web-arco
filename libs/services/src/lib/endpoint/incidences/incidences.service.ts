import {Injectable} from '@angular/core';
import {IncidenceModel} from "../../../models/endpoints/Incidence";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {AuthenticationService, TypeModel} from "@suite/services";
import {from, Observable} from "rxjs";
import { environment } from '../../../environments/environment';
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class IncidencesService {

  /**urls for the incidences services */
  private getIndexUrl:string = environment.apiBase+"/incidences";
  private putUpdateUrl:string = environment.apiBase+"/incidences/{{id}}";
  private postSearchUrl: string = environment.apiBase+"/incidences";

  private _incidencesList: IncidenceModel.Incidence[];
  private _incidencesPreviewList: IncidenceModel.Incidence[];
  private _incidencesQuantity: number;
  private _incidencesUnattendedQuantity: number;
  private _quantityIncidencesToShow: number = 5;
  private _incidenceType: any = {
    1: 'Nuevo par registrado',
    2: 'Revertir posición',
    3: 'Otro',
    4: 'Ubicación desactivada',
    5: 'Movimiento global',
    6: 'Ubicación bloqueada',
    7: 'Respuesta no recibida de Avelon',
    8: 'Producto no encontrado en picking'
  };
  private _listIncidencesTypes: TypeModel.Type[] = [
    {id: 0, name: 'Todos los tipos'},
    {id: 1, name: 'Nuevo par registrado'},
    {id: 2, name: 'Revertir posición'},
    {id: 3, name: 'Otro'},
    {id: 4, name: 'Ubicación desactivada'},
    {id: 5, name: 'Movimiento global'},
    {id: 6, name: 'Ubicación bloqueada'},
    {id: 7, name: 'Respuesta no recibida de Avelon'},
    {id: 8, name: 'Producto no encontrado en picking'}
  ];
  private _defaultFiltersPreview: IncidenceModel.SearchParameters = {
    order: 'DESC',
    page: 0,
    size: this._quantityIncidencesToShow
  };
  private _defaultFilters: IncidenceModel.SearchParameters = {
    order: 'ASC',
    page: 0,
    size: 10
  };

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  public init(filters?: IncidenceModel.SearchParameters) {
    this.postSearch(this._defaultFiltersPreview)
      .subscribe((res: IncidenceModel.ResponseSearch) => {
        this._incidencesPreviewList = res.data.incidences;
      }, error => {
        console.warn('Error Subscribe::Search Incidences with Filters');
      });

    let filtersSearch = filters || this._defaultFilters;

    this.postSearch(filtersSearch)
      .subscribe((res: IncidenceModel.ResponseSearch) => {
        this._incidencesList = res.data.incidences;
        this._incidencesUnattendedQuantity = res.data.count;
        this._incidencesQuantity = res.data.count_search;
      }, error => {
        console.warn('Error Subscribe::Search Incidences with Filters');
      });
  }

  // IncidencesList: Getter and Setter
  get incidencesList(): IncidenceModel.Incidence[] {
    return this._incidencesList;
  }
  set incidencesList(value: IncidenceModel.Incidence[]) {
    this._incidencesList = value;
  }

  // IncidencesPreviewList: Getter
  get incidencesPreviewList(): IncidenceModel.Incidence[] {
    return this._incidencesPreviewList;
  }

  // IncidencesQuantity: Getter and Setter
  get incidencesQuantity(): number {
    return this._incidencesQuantity;
  }
  set incidencesQuantity(value: number) {
    this._incidencesQuantity = value;
  }

  // IncidencesUnattendedQuantity: Getter and Setter
  get incidencesUnattendedQuantity(): number {
    return this._incidencesUnattendedQuantity;
  }
  set incidencesUnattendedQuantity(value: number) {
    this._incidencesUnattendedQuantity = value;
  }

  // Custom method to return type literal using type-id
  getIncidenceTypeText(type: number): string {
    return this._incidenceType[type];
  }

  // ListIncidencesTypes: Getter
  get listIncidencesTypes(): TypeModel.Type[] {
    return this._listIncidencesTypes;
  }

// DefalutFilters: Getter
  get defaultFilters(): IncidenceModel.SearchParameters {
    return this._defaultFilters;
  }

  // Index: Request to endpoint to ist all incidences
  private async getIndex(): Promise<Observable<HttpResponse<IncidenceModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.get<IncidenceModel.ResponseIndex>(this.getIndexUrl, {
      headers: headers,
      observe: 'response'
    });
  }

  public async putUpdate(incidenceId: number, incidenceAttended: boolean):  Promise<Observable<HttpResponse<IncidenceModel.ResponseUpdate>>> {
    let incidence: any = {
      attended: incidenceAttended
    };

    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });
    return this.http.put<IncidenceModel.ResponseUpdate>(
      this.putUpdateUrl.replace("{{id}}",String(incidenceId)),
      incidence,
      {
        headers: headers,
        observe: 'response'
      });
  }

  public postSearch(parameters: IncidenceModel.SearchParameters) : Observable<IncidenceModel.ResponseSearch> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<IncidenceModel.ResponseSearch>(this.postSearchUrl, parameters, { headers });
    }));
  }

}
