import {Injectable} from '@angular/core';
import {IncidenceModel} from "../../../models/endpoints/Incidence";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {AuthenticationService, TypeModel} from "@suite/services";
import {from, Observable} from "rxjs";
import { environment } from '../../../environments/environment';
import {switchMap} from "rxjs/operators";
import {RequestsProvider} from "../../../providers/requests/requests.provider";
import {HttpRequestModel} from "../../../models/endpoints/HttpRequest";

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
  private _incidencesQuantityPopover: number;
  private _incidencesQuantityList: number;
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
    8: 'Producto no encontrado en picking',
    9: 'Producto no recibido',
    10: 'Producto retiquetado',
    11: 'Sorter - calle erróneo',
    12: 'Sorter - no entrada',
    13: 'Sorter - producto eliminado sin jaula'
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
    {id: 8, name: 'Producto no encontrado en picking'},
    {id: 9, name: 'Producto no recibido'},
    {id: 10, name: 'Producto retiquetado'},
    {id: 11, name: 'Sorter - calle erróneo'},
    {id: 12, name: 'Sorter - no entrada'},
    {id: 13, name: 'Sorter - producto eliminado sin jaula'}
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

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}

  public initPreview() {
    this.postSearch(this._defaultFiltersPreview)
      .then((res: IncidenceModel.ResponseSearch) => {
        if (res.code == 200) {
          this._incidencesPreviewList = res.data.incidences;
          this._incidencesUnattendedQuantity = res.data.count;
          this._incidencesQuantityPopover = res.data.count_search;
        } else {
          console.error('Error to try search Incidences with Filters', res);
        }
      }, (error) => {
        console.error('Error to try search Incidences with Filters', error);
      });
  }

  public init(filters?: IncidenceModel.SearchParameters) {
    let filtersSearch = filters || this._defaultFilters;

    this.postSearch(filtersSearch)
      .then((res: IncidenceModel.ResponseSearch) => {
        if (res.code == 200) {
          this._incidencesList = res.data.incidences;
          this._incidencesUnattendedQuantity = res.data.count;
          this._incidencesQuantityList = res.data.count_search;
        } else {
          console.error('Error to try search Incidences with Filters', res);
        }
      }, (error) => {
        console.error('Error to try search Incidences with Filters', error);
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

  // IncidencesQuantityPopover: Getter and Setter
  get incidencesQuantityPopover(): number {
    return this._incidencesQuantityPopover;
  }
  set incidencesQuantityPopover(value: number) {
    this._incidencesQuantityPopover = value;
  }

  // IncidencesQuantityList: Getter and Setter
  get incidencesQuantityList(): number {
    return this._incidencesQuantityList;
  }
  set incidencesQuantityList(value: number) {
    this._incidencesQuantityList = value;
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
    return JSON.parse(JSON.stringify(this._defaultFilters));
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

  public postSearch(parameters: IncidenceModel.SearchParameters) : Promise<HttpRequestModel.Response> {
    return this.requestsProvider.post(this.postSearchUrl, parameters);
  }

}
