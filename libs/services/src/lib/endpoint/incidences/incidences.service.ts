import {Injectable} from '@angular/core';
import {IncidenceModel} from "../../../models/endpoints/Incidence";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {AuthenticationService} from "@suite/services";
import {Observable} from "rxjs";
import {PATH} from "../../../../../../config/base";

export const PATH_GET_INDEX: string = PATH('Incidences', 'Index');
export const PATH_PUT_UPDATE: string = PATH('Incidences', 'Update attended').slice(0, -1);

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidencesService {

  /**urls for the incidences services */
  private getIndexUrl:string = environment.apiBase+"/incidences";
  private putUpdateUrl:string = environment.apiBase+"/incidences/{{id}}";

  private _incidencesList: IncidenceModel.Incidence[];
  private _incidencesPreviewList: IncidenceModel.Incidence[];
  private _incidencesQuantity: number;
  private _incidencesUnattendedQuantity: number;
  private _quantityIncidencesToShow: number = 5;

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  public init() {
    // Get all incidences
    this.getIndex()
      .then((data: Observable<HttpResponse<IncidenceModel.ResponseIndex>>) => {
        data.subscribe((res: HttpResponse<IncidenceModel.ResponseIndex>) => {
          if (res.body.code == 200) {
            this.incidencesList = res.body.data.reverse();
          }
        });
      });
  }

  // IncidencesList: Getter and Setter
  get incidencesList(): IncidenceModel.Incidence[] {
    return this._incidencesList;
  }
  set incidencesList(value: IncidenceModel.Incidence[]) {
    this._incidencesList = value;
    this._incidencesQuantity = value.length;
    const unattendedIncidences = value.filter(incidence => !incidence.attended);
    this._incidencesUnattendedQuantity = unattendedIncidences.length;
    this._incidencesPreviewList = unattendedIncidences.slice(0, this.quantityIncidencesToShow);
  }

  // IncidencesPreviewList: Getter
  get incidencesPreviewList(): IncidenceModel.Incidence[] {
    return this._incidencesPreviewList;
  }

  // IncidencesQuantity: Getter
  get incidencesQuantity(): number {
    return this._incidencesQuantity;
  }

  // IncidencesUnattendedQuantity: Getter
  get incidencesUnattendedQuantity(): number {
    return this._incidencesUnattendedQuantity;
  }

  // QuantityIncidencesToShow: Getter and Setter: Quantity of incidences to show in popover
  get quantityIncidencesToShow(): number {
    return this._quantityIncidencesToShow;
  }
  set quantityIncidencesToShow(value: number) {
    this._quantityIncidencesToShow = value;
  }

  // Dynamic array to use the incidences limit to show in popover
  arrayIncidencesToShow(): number[] {
    let incidencesToShow: number[] = [];

    for (let i = 0; i < this.quantityIncidencesToShow; i++) {
      incidencesToShow.push(i);
    }

    return incidencesToShow;
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

}
