import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DefectiveZonesModel } from '../../../models/endpoints/defective-zones-model';
import { DefectiveZonesChildModel } from '../../../models/endpoints/DefectiveZonesChild';
import { RequestsProvider } from "../../../providers/requests/requests.provider";
import { HttpRequestModel } from "../../../models/endpoints/HttpRequest";
import DefectiveZonesChild = DefectiveZonesChildModel.DefectiveZonesChild;

@Injectable({
  providedIn: 'root'
})
export class DefectiveZonesService {

  /**Urls for group Defective Zones service */
  private groupDefectiveZonesUrl: string = environment.apiBase + "/defects/zones/parent";
  private singleDefectiveZonesUrl: string = environment.apiBase + "/defects/zones/parent/{{id}}";
  private defectiveChildZonesUrl: string = environment.apiBase + "/defects/zones/child";
  private singleDefectiveChildZonesUrl: string = environment.apiBase + "/defects/zones/child/{{id}}";

  displayedColumns: string[] = ['name'];

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider
  ) { }

  /**
   * Get all group Defective Zones
   * @returns all Defective Zones
   */
  getIndex(): Observable<Array<DefectiveZonesModel.DefectiveZonesParent>> {
    return this.http.get<DefectiveZonesModel.ResponseDefectiveZonesParent>(this.groupDefectiveZonesUrl).pipe(map(response => {
      return response.data;
    }));
  }

  /**
   * Get an group Defective Zones by id
   * @param id - the id of group Defective Zones
   * @returns the Defective Zones requested
   */
  getShow(id: number): Observable<DefectiveZonesModel.DefectiveZonesParent> {
    return this.http.get<DefectiveZonesModel.ResponseSingleDefectiveZonesParent>(this.singleDefectiveZonesUrl.replace("{{id}}", String(id))).pipe(map(response => {
      return response.data;
    }));
  }

  /**
   * Save a new group into server
   * @param groupDefectiveZones the group to be saved
   */
  store(groupDefectiveZones: DefectiveZonesModel.RequestDefectiveZonesParent): Observable<DefectiveZonesModel.DefectiveZonesParent> {
    return this.http.post<DefectiveZonesModel.ResponseSingleDefectiveZonesParent>(this.groupDefectiveZonesUrl, groupDefectiveZones).pipe(map(response => {
      return response.data;
    }));
  }

  /**
   * Save a new group into server
   * @param singleDefectiveZones the group to be saved
   */
  storeChild(singleDefectiveZones: DefectiveZonesChildModel.RequestDefectiveZonesChild): Observable<DefectiveZonesChildModel.DefectiveZonesChild> {
    return this.http.post<DefectiveZonesChildModel.ResponseSingleDefectiveZonesChild>(this.defectiveChildZonesUrl, singleDefectiveZones).pipe(map(response => {
      return response.data;
    }));
  }

  /**
   * Update a new group into server
   * @param id - the id of the group to  be updated
   * @param groupDefectiveZones the new group
   */
  update(id: number, groupDefectiveZones: DefectiveZonesModel.RequestDefectiveZonesParent): Observable<DefectiveZonesModel.DefectiveZonesParent> {
    return this.http.put<DefectiveZonesModel.ResponseSingleDefectiveZonesParent>(this.singleDefectiveZonesUrl
      .replace("{{id}}", String(id)), groupDefectiveZones).pipe(map(response => {
        return response.data;
      }));
  }

  /**
   * Update a new group into server
   * @param id - the id of the group to  be updated
   * @param singleDefectiveZones the new group
   */
  updateChild(id: number, singleDefectiveZones: DefectiveZonesChildModel.RequestDefectiveZonesChild): Observable<DefectiveZonesChildModel.DefectiveZonesChild> {
    return this.http.put<DefectiveZonesChildModel.ResponseSingleDefectiveZonesChild>(this.singleDefectiveChildZonesUrl
      .replace("{{id}}", String(id)), singleDefectiveZones).pipe(map(response => {
      return response.data;
    }));
  }

  newUpdateChild(child: DefectiveZonesChild): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.put(this.singleDefectiveChildZonesUrl.replace("{{id}}", String(child.id)), child);
  }

  /**
  * Delete a group in server
  * @param id - the id of the group to be deleted
  */
  delete(id: number) {
    return this.http.delete(this.singleDefectiveZonesUrl.replace("{{id}}", String(id)));
  }

  /**
  * Delete a group in server
  * @param id - the id of the group to be deleted
  */
  deleteChildren(id: number) {
    return this.http.delete(this.singleDefectiveChildZonesUrl.replace("{{id}}", String(id)));
  }

}
