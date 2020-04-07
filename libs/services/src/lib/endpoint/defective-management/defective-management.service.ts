import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DefectiveManagementModel } from '../../../models/endpoints/defective-management-model';
import { DefectiveManagementChildModel } from '../../../models/endpoints/DefectiveManagementChild';
import DefectiveManagementChild = DefectiveManagementChildModel.DefectiveManagementChild;
import { HttpRequestModel } from "../../../models/endpoints/HttpRequest";
import { RequestsProvider } from "../../../providers/requests/requests.provider";

@Injectable({
  providedIn: 'root'
})
export class DefectiveManagementService {

  /**Urls for group Defective Management service */
  private groupDefectiveManagementUrl: string = environment.apiBase + "/defects/parent";
  private singleDefectiveManagementUrl: string = environment.apiBase + "/defects/parent/{{id}}";
  private defectiveChildManagementUrl: string = environment.apiBase + "/defects/child";
  private singleDefectiveChildManagementUrl: string = environment.apiBase + "/defects/child/{{id}}";

  displayedColumns: string[] = ['name'];

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider
  ) { }

  /**
   * Get all group Defective Management
   * @returns all Defective Management
   */
  getIndex(): Observable<Array<DefectiveManagementModel.DefectiveManagementParent>> {
    return this.http.get<DefectiveManagementModel.ResponseDefectiveManagementParent>(this.groupDefectiveManagementUrl).pipe(map(response => {
      return response.data;
    }));
  }

  /**
   * Get an group Defective Management by id
   * @param id - the id of group Defective Management
   * @returns the Defective Management requested
   */
  getShow(id: number): Observable<DefectiveManagementModel.DefectiveManagementParent> {
    return this.http.get<DefectiveManagementModel.ResponseSingleDefectiveManagementParent>(this.singleDefectiveManagementUrl.replace("{{id}}", String(id))).pipe(map(response => {
      return response.data;
    }));
  }

  /**
   * Save a new group into server
   * @param groupDefectiveManagement the group to be saved
   */
  store(groupDefectiveManagement: DefectiveManagementModel.RequestDefectiveManagementParent): Observable<DefectiveManagementModel.DefectiveManagementParent> {
    return this.http.post<DefectiveManagementModel.ResponseSingleDefectiveManagementParent>(this.groupDefectiveManagementUrl, groupDefectiveManagement).pipe(map(response => {
      return response.data;
    }));
  }

  /**
   * Save a new group into server
   * @param singleDefectiveManagement the group to be saved
   */
  storeChild(singleDefectiveManagement: DefectiveManagementChildModel.RequestDefectiveManagementChild): Observable<DefectiveManagementChildModel.DefectiveManagementChild> {
    return this.http.post<DefectiveManagementChildModel.ResponseSingleDefectiveManagementChild>(this.defectiveChildManagementUrl, singleDefectiveManagement).pipe(map(response => {
      return response.data;
    }));
  }

  /**
   * Update a new group into server
   * @param id - the id of the group to  be updated
   * @param groupDefectiveManagement the new group
   */
  update(id: number, groupDefectiveManagement: DefectiveManagementModel.RequestDefectiveManagementParent): Observable<DefectiveManagementModel.DefectiveManagementParent> {
    return this.http.put<DefectiveManagementModel.ResponseSingleDefectiveManagementParent>(this.singleDefectiveManagementUrl
      .replace("{{id}}", String(id)), groupDefectiveManagement).pipe(map(response => {
        return response.data;
      }));
  }

  /**
   * Update a new group into server
   * @param id - the id of the group to  be updated
   * @param singleDefectiveManagement the new group
   */
  updateChild(id: number, singleDefectiveManagement: DefectiveManagementChildModel.RequestDefectiveManagementChild): Observable<DefectiveManagementChildModel.DefectiveManagementChild> {
    return this.http.put<DefectiveManagementChildModel.ResponseSingleDefectiveManagementChild>(this.singleDefectiveChildManagementUrl
      .replace("{{id}}", String(id)), singleDefectiveManagement).pipe(map(response => {
      return response.data;
    }));
  }

  newUpdateChild(child: DefectiveManagementChild): Promise<HttpRequestModel.Response> {
    return this.requestsProvider.put(this.singleDefectiveChildManagementUrl.replace("{{id}}", String(child.id)), child);
  }

  /**
  * Delete a group in server
  * @param id - the id of the group to be deleted
  */
  delete(id: number) {
    return this.http.delete(this.singleDefectiveManagementUrl.replace("{{id}}", String(id)));
  }

  /**
  * Delete a group in server
  * @param id - the id of the group to be deleted
  */
  deleteChildren(id: number) {
    return this.http.delete(this.singleDefectiveChildManagementUrl.replace("{{id}}", String(id)));
  }

}
