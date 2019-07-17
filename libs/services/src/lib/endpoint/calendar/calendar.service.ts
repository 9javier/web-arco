import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';

import { CalendarModel } from '../../../models/endpoints/calendar.model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  /**Urls for groups service */
  private getShowTemplateUrl:string = environment.apiBase+"/picking/calendar/template/{{id}}";
  private getIndexTemplateUrl:string = environment.apiBase+"/picking/calendar/template";

  constructor(private http: HttpClient) {}

  /**
   * Get template by the id
   * @param id - id that by found
   * @returns the requested template
   */
  showTemplate(id:number):Observable<CalendarModel.Template>{
    return this.http.get<CalendarModel.SingleTemplateRequest>(
        this.getShowTemplateUrl.replace("{{id}}",String(id))
        ).pipe(map(response=>{
        return response.data;
    }));
  }

  /**
   * Retrieve a list of templates
   * @returns list with all templates
   */
  getTemplates():Observable<Array<CalendarModel.Template>>{
    return this.http.get<CalendarModel.CollectionTemplateRequest>(this.getIndexTemplateUrl).pipe(map(response=>{
        return response.data;
    }));
  }

  /**
   * @returns the base over the templates modified
   */
  getBase():Observable<CalendarModel.Template>{
    return (of<any>(
        
            {
                createdAt: "2019-07-16T18:37:52.000Z",
                updatedAt: "2019-07-16T18:37:52.000Z",
                id: 1,
                warehouses: [
                    {
                        createdAt: "2019-07-16T18:37:52.000Z",
                        updatedAt: "2019-07-16T18:37:52.000Z",
                        id: 1,
                        originWarehouse: {
                            id: 1,
                            name: "VIRTUAL (SUPERFERIA)",
                            description: "VIRTUAL (SUPERFERIA)",
                            reference: "001",
                            is_store: true,
                            is_main: false,
                            has_racks: true,
                            is_outlet: false,
                            prefix_container: null
                        },
                        warehousesDestinations: [
                            {
                                createdAt: "2019-07-16T18:37:52.000Z",
                                updatedAt: "2019-07-16T18:37:52.000Z",
                                id: 1,
                                destinationWarehouse: {
                                    id: 2,
                                    name: "KRACK PONTEVEDRA",
                                    description: "KRACK PONTEVEDRA",
                                    reference: "002",
                                    is_store: true,
                                    is_main: false,
                                    has_racks: false,
                                    is_outlet: false,
                                    prefix_container: null
                                }
                            },
                            {
                                createdAt: "2019-07-16T18:37:52.000Z",
                                updatedAt: "2019-07-16T18:37:52.000Z",
                                id: 2,
                                destinationWarehouse: {
                                    id: 3,
                                    name: "Almacén CLOUD",
                                    description: "Almacén CLOUD",
                                    reference: "000",
                                    is_store: true,
                                    is_main: true,
                                    has_racks: true,
                                    is_outlet: false,
                                    prefix_container: null
                                }
                            }
                        ]
                    },
                    {
                        createdAt: "2019-07-16T18:37:52.000Z",
                        updatedAt: "2019-07-16T18:37:52.000Z",
                        id: 2,
                        originWarehouse: {
                            id: 2,
                            name: "KRACK PONTEVEDRA",
                            description: "KRACK PONTEVEDRA",
                            reference: "002",
                            is_store: true,
                            is_main: false,
                            has_racks: false,
                            is_outlet: false,
                            prefix_container: null
                        },
                        warehousesDestinations: [
                            {
                                createdAt: "2019-07-16T18:37:52.000Z",
                                updatedAt: "2019-07-16T18:37:52.000Z",
                                id: 3,
                                destinationWarehouse: {
                                    id: 1,
                                    name: "VIRTUAL (SUPERFERIA)",
                                    description: "VIRTUAL (SUPERFERIA)",
                                    reference: "001",
                                    is_store: true,
                                    is_main: false,
                                    has_racks: true,
                                    is_outlet: false,
                                    prefix_container: null
                                }
                            },
                            {
                                createdAt: "2019-07-16T18:37:52.000Z",
                                updatedAt: "2019-07-16T18:37:52.000Z",
                                id: 4,
                                destinationWarehouse: {
                                    id: 3,
                                    name: "Almacén CLOUD",
                                    description: "Almacén CLOUD",
                                    reference: "000",
                                    is_store: true,
                                    is_main: true,
                                    has_racks: true,
                                    is_outlet: false,
                                    prefix_container: null
                                }
                            }
                        ]
                    }
                ]
            }
        ));
  }

}
