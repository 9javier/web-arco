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
  private storeUrl:string = environment.apiBase+"/picking/calendar/";
  private storeTemplateUrl:string = environment.apiBase+"/picking/calendar/template/";
  private templatesByDateUrl:string = environment.apiBase+"/picking/calendar/warehouses-by-dates";
  private getBaseUrl:string = environment.apiBase+"/picking/calendar/warehouses";
  private getCalendarDatesUrl:string = environment.apiBase+"/picking/calendar/calendar-dates";


  constructor(private http: HttpClient) {}

  /**
   * Store new ??? in s erver
   */
  store(value:any):Observable<CalendarModel.Template>{
      return this.http.post<CalendarModel.SingleTemplateRequest>(this.storeUrl,value).pipe(map(response=>{
          return response.data;
      }));
  }

   /**
   * Store new ??? in s erver
   */
  storeTemplate(value:CalendarModel.SingleTemplateParams):Observable<CalendarModel.Template>{
    return this.http.post<CalendarModel.SingleTemplateRequest>(this.storeTemplateUrl,value).pipe(map(response=>{
        return response.data;
    }));
}

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
   * Get the warehouses templates by url
   * @param dates - the list of dates to search
   */
  getTemplatesByDate(dates:Array<string>):Observable<Array<CalendarModel.Template>>{
    return this.http.post<CalendarModel.CollectionTemplateRequest>(this.templatesByDateUrl,{
        calendars:dates
    }).pipe(map(response=>{
        return response.data;
    }));
  }

  /**
   * Get the base with request bad builded
   */
  getBaseBad():Observable<Array<CalendarModel.TemplateWarehouse>>{
    return this.http.get<CalendarModel.BadRequest>(this.getBaseUrl).pipe(map(response=>{
        return response.data;
    }));
  }

  /**
   * Get the dates in the calendar that have templates saveds
   * @returns te array of dates that have templates saveds
   */
  getCalendarDates():Observable<Array<string>>{
    return this.http.get<CalendarModel.CalendarDateResponse>(this.getCalendarDatesUrl).pipe(map(response=>{
        return response.data.map(date=>date.split("T")[0]);
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
